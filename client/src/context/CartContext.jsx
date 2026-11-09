import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'dastak_cart';

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function toCartItem(product, qty) {
  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    brand: product.brand || '',
    price: product.price,
    image: product.images?.[0] || product.image || '/products/placeholder.svg',
    stock: Number.isFinite(product.stock) ? product.stock : 99,
    qty
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    let capped = false;

    setItems((current) => {
      const existing = current.find((item) => item._id === product._id);
      const requested = Number.isFinite(product.stock) ? Math.min(product.stock, 20) : 20;

      if (existing) {
        const nextQty = Math.min(existing.stock, existing.qty + qty);
        capped = existing.qty >= existing.stock || nextQty === existing.qty;
        return current.map((item) =>
          item._id === product._id ? { ...item, qty: nextQty, stock: product.stock } : item
        );
      }

      const initialQty = Math.max(1, Math.min(qty, requested || 1));
      capped = qty > initialQty;
      return [...current, toCartItem(product, initialQty)];
    });

    return { capped };
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((current) =>
      current.map((item) =>
        item._id === id
          ? { ...item, qty: Math.max(1, Math.min(item.stock, Number(qty) || 1)) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item._id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.qty, 0),
    [items]
  );

  const count = useMemo(() => items.reduce((total, item) => total + item.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, setQty, removeItem, clearCart, subtotal, count }),
    [items, addItem, setQty, removeItem, clearCart, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
