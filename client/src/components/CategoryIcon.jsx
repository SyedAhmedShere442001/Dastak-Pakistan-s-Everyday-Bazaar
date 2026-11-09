import {
  ShoppingBag,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  Trophy
} from 'lucide-react';

const ICONS = {
  shirt: Shirt,
  devices: Smartphone,
  home: Sofa,
  sparkles: Sparkles,
  basket: ShoppingBasket,
  trophy: Trophy
};

export default function CategoryIcon({ icon, size = 22, ...props }) {
  const Icon = ICONS[icon] || ShoppingBag;
  return <Icon size={size} strokeWidth={1.8} {...props} />;
}
