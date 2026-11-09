# Dastak — Pakistan's Everyday Bazaar

A complete MERN e-commerce website built for shoppers in Pakistan. Browse a curated
bazaar of lawn suits, Peshawari chappals, electronics, homeware, beauty, groceries and
sports goods, check out with cash on delivery or a wallet transfer, and track the order
through a delivery timeline. Admins get their own dashboard for products and orders.

Everything runs locally with **zero database setup** — if no MongoDB URI is configured,
the API starts a persistent MongoDB process and stores its files in `server/.data/mongo`.

---

## Quick start

**Prerequisites:** Node.js 18+ (built and tested on Node 24) and npm.

```bash
# 1. Install dependencies for both workspaces
npm install

# 2. Start the API (:5000) and the Vite dev server (:5173) together
npm run dev
```

Open <http://localhost:5173>.

The first boot seeds 18 products, 6 categories, reviews and demo orders. No `.env` file is
required for local development — copy `server/.env.example` to `server/.env` only when you
want to change ports, pricing, or point at MongoDB Atlas.

### Demo accounts

| Role     | Email                 | Password      |
| -------- | --------------------- | ------------- |
| Admin    | `admin@dastak.pk`     | `Admin@123`   |
| Customer | `customer@dastak.pk`  | `Customer@123`|

Both demo logins are available as one-click buttons on the sign-in page. The admin desk
lives at `/admin`.

---

## Scripts

Run from the project root:

| Command          | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `npm run dev`    | API with `node --watch` + Vite dev server, side by side          |
| `npm run server` | API only, on <http://localhost:5000>                             |
| `npm run client` | Storefront only, on <http://localhost:5173>                      |
| `npm run seed`   | Wipe and reseed the catalog, users, reviews and demo orders      |
| `npm run build`  | Production build of the storefront into `client/dist`            |
| `npm start`      | Start the API without watch mode                                 |

> `npm run seed` is destructive: it deletes all products, categories, orders, reviews and
> users before reseeding.

---

## Configuration

Copy `server/.env.example` to `server/.env` and adjust as needed.

| Variable                 | Default                  | Notes                                                        |
| ------------------------ | ------------------------ | ------------------------------------------------------------ |
| `PORT`                   | `5000`                   | API port                                                     |
| `MONGODB_URI`            | _(empty)_                | Leave blank for the local persistent database; set a MongoDB Atlas URI for cloud |
| `MONGODB_DB`             | `dastak`                 | Database name                                                |
| `JWT_SECRET`             | demo value               | Replace with a long random string before deploying           |
| `JWT_EXPIRES_IN`         | `7d`                     | Token lifetime                                               |
| `CLIENT_URL`             | `http://localhost:5173`  | CORS origin for the storefront                               |
| `SHIPPING_FLAT`          | `250`                    | Flat delivery fee in PKR                                     |
| `FREE_SHIPPING_THRESHOLD`| `5000`                   | Order total that unlocks free delivery                       |
| `AUTO_SEED`              | `true`                   | Seed the catalog automatically when the database is empty    |

### Using MongoDB Atlas

1. Create a free cluster at <https://cloud.mongodb.com> and a database user.
2. Allow your IP in **Network Access**.
3. Put the connection string in `server/.env`:

   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/dastak?retryWrites=true&w=majority
   ```

4. Restart the API. The first boot seeds the catalog automatically.

---

## What's included

**Storefront**

- Editorial home page: hero, category aisles, bestsellers, winter promo, new arrivals,
  customer testimonials.
- Shop page with keyword search, category and price filters, sorting and pagination.
- Product pages with gallery, discount pricing, stock states, specs, and reviews.
- Persistent bag with quantity steppers, free-delivery progress and stock caps.
- Checkout with Pakistani provinces/cities, COD, Easypaisa, JazzCash and bank transfer.
- JWT authentication, account profile, order history and a per-order delivery timeline.
- About, Contact/FAQ and a 404 page, plus toast notifications throughout.

**Admin desk** (`/admin`, admin role only)

- Dashboard with revenue, order, product and customer stats, recent orders, low stock,
  status breakdown and quick actions.
- Product list with search, category filter and pagination; full create/edit forms with a
  live preview; delete confirmation.
- Order list with search and status filter; inline status updates, mark-paid toggle and a
  guarded cancel flow that returns items to stock.

**API**

- Express 4 + Mongoose 8, JWT auth with bcrypt hashing and rate-limited login/register.
- Products with search, filters, sort and pagination; categories with live product counts.
- Orders use atomic stock decrements with rollback if any line fails.
- Cancelling an order restores inventory; marking an order delivered marks it paid.
- Role-based middleware protects every admin endpoint.

---

## Project structure

```
dastak/
├─ client/                  React 19 + Vite 6 storefront
│  ├─ public/
│  │  ├─ images/            hero artwork
│  │  └─ products/          generated SVG product illustrations
│  └─ src/
│     ├─ api/               axios instance and interceptors
│     ├─ components/        header, footer, cards, steppers, states
│     ├─ context/           auth, cart and toast providers
│     ├─ hooks/             categories loader
│     ├─ lib/               PKR formatting, shipping constants
│     ├─ pages/             storefront pages
│     ├─ pages/admin/       dashboard, products, orders, product form
│     └─ styles/            design system and responsive rules
├─ server/                  Express API
│  ├─ scripts/              SVG product-art generator
│  └─ src/
│     ├─ config/            environment and database connection
│     ├─ controllers/       auth, products, categories, orders, reviews
│     ├─ middleware/        auth, roles, errors
│     ├─ models/            User, Product, Category, Order, Review
│     ├─ routes/            REST route definitions
│     ├─ seed/              Pakistani catalog and demo data
│     └─ utils/             helpers
├─ package.json             npm workspaces + root scripts
└─ README.md
```

---

## API overview

Base URL: `http://localhost:5000/api`

| Method   | Endpoint                     | Access  | Purpose                                  |
| -------- | ---------------------------- | ------- | ---------------------------------------- |
| `POST`   | `/auth/register`             | Public  | Create a customer account                |
| `POST`   | `/auth/login`                | Public  | Sign in and receive a JWT                |
| `GET`    | `/auth/me`                   | Private | Current user profile                     |
| `GET`    | `/products`                  | Public  | Search, filter, sort, paginate products  |
| `GET`    | `/products/slug/:slug`       | Public  | Product detail by slug                   |
| `GET`    | `/products/id/:id`           | Public  | Product detail by id                     |
| `GET`    | `/products/admin/list`       | Admin   | Admin product table (includes hidden)    |
| `POST`   | `/products`                  | Admin   | Create a product                         |
| `PUT`    | `/products/:id`              | Admin   | Update a product                         |
| `DELETE` | `/products/:id`              | Admin   | Delete a product and its reviews         |
| `GET`    | `/categories`                | Public  | Categories with product counts           |
| `GET`    | `/products/:id/reviews`      | Public  | Reviews for a product                    |
| `POST`   | `/products/:id/reviews`      | Private | Add or update your review                |
| `POST`   | `/orders`                    | Private | Place an order                           |
| `GET`    | `/orders/mine`               | Private | Your order history                       |
| `GET`    | `/orders/:id`                | Private | Order detail (owner or admin)            |
| `GET`    | `/orders/admin`              | Admin   | All orders with filters                  |
| `PATCH`  | `/orders/:id/status`         | Admin   | Update status or paid flag               |
| `GET`    | `/admin/stats`               | Admin   | Dashboard metrics                        |

Protected endpoints expect `Authorization: Bearer <token>`.

---

## Notes

- **Product imagery** is original SVG art generated by
  `server/scripts/generate-product-art.js` and served from `client/public/products`.
  Re-run the script (from the `server` folder, with dependencies installed) to regenerate
  the illustrations.
- **Local database files** live in `server/.data/mongo` and are git-ignored. Delete that
  folder to start from a fresh database; the API reseeds on the next boot.
- **Pricing** is displayed as `Rs 4,850`. Delivery is a flat Rs 250 and free over Rs 5,000.
  To change these, set `SHIPPING_FLAT` and `FREE_SHIPPING_THRESHOLD` in `server/.env`
  **and** update the matching constants in `client/src/lib/format.js` so the bag summary
  stays in sync with the API.
- **Serving a production build:** `npm run build && npm start` serves the compiled
  storefront and the API together from <http://localhost:5000>. You can also host
  `client/dist` on a static host and point it at the API; in that case set `CLIENT_URL`
  on the API to the deployed origin and use a strong `JWT_SECRET`.
