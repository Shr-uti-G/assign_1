# Product Management Dashboard

A full-stack product management application with a modern e-commerce storefront UI and dedicated admin panel.

## Tech Stack

- **Frontend:** React 18, React Router, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer

## Getting Started

### Backend

```bash
cd backend
npm install
npm run seed    # Optional: seed Atlas/local MongoDB
npm run dev     # Start on http://localhost:5000
```

**MongoDB:** The app uses your Atlas URI from `.env`. If Atlas is unreachable (e.g. IP not whitelisted), it automatically falls back to an in-memory database and seeds default data. To force Atlas only, set `USE_MEMORY_DB=false` in `.env`. Whitelist your IP in [MongoDB Atlas Network Access](https://www.mongodb.com/docs/atlas/security-whitelist/) to use the cloud database.

**Default credentials:**
- Admin: `admin` / `Admin@12345678`
- User: `user` / `User@12345678`

### Frontend

```bash
cd frontend
npm install
npm run dev     # Start on http://localhost:5173
```

## Features

- Split login page: User login/signup | Admin login
- E-commerce product catalog with search & category filters
- Product detail page with pricing, stock, and description
- Admin panel for product CRUD (with image upload) and user management
- Role-based route protection (JWT)
- Loading skeletons, error states, empty states, toast notifications

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/login` | Public |
| POST | `/api/register` | Public |
| GET | `/api/products` | Authenticated |
| GET | `/api/products/:id` | Authenticated |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| GET | `/api/users` | Admin |
| POST | `/api/users` | Admin |
| DELETE | `/api/users/:id` | Admin |
