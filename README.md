# Ecommerce SaaS API

This API provides multi-tenant management, user authentication, plan subscriptions, and secure credential handling for an ecommerce SaaS platform.  
It is built with Node.js, Express, Sequelize (MySQL), and supports secure email notifications via Gmail OAuth2.

---

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [User](#user)
  - [Tenant](#tenant)
  - [Plan](#plan)
- [Error Handling](#error-handling)
- [Security](#security)
- [Email Integration](#email-integration)
- [WooCommerce & WordPress Gateway](#woocommerce--wordpress-gateway)

---

## Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure your `.env` file** (see below)
4. **Run migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```
5. **Start the server**
   ```bash
   npm run dev
   ```
   Or use Docker Compose:
   ```bash
   docker-compose up --build
   ```

---

## Environment Variables

Add these to your `.env` file:

```properties
DB_NAME=ecommerce
DB_USER=user
DB_PASS=password
DB_HOST=db
DB_PORT=3306

JWT_SECRET=your_jwt_secret
SUPER_PASSWORD=your_super_password

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your@gmail.com
EMAIL_CLIENT_ID=your_google_client_id
EMAIL_CLIENT_SECRET=your_google_client_secret
EMAIL_REFRESH_TOKEN=your_google_refresh_token
EMAIL_FROM=your@gmail.com

OTP_EXP_TIME=600000
ENCRYPTION_SECRET=your_encryption_secret
```

---

## Endpoints

### Auth

#### `POST /auth/login`
Authenticate user and get JWT.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SuperSegura123!"
}
```
**Response:**
```json
{
  "token": "JWT_TOKEN"
}
```

---

#### `POST /auth/send-otp`
Send OTP code to user's email for password reset.

**Request:**
```json
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "message": "OTP enviado"
}
```

---

#### `PUT /auth/change-password`
Change password using OTP.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "new_password": "NuevaPasswordSegura123!"
}
```
**Response:**
```json
{
  "message": "Contraseña cambiada exitosamente"
}
```

---

### User

#### `POST /super/user/create`
Create a new user (admin only).

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "SuperSegura123!",
  "tenant_id": 1,
  "name": "Juan",
  "last_name": "Pérez"
}
```
**Response:**
```json
{
  "user": { ... }
}
```

---

#### `GET /super/user/`
Get all users.

**Response:**
```json
[
  { ...user1 },
  { ...user2 }
]
```

---

#### `GET /super/user/:id`
Get user by ID.

**Response:**
```json
{ ...user }
```

---

#### `PUT /super/user/:id`
Update user info (password will be hashed if provided).

**Request:**
```json
{
  "name": "NuevoNombre",
  "password": "NuevaPasswordSegura123!"
}
```
**Response:**
```json
{ ...user }
```

---

#### `DELETE /super/user/:id`
Delete user.

**Response:**
```json
{ "message": "Usuario eliminado correctamente." }
```

---

### Tenant

#### `POST /super/tenant/create`
Create a new tenant (admin only).

**Request:**
```json
{
  "name": "Tienda Ejemplo",
  "national_id": "123456789",
  "national_id_type": "NIT",
  "url": "https://tienda.com",
  "wp_public_key": "wp_pub",
  "wp_private_key": "wp_priv",
  "woo_public_key": "woo_pub",
  "woo_private_key": "woo_priv"
}
```
**Response:**
```json
{ ...tenant }
```

---

#### `GET /super/tenant/`
Get all tenants.

**Response:**
```json
[
  { ...tenant1 },
  { ...tenant2 }
]
```

---

#### `GET /super/tenant/:id`
Get tenant by ID.

**Response:**
```json
{ ...tenant }
```

---

#### `PUT /super/tenant/:id`
Update tenant info (keys will be encrypted).

**Request:**
```json
{
  "name": "NuevoNombre",
  "wp_public_key": "nuevo_wp_pub"
}
```
**Response:**
```json
{ ...tenant }
```

---

#### `DELETE /super/tenant/:id`
Delete tenant (will fail if plans are associated).

**Response:**
```json
{ "message": "Tenant eliminado correctamente." }
```
Or, if there are associated plans:
```json
{
  "error": "No se puede eliminar el tenant porque tiene planes asociados.",
  "details": "..."
}
```

---

### Plan

#### `POST /super/plan/create`
Create a new plan for a tenant.

**Request:**
```json
{
  "tenant_id": 1,
  "start_date": "2025-08-27T00:00:00.000Z",
  "end_date": "2025-09-27T00:00:00.000Z",
  "price": 99.99,
  "description": "Plan mensual oro",
  "type": "ORO"
}
```
**Response:**
```json
{ ...plan }
```

---

#### `GET /super/plan/`
Get all plans.

**Response:**
```json
[
  { ...plan1 },
  { ...plan2 }
]
```

---

#### `GET /super/plan/:id`
Get plan by ID.

**Response:**
```json
{ ...plan }
```

---

#### `PUT /super/plan/:id`
Update plan info.

**Request:**
```json
{
  "price": 149.99,
  "description": "Actualización de plan"
}
```
**Response:**
```json
{ ...plan }
```

---

#### `DELETE /super/plan/:id`
Delete plan.

**Response:**
```json
{ "message": "Plan eliminado correctamente." }
```

---

## Error Handling

- All endpoints return clear error messages and HTTP status codes.
- Unique constraint, validation, and foreign key errors are handled gracefully.

---

## Security

- Passwords are hashed using bcrypt.
- Sensitive keys are encrypted before storing in the database.
- JWT is used for authentication.
- `/super/*` routes require the `x-super-password` header with the value from `SUPER_PASSWORD` in `.env`.

---

## Email Integration

- Emails are sent using Gmail OAuth2.
- Welcome emails are sent on user creation.
- OTP codes are sent for password reset.
- Configure Gmail OAuth2 credentials in `.env` as described above.

---

## WooCommerce & WordPress Gateway

The API provides generic gateway endpoints for WooCommerce and WordPress REST API resources, allowing secure proxying of requests to tenant-specific stores.

### Authentication

All requests to these gateways require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Usage

- **WooCommerce Gateway:**  
  Send requests to `/api/woo/<resource>`  
  Example:  
  ```
  GET /api/woo/orders?status=completed
  POST /api/woo/products
  ```

- **WordPress Gateway:**  
  Send requests to `/api/wp/<resource>`  
  Example:  
  ```
  GET /api/wp/media
  POST /api/wp/comments
  ```

The gateway will automatically route, authenticate, and proxy requests to the correct tenant’s WooCommerce or WordPress API, using credentials stored for each tenant.

**Note:**  
- Only allowed resources can be accessed (see code for allowed resource lists).
- All requests must use standard REST methods (`GET`, `POST`, `PUT`, `DELETE`).

---

## Health Check

#### `GET /health`
Returns `{ ok: true }` if the API is running.

---

## License

MIT

---

## Contact

For support, open an issue or contact the maintainer.