# Order Management System (OMS)

## Overview

This repository contains a simplified, production-oriented **Order Management System (OMS)** designed to demonstrate end-to-end full-stack application development with a clean layered architecture.

The system is intentionally scoped to remain small enough to build within a limited time window while still covering the core engineering concerns expected in a real application:
- Authentication and authorization
- Role-based access control
- Product catalog management
- Order creation and order tracking
- Inventory validation and stock reduction
- Transactional data consistency
- Server-side business rule enforcement
- Clear frontend forms, navigation, and validation

The solution is built with:

- **Backend:** FastAPI
- **Frontend:** Angular
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Migrations:** Alembic
- **Authentication:** JWT (OAuth2 password flow)
- **Password hashing:** bcrypt via Passlib

---

## Business Context

The OMS represents a simplified retail back-office application.

- An **Admin** maintains the product catalog and reviews all orders.
- A **User** logs in, browses active products, and places orders.
- Each order contains one or more items.
- Order total is calculated on the server from product price and quantity.
- Stock quantity is reduced only after a successful order creation.

The application must provide a clean user experience, predictable API behavior, and consistent data integrity across service and database layers.

---

## Goals

This project is designed to demonstrate the following capabilities:

- Authentication with username and password
- Role-based access for Admin and User
- Product CRUD with active/inactive handling
- Searchable product listing
- Order creation with multiple items
- Order listing and order details
- Order status updates with controlled transitions
- Inventory reduction on successful placement
- Transactional consistency for order and stock updates
- Validation at API, service, and database level
- A usable Angular frontend with guarded routes and form validation

---

## Out of Scope

The following are intentionally excluded:

- Microservices
- Message queues / event streaming
- Refunds, returns, and cancellations
- Multi-warehouse inventory
- Payment gateway integration
- Advanced analytics dashboards
- SSO / OAuth / external identity providers
- Distributed workflow orchestration
- Caching layers
- Advanced reporting

---

## Functional Scope

### Authentication
- Login with username and password
- Logout
- Two roles only: `Admin` and `User`
- Passwords stored as hashes only
- Admin can access product maintenance and all orders
- User can place orders and view only their own orders

### Product Management
- Admin can create, update, view, and deactivate products
- Product fields:
  - Name
  - SKU
  - Price
  - Stock quantity
  - Active flag
- Product list searchable by name or SKU
- Inactive products cannot be selected for new orders
- SKU must be unique

### Order Creation
- Authenticated users can create orders with one or more items
- Each order item includes:
  - Product
  - Quantity
- System validates stock availability before confirmation
- System calculates order total on the server
- Stock quantity is reduced atomically on successful order creation
- If stock validation fails, the order must fail without partial persistence

### Order Tracking
- User can view only their own orders
- Admin can view all orders
- Admin can update order status
- Allowed statuses:
  - Created
  - Processing
  - Completed

---

## Non-Functional Requirements

### Performance
- Typical read operations should respond within acceptable UI latency
- Avoid repeated database calls for each order item
- Prefer batch fetching and efficient joins

### Reliability
- Order creation must be transactional
- All order items and stock updates must succeed together
- Any failure must roll back the transaction

### Security
- Passwords must be hashed
- Authorization checks must protect all restricted endpoints
- Sensitive values must be read from environment variables
- Client must never be trusted for identity, role, or total amount

### Maintainability
- Use layered structure:
  - Controllers / Routers
  - Services
  - Repositories
  - Models
  - DTOs / Schemas
  - Validators
  - Tests
- Keep business logic out of route handlers
- Use dependency injection consistently where practical

### Usability
- Angular UI must include:
  - Clear forms
  - Validation messages
  - Loading states
  - Error feedback
  - Route guards

### Testability
- Core service methods must be unit testable
- Critical flows must be covered by integration tests or manual test cases

---

## Proposed Technical Architecture

A three-tier layered design is sufficient:

### Frontend
- Angular single-page application

### Backend
- FastAPI REST API

### Persistence
- PostgreSQL database accessed through SQLAlchemy
- Database migrations managed with Alembic

### Backend Layer Responsibilities

#### Routers / Controllers
- Accept HTTP requests
- Validate and parse request payloads
- Return response DTOs
- Apply authorization dependencies

#### Services
- Contain business logic
- Enforce stock validation
- Compute totals
- Enforce allowed order status transitions
- Apply ownership checks

#### Repositories / Data Access
- Encapsulate database queries
- Retrieve and persist entities
- Handle efficient filtering, search, and joins

#### DTOs / Schemas
- Define request and response contracts
- Prevent ORM entities from being exposed directly

---

## Suggested Project Structure

```text
oms/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   └── orders.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── dependencies.py
│   │   ├── db/
│   │   │   ├── session.py
│   │   │   └── base.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   └── order_item.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   └── common.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── product_service.py
│   │   │   └── order_service.py
│   │   ├── repositories/
│   │   │   ├── user_repo.py
│   │   │   ├── product_repo.py
│   │   │   └── order_repo.py
│   │   ├── utils/
│   │   └── main.py
│   ├── tests/
│   └── alembic/
├── frontend/
│   └── angular-app/
└── README.md
```

---

## Data Model

The data model is intentionally small and centered on four entities.

### User
Stores application login and role.

Fields:
- `UserId`
- `Username`
- `PasswordHash`
- `Role`
- `IsActive`

Rules:
- Username must be unique
- Role must be only `Admin` or `User`
- Password must never be stored as plaintext

### Product
Catalog item that can be ordered.

Fields:
- `ProductId`
- `Name`
- `SKU`
- `Price`
- `StockQuantity`
- `IsActive`

Rules:
- SKU must be unique
- Price must be greater than zero
- Stock quantity must be zero or positive
- Inactive products cannot be selected for new orders

### Order
Represents a placed order.

Fields:
- `OrderId`
- `OrderNo`
- `UserId`
- `Status`
- `TotalAmount`
- `CreatedAt`

Rules:
- Order number can be sequential or generated using a controlled pattern
- Status values are limited to:
  - Created
  - Processing
  - Completed
- Total amount must be calculated server-side
- CreatedAt must be stored in UTC

### OrderItem
Line items inside an order.

Fields:
- `OrderItemId`
- `OrderId`
- `ProductId`
- `Quantity`
- `UnitPrice`
- `LineTotal`

Rules:
- Quantity must be positive
- UnitPrice must be a snapshot at order time
- LineTotal = Quantity × UnitPrice

---

## Relationship Rules

- A User can place many Orders
- An Order belongs to exactly one User
- An Order contains one or more OrderItems
- An OrderItem references exactly one Product
- A Product can appear in many OrderItems across different orders

---

## Authentication and Authorization

### Authentication
Users log in using username and password. Successful login returns a JWT access token.

### Token Content
The token should include:
- User identity
- Role
- Expiration

### Authorization Strategy
Authorization must be enforced in the backend using dependencies and role checks.

Examples:
- Admin-only endpoints require `Admin`
- User endpoints require any authenticated user
- Ownership checks ensure a user can only access their own orders

### Identity Isolation Rule
The system must never trust a user ID sent by the client for protected operations.  
The backend must derive the active user from the JWT token.

---

## Access Control Rules

### Admin
Admin can:
- Create, update, list, and deactivate products
- View all orders
- Update order status

### User
User can:
- Log in and log out
- View active products
- Create orders
- View only their own orders

### Forbidden Actions
- A user cannot access Admin APIs
- A user cannot view another user’s order
- A user cannot update order status
- A user cannot place an order on behalf of another user
- An unauthenticated request cannot access protected endpoints

---

## Order Lifecycle

The recommended order lifecycle is:

```text
Created → Processing → Completed
```

### Lifecycle Rules
- The server controls all state transitions
- The client may request a change, but the server must validate it
- Invalid transitions must be rejected
- Completed orders are read-only
- Created orders are editable only before processing if edit support is added later

### Allowed Transition Policy
- `Created` → `Processing`
- `Processing` → `Completed`

All other transitions must fail.

---

## Business Rules

- Order total must always be computed on the server
- Client-sent total must be ignored
- Stock must be checked before order confirmation
- Requested quantity must not exceed available stock
- SKU must be unique
- Inactive products cannot be used in new orders
- Completed orders cannot be updated
- Orders should not be edited once they move beyond `Created`
- If order creation fails, no partial data should be saved

---

## Validation Rules

### Authentication
- Username is required
- Password is required

### Product
- Name is required
- SKU is required
- SKU cannot be empty
- SKU must be unique
- Price is required
- Price must be greater than zero
- Stock quantity must be zero or positive

### Order
- Order must contain at least one item
- Order item quantity must be greater than zero
- Requested quantity must not exceed available stock

### Status Update
- Status must be one of:
  - Created
  - Processing
  - Completed
- Only allowed transitions are accepted

---

## Edge Cases

The backend must handle the following scenarios correctly:

- Invalid login credentials return an authentication error
- Non-admin users cannot access admin APIs
- Product creation fails if the SKU already exists
- Product creation fails if required fields are missing
- Product update fails if required fields are missing
- Product price cannot be negative
- Product stock cannot be negative
- Order creation fails if quantity is zero or negative
- Order creation fails if requested quantity exceeds stock
- If two users try to order the last item, only one should succeed and the other should fail
- Any total amount sent from the client must be ignored
- Completed orders must not be updated
- Orders must not be editable after they move beyond `Created`
- If order creation fails, no partial data should be persisted

---

## API Design

The API should be REST-like and versioned if the implementation already uses versioning.

### Authentication
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | Logout user |

### Products
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | List products |
| GET | `/api/products/{id}` | Get product by id |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| PATCH | `/api/products/{id}/deactivate` | Deactivate product |

### Orders
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | List orders |
| GET | `/api/orders/{id}` | Get order details |
| PATCH | `/api/orders/{id}/status` | Update order status |

---

## API Response Expectations

The API must return consistent status codes.

- `200 OK` for successful reads and updates
- `201 Created` for successful resource creation
- `400 Bad Request` for validation failures
- `401 Unauthorized` when authentication is missing or invalid
- `403 Forbidden` when the role is insufficient
- `404 Not Found` when the requested entity does not exist
- `409 Conflict` for duplicate SKU or insufficient stock during concurrent order placement

---

## Error Response Format

All APIs should return a consistent error schema.

Example:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "sku",
      "message": "SKU must be unique"
    }
  ]
}
```

Example for authorization failure:

```json
{
  "success": false,
  "message": "Forbidden",
  "errors": []
}
```

---

## Frontend Requirements

The Angular application should remain simple and standard.

### Required Screens
- Login page with form validation
- Dashboard landing page after login
- Product list page
- Product form page for admin
- Order creation page with product selector and quantity entry
- Order listing page with filters by status and date range

### Frontend Behavior
- Use reactive forms
- Use reusable services
- Use route guards for authentication and role-based access
- Show loading states
- Display validation and server errors clearly
- Prevent unauthorized navigation in UI
- Do not rely on frontend-only restrictions for security

---

## Recommended Angular Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── services/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   └── models/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   └── orders/
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
│   └── environments/
└── angular.json
```

---

## Implementation Standards

- Use a layered folder structure
- Use DTOs for all API boundaries
- Do not expose ORM entities directly to the client
- Use dependency injection consistently
- Use transaction handling for order placement and stock deduction
- Use logging for authentication failures and critical order exceptions
- Use a consistent error response format across all APIs

---

## Transaction Handling

Order placement must be atomic.

### Required behavior
1. Validate request payload
2. Load all requested products
3. Check whether all products are active
4. Check stock availability
5. Compute total amount on server
6. Create order and order items
7. Reduce stock
8. Commit transaction

If any step fails:
- Roll back the entire transaction
- Do not persist partial data
- Return an error response

### Concurrency Requirement
If two users try to order the last available unit, only one order should succeed.  
This can be implemented using:
- Database row locking
- Serializable transaction isolation
- Optimistic concurrency control

---

## Logging

The application should log:
- Authentication failures
- Authorization failures
- Validation exceptions
- Order placement failures
- Unexpected service exceptions
- Concurrency conflicts

Logs should be useful for debugging without exposing sensitive values such as passwords, tokens, or payment details.

---

## Security Notes

- Never store plaintext passwords
- Never trust client-sent user identity or role
- Never trust client-sent order totals
- Protect all mutation endpoints
- Keep secrets in environment variables
- Use secure password hashing
- Use CORS restrictions appropriate for the deployment environment

---

## Sample Demo Flow

A demonstration should cover:

1. User logs in successfully
2. Admin logs in successfully
3. Admin creates and updates products
4. Admin deactivates a product
5. User views active products
6. User creates an order with multiple items
7. System validates stock and computes total
8. Stock is reduced atomically
9. User views only own orders
10. Admin views all orders
11. Admin updates order status from Created to Processing to Completed
12. Completed orders remain read-only

---

## Deliverables

The final repository should contain:

- Source code in a Git repository
- Working FastAPI backend
- Working Angular frontend
- Database schema or migration scripts
- README with setup and run instructions
- Architecture summary
- Basic test cases or test evidence
- Demo-ready application flow

---

## Acceptance Criteria

The implementation is considered complete when:

- User can log in and access only permitted pages
- Admin can fully manage products
- User can create an order from available products
- Stock is reduced correctly after order placement
- Order details are stored and retrievable
- Validation prevents bad data and unsafe state changes
- The application can be demonstrated end to end without manual database edits

---

## Project Status: Implemented

The OMS has been fully implemented with a FastAPI backend and an Angular frontend.

### Backend Features
- JWT Authentication with RBAC (Admin/User).
- Product CRUD with stock management.
- Transactional Order placement with atomic stock reduction and concurrency handling.
- Order status lifecycle (Created -> Processing -> Completed).

### Frontend Features
- Simple, functional UI with Angular 17+.
- Auth Guard and Interceptor for secure API access.
- Product list and search.
- Order creation with a cart-like experience.
- Order history with status updates for Admins.

### Setup and Running

#### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Configure .env based on .env.example
# Run migrations
alembic upgrade head
# Seed initial data (admin/admin123, user/user123)
python -m app.db.seed
# Start server
uvicorn app.main:app --reload
```

#### 2. Frontend Setup
```bash
cd frontend/angular-app
npm install
npm start
```

### Credentials
- **Admin**: admin / admin123
- **User**: user / user123

---

## Environment Variables

Create a `.env` file for backend configuration.

Example:

```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/oms
JWT_SECRET_KEY=replace_with_strong_secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:4200
```

---

## Testing Strategy

### Unit Tests
Cover:
- Password hashing and verification
- JWT token generation and validation
- Role checks
- Product validation
- Order total computation
- Order status transition rules

### Integration Tests
Cover:
- Login flow
- Product creation / update / deactivate
- Order creation
- Stock reduction
- Ownership checks
- Admin access control
- Concurrent stock conflict handling

### Manual Test Cases
Cover:
- Successful login
- Invalid login
- Admin-only page protection
- User order isolation
- Duplicate SKU rejection
- Stock exhaustion handling
- Completed order read-only behavior

---

## Example Business Rules Checklist

- [ ] Username and password required
- [ ] Password stored only as hash
- [ ] Admin and User roles only
- [ ] Product SKU unique
- [ ] Product price > 0
- [ ] Product stock >= 0
- [ ] Inactive products excluded from order selection
- [ ] Order contains at least one item
- [ ] Quantity > 0
- [ ] Requested quantity <= available stock
- [ ] Order total computed on server
- [ ] Stock reduced atomically
- [ ] User sees only own orders
- [ ] Admin sees all orders
- [ ] Status transitions enforced by server
- [ ] Completed orders read-only
- [ ] No partial persistence on failure

---

## Notes on Design Decisions

This requirement intentionally avoids enterprise-scale complexity. The recommended implementation keeps the architecture focused and maintainable while still demonstrating sound engineering judgment.

FastAPI is a good fit because it provides:
- High-performance request handling
- Pydantic-based validation
- Clear dependency injection
- Straightforward RBAC enforcement
- Excellent support for REST APIs

Angular is a good fit because it provides:
- Strong structure for enterprise-style UIs
- Reactive forms
- Route guards
- Component reusability
- Good alignment with the required screens and flows

---

## Reference Requirement

This README is derived from the uploaded OMS technical requirement document and is aligned to its functional, non-functional, API, validation, and acceptance criteria. fileciteturn2file0

