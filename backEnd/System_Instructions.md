Project Blueprint: Hadaya (Social Gifting Platform)
📌 General Overview
Project Name: Hadaya (هدايا)

Goal: A social gifting platform where users send gifts via a "Gift Token" link.

Tech Stack: Node.js (TypeScript), Express.js, Prisma ORM, PostgreSQL (Supabase).

Architecture: Decoupled Architecture (Separate Backend/Frontend), N-Tier Design Pattern.

🏗️ Backend Folder Structure & Architecture
The project follows a strict Routes -> Controllers -> Services flow to ensure separation of concerns:

Routes (/routes): Defines endpoints and attaches middlewares (Auth, Validation).

Controllers (/controllers): - Handles HTTP requests and responses.

Uses try/catch blocks and delegates all logic to services.

Errors are passed to next(error) for centralized handling.

Uses a helper function sendSuccess(res, data, message, statusCode) for all successful responses.

Services (/services): - Contains all business logic and direct database interactions using Prisma.

Never interacts with req or res objects.

Utils (/utils): - AppError.ts: A custom class for operational errors.

sendSuccess.ts: Standardized JSON response structure.

Middlewares (/middlewares): JWT verification, Role-based Access Control (RBAC), and Global Error Handling.

✍️ Coding Standards & Patterns
1. Centralized Error Handling
Every controller must follow this pattern:

TypeScript
try {
    // call service
    // sendSuccess
} catch (error) {
    next(error);
}
2. Standardized Responses
All success responses must return:

JSON
{
  "success": true,
  "message": "Custom Message",
  "data": { ... }
}
3. Service Layer Style
Services should use Prisma types and handle database-specific errors (like Prisma P2025). Passwords must always be hashed using bcrypt within the service layer before saving.

🔐 Authentication & Roles
JWT: Used for session management.

Roles: USER, ADMIN (Defined as Enum in Prisma).

Security: bcrypt for hashing, JWT for tokens, isAdmin middleware for protected routes.

📊 Current Database Schema (Key Entities)
User: id, email, password, name, role (ADMIN/USER).

Product: (In Progress) id, name, price, stock, imageUrl.

🤖 Instructions for AI Assistants
When asked to write code for this project:

Stick to the Pattern: Always write a Service, then a Controller, then a Route.

Naming Convention: Use camelCase for variables/functions and PascalCase for Classes/Types.

No Logic in Controllers: Keep them thin. Move all DB logic to Services.

Use TypeScript: Ensure proper typing for Prisma inputs and return types.

Arabic Support: Success/Error messages should be in Arabic or English as requested by the user.