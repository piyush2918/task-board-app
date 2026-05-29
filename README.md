# Task Board App

A minimal full-stack task board application built for managing user-specific tasks.

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- bcryptjs
- JSON Web Token authentication

## Features

- User signup and login
- Secure password hashing using bcryptjs
- JWT-based authentication using httpOnly cookies
- Create tasks
- View tasks created by the logged-in user
- Update task status: Todo, In Progress, Done
- Basic loading and empty states
- Responsive UI

## Authentication Flow

Users sign up with name, email, and password. The password is hashed using bcryptjs before storing it in the database.

During login, the entered password is compared with the stored hashed password. If valid, a JWT token is created and stored in an httpOnly cookie. Protected routes and APIs read this cookie to identify the logged-in user.

## Database Schema

The application uses a relational database with a one-to-many relationship between User and Task.

```txt
User
- id
- name
- email
- password
- createdAt

Task
- id
- title
- status
- userId
- createdAt
- updatedAt


Relationship:

One User can have many Tasks.
Each Task belongs to one User.



Task Status
TODO
IN_PROGRESS
DONE


Run Locally

Clone the project:

git clone https://github.com/piyush2918/task-board-app.git

Go to the project folder:

cd task-board-program

Install dependencies:

npm install

Create .env file:

DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"

Run database migration:

npx prisma migrate dev --name init

Run the development server:

npm run dev

https://task-board-app-sage.vercel.app/signup   (vercel)

https://github.com/piyush2918/task-board-app  (github)