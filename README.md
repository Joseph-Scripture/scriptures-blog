# Scriptures Blog API

## Overview
The Scriptures Blog API is a robust content management backend built with Node.js and Express. It leverages Prisma ORM for type-safe database interactions with a PostgreSQL instance, featuring a secure JWT-based authentication system with refresh token persistence and comprehensive CRUD functionality for blog posts and community comments.

## Features
- **Prisma ORM**: Utilized for schema modeling and type-safe database queries.
- **JWT Authentication**: Secure access via short-lived access tokens and long-lived refresh tokens stored in the database.
- **Express Validator**: Strict server-side validation for user inputs and credentials.
- **Bcryptjs**: Industry-standard hashing for secure user password storage.
- **PostgreSQL**: Relational data modeling for users, posts, and comments with established foreign key relationships.

## Getting Started

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:Joseph-Scripture/scriptures-blog.git
   ```
2. Navigate to the project directory:
   ```bash
   cd scriptures-blog
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure the environment variables (see below).
5. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
Create a `.env` file in the root directory and include the following:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/scriptures_db?schema=public"
JWT_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
```

## API Documentation
### Base URL
`http://localhost:4000/api`

### Endpoints

#### [POST] /auth/register
**Request**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```
**Response**:
```json
{
  "message": "User created and logged in successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbG..."
}
```
**Errors**:
- 400: User already exists or validation failed.
- 500: Server error.

#### [POST] /auth/login
**Request**:
```json
{
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```
**Response**:
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbG...",
  "refreshToken": "def456..."
}
```
**Errors**:
- 400: Invalid credentials.

#### [POST] /auth/logout
**Request**:
```json
{
  "refreshToken": "def456..."
}
```
**Response**:
```json
{
  "message": "Logged out successfully"
}
```

#### [GET] /posts
**Request**:
Headers: `Authorization: Bearer <token>`

**Response**:
```json
[
  {
    "id": 1,
    "title": "My First Post",
    "content": "This is the content...",
    "published": true,
    "author": {
      "username": "johndoe",
      "email": "john@example.com"
    },
    "comments": []
  }
]
```

#### [POST] /post
**Request**:
```json
{
  "title": "New Blog Post",
  "content": "Exploring Node.js and Prisma."
}
```
**Response**:
```json
{
  "message": "Post created successfully by johndoe",
  "post": { "id": 2, "title": "..." }
}
```

#### [GET] /post/:id
**Request**:
Headers: `Authorization: Bearer <token>`

**Response**:
```json
{
  "id": 1,
  "title": "My First Post",
  "author": { "username": "johndoe" },
  "comments": []
}
```

#### [PUT] /post/:id
**Request**:
```json
{
  "title": "Updated Title",
  "content": "Updated content."
}
```
**Response**:
```json
{
  "message": "Post updated successfully",
  "post": { "id": 1, "title": "Updated Title" }
}
```
**Errors**:
- 403: User is not the author of the post.

#### [DELETE] /post/:id
**Response**:
```json
{
  "message": "Post deleted successfully"
}
```

#### [PUT] /post/publish/:id
**Response**:
```json
{
  "message": "Post published successfully",
  "post": { "id": 1, "published": true }
}
```

#### [POST] /posts/:postId/comments
**Request**:
```json
{
  "content": "This is a great insight!"
}
```
**Response**:
```json
{
  "message": "Comment created successfully",
  "comment": { "id": 1, "content": "..." }
}
```

#### [GET] /posts/:postId/comments
**Response**:
```json
{
  "comments": [
    {
      "id": 1,
      "content": "Insightful post!",
      "author": { "username": "johndoe" }
    }
  ]
}
```

#### [PUT] /comments/:id
**Request**:
```json
{
  "content": "Edited comment text"
}
```
**Response**:
```json
{
  "message": "Comment updated successfully",
  "updatedComment": { "id": 1, "content": "Edited comment text" }
}
```

#### [DELETE] /comment/:id
**Response**:
```json
{
  "message": "Comment deleted successfully"
}
```

## Technologies Used
| Technology | Purpose |
| :--- | :--- |
| [Node.js](https://nodejs.org/) | JavaScript Runtime |
| [Express](https://expressjs.com/) | Web Framework |
| [Prisma](https://www.prisma.io/) | Next-generation ORM |
| [PostgreSQL](https://www.postgresql.org/) | Relational Database |
| [JSON Web Tokens](https://jwt.io/) | Authentication |
| [Bcryptjs](https://www.npmjs.com/package/bcryptjs) | Security |

## Contributing
- 🚀 Fork the project and create a feature branch.
- 🛠 Ensure all environment variables are correctly mapped for testing.
- 📝 Maintain consistent coding styles as defined in the project structure.
- ✅ Submit a Pull Request with a clear description of changes.

## Author
**Joseph Scripture**
- [GitHub](https://github.com/Joseph-Scripture)
- [LinkedIn](https://linkedin.com/in/yourusername)
- [Twitter](https://twitter.com/yourusername)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)