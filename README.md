# Expenses Tracker API

## Project Overview
The Expenses Tracker API is a Node.js backend project that allows users to manage their expenses efficiently. This RESTful API includes features for user authentication, expense management, and profile handling. Built using Express.js and Sequelize ORM, the application adheres to best practices in software development, including modular architecture and middleware for reusable components.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Routes](#routes)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Authentication
- User registration.
- Secure login and logout functionality.
- Access token and refresh token mechanisms.
- Password reset with OTP verification.

### Expense Management
- Add, retrieve, update, and delete expenses.
- Pagination support for listing expenses.

### User Profile
- Retrieve and update user profiles.
- Upload profile images.
- Delete user accounts.

---

## Technologies Used
- **Backend Framework**: Express.js
- **Database**: PostGres (using Sequelize ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Middleware**: Rate limiter, error handler, and logger
- **File Uploads**: Multer
- **Email Service**: Nodemailer for OTP-based password resets
- **API Documentation**: Postman collection

---

## Folder Structure

```
config/
    dbConfig.js
    imageUploadConfig.js
    mailConfig.js
    migrationConfig.js
    tokensConfig.js
features/
    auth/
        authControllers.js
        authRoutes.js
        authServices.js
    expenses/
        expensesControllers.js
        expensesRoutes.js
        expensesServices.js
    users/
        usersControllers.js
        usersRoutes.js
        usersServices.js
middlewares/
    appErrorHandler.js
    authenticate.js
    globalrateLimiter.js
    imageUploader.js
    logger.js
    refreshTokenMiddleware.js
    routeNotFound.js
migrations/
    <Sequelize migration files>
models/
    expenseModel.js
    logOutToken.js
    otpModel.js
    refreshTokenModel.js
    userModel.js
postman/
    ExpensesTracker API.json
schema/
    schema.sql
shared/
    apiError.js
    apiResponse.js
    httpStatusCodes.js
uploads/
utils/
    checkUserExists.js
    mailUtils.js
    passwordUtils.js
    returnError.js
    tokensUtils.js
.env
.gitignore
package-lock.json
package.json
server.js
```

---

## Routes

### Authentication
- **POST** `/api/v1/auth/register` - Register a new user.
- **POST** `/api/v1/auth/login` - User login.
- **POST** `/api/v1/auth/logout` - User logout.
- **POST** `/api/v1/auth/refresh` - Refresh access token.
- **POST** `/api/v1/auth/pwd-reset/request` - Request an OTP for password reset.
- **POST** `/api/v1/auth/pwd-reset/confirm` - Confirm the OTP and reset password.

### Expenses
- **POST** `/api/v1/expenses` - Create a new expense.
- **GET** `/api/v1/expenses?page=pageIndex` - Get expenses with pagination.
- **GET** `/api/v1/expenses/:id` - Get an expense by ID.
- **PUT** `/api/v1/expenses/:id` - Update an expense by ID.
- **DELETE** `/api/v1/expenses/:id` - Delete an expense by ID.

### User Profile
- **GET** `/api/v1/users/profile` - Get user profile details.
- **PUT** `/api/v1/users/profile` - Update user profile details.
- **DELETE** `/api/v1/users/profile` - Delete user profile.
- **POST** `/api/v1/users/profile/pic` - Upload user profile picture.

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- PostGres
- Postman (for API testing)

### Steps
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd expenses-tracker
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure environment variables in the `.env` file:
    ```
    NODE_ENV=<development or production>
    PORT = <HOST-PORT>
    DB_HOST = <database-host>
    DB_PORT = <database-port>
    DB_NAME = <database-name>
    DB_USER = <database-user>
    DB_PASS = <database-password>
    DB_DIALICT = <database-dialict>
    JWT_SECRET = <your-jwt-secret>
    EMAIL_USER = <email-user>
    EMAIL_PASSWORD = <email-password>
    ```
4. Run migrations:
    ```bash
    npx sequelize-cli db:migrate
    ```
5. Start the server:
    ```bash
    npm start
    ```

---

## Usage

1. Import the Postman collection located in `postman/ExpensesTracker API.json`.
2. Test the routes using Postman or any API client.

---

## Contributing
Contributions are welcome! Feel free to fork the repository, make changes, and submit a pull request.