## Amazon Clone Backend

This is the backend folder of the Amazon Clone.
I created the clone using react native for the frontend and nodejs and express for the backend. I used mongoDB for the database.
Nodejs is the runtime used and expressjs is the framework used. This provides the server-side functionality for managing the Amazon clone.

# Features

1. RESTful API endpoints for user management and also for purchasing of products has been implemented.

1. Authentication and Authorization of users using JSON Web Tokens.

1. MongoDB integration for data storage.

1. Express.js for handling HTTP request and routing.

1. Nodemailer for sending mails.

1. Bcryptjs for hashing and comparing of password.

1. Cors for cross-origin resource sharing.

1. Dotenv for saving secret keys.

# Prerequisites

Before running the project, make sure you have the following packages installed:

1. Node.js
1. MongoDB
1. npm or yarn package manager

# Installation

1. Clone the repository.

1. Install dependencies.

1. Configure environment variables

# Usage

1. Start the MongoDB server
1. Start the server

## API Endpoints

# user routes

1. `POST /api/users/login`: login and authenticate user

1. `POST /api/users/register`: register user

1. `POST /api/users/logout`: logout user

1. `POST /api/users/addresses`: for user to add address

1. `POST /api/users/addresses/:userId`: for getting addresses of a particular user

1. `POST /api/users/verify/:token`: for email verification of a particular user

1. `POST /api/users/get-user/:userId`: To get profile details of a particular user

1. `POST /reset-password/:userId/:token`: reset password

1. `GET /api/user/user-verification/:userId/:token`: email verification

1. `GET /api/user/profile/:query`" get user profile

# post routes

1. `POST /api/order/create`: create order

1. `api/order/orders/:userId`: get all orders of a particular user
