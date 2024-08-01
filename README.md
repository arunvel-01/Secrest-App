# Secrets Web App

This is a web application for sharing secrets anonymously.

## Table of Contents

- [Live Website](#live-website)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Live Website

You can access the live website [here](https://secrets-web-app-evob.onrender.com/).

## Installation

1. Clone the repository:
   git clone https://github.com/yourusername/secrets-web-app.git
   cd secrets-web-app

## Install dependencies:
npm install

## Set up environment variables:

Create a .env file in the root of your project and add the following:

SECRET=your_session_secret
MONGODB_URI=your_mongodb_connection_string
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret

## Start the server:
node app.js

## Endpoints:

GET /secrets: Get all secrets.
POST /secrets: Create a new secret.
DELETE /secrets: Delete all secrets.
Specific Secret
GET /secrets/:secretID: Get a specific secret.
PUT /secrets/:secretID: Update a specific secret.
PATCH /secrets/:secretID: Partially update a specific secret.
DELETE /secrets/:secretID: Delete a specific secret.

## Technologies Used
Node.js
Express.js
MongoDB
EJS

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

