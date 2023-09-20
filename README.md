## Secrets Web App

**Description:** This is a web application for sharing secrets anonymously.

**Table of Contents:**

* [Getting Started](#getting-started)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

**Getting Started**

This section will guide you on how to set up and run the project on your local machine.

**Prerequisites:**

* Node.js and npm (Node Package Manager)
* MongoDB

**Installation:**

1. Clone the repository.

```bash
git clone https://github.com/yourusername/secrets-web-app.git
cd secrets-web-app

Install dependencies.
npm install

Set up environment variables.
Create a .env file in the root of your project and add the following:
SECRET=your_session_secret
MONGODB_URI=your_mongodb_connection_string
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret

Start the server.
node app.js

Usage

The live application is accessible at https://secrets-web-app-evob.onrender.com/.

Contributing

If you'd like to contribute to the project, please fork the repository and create a pull request.

License

This project is licensed under the MIT License - see the LICENSE file for details.
