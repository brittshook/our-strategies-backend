# Volunteer Management System Backend

This is a backend for a full-stack application to streamline volunteer management processes for a community building organization. It is designed to manage volunteers and shifts for various programs. It provides APIs for creating, updating, and retrieving volunteers, shifts, and programs.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Documentation](#api-documentation)
4. [Configuration](#configuration)
5. [Next Steps](#next-steps)

## Installation

To install and set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   $ git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   $ cd volunteer-management-backend
   ```

3. Install dependencies:

   ```bash
   $ npm install
   ```

## Usage

To start the server locally, use the following command:

```bash
$ npm start
```

By default, the server will run on port 3000. You can access the APIs at http://localhost:3000.

## API Documentation

The API documentation provides details about the available endpoints, request/response formats, and authentication methods. Please refer to the [API Documentation](https://our-strategies.readme.io/reference/users) for more information. Please note the production base URL included in the docs has not yet launched and the authentication features are not yet integrated.

## Configuration

The backend requires configuration for database setup and environment variables for API keys. Ensure the following configurations are set:

- MongoDB username (DB_USER)
- MongoDB password (DB_PASSWORD)
- MongoDB database (DB_DATABASE)
- MongoDB hostname (DB_HOST)
- Port (PORT)

## Next Steps

The API does not yet include user login information to facilitate user authentication. Addressing this is the next priority before moving on to building the front-end.
