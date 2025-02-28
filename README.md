# Todo REST API

## Features

- User authentication (register, login)
- Create, read, update, and delete todos
- MongoDB database integration
- JWT authentication
- Error handling
- Input validation

## Technologies

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Installation

1. Clone the repository
```bash
git clone https://github.com/Soumyajit1209/REST_API_TODO.git
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongo_url
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

## API Endpoints

### Authentication

- **Register a user**: `POST /api/auth/register`
  - Body: `{ "name": "Soumyajit Khan", "email": "soumyajitkhan6@gmail.com", "password": "123456" }`

- **Login**: `POST /api/auth/login`
  - Body: `{ "email": "soumyajitkhan6@gmail.com", "password": "123456" }`

- **Get current user**: `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`

### Todos

- **Get all todos**: `GET /api/todos`
  - Headers: `Authorization: Bearer <token>`

- **Get a single todo**: `GET /api/todos/:id`
  - Headers: `Authorization: Bearer <token>`

- **Create a todo**: `POST /api/todos`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "Buy groceries", "description": "Milk, eggs, bread", "completed": false }`

- **Update a todo**: `PUT /api/todos/:id`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "Buy groceries", "description": "Milk, eggs, bread, cheese", "completed": true }`

- **Delete a todo**: `DELETE /api/todos/:id`
  - Headers: `Authorization: Bearer <token>`

## Sample Usage

### Register a User
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Soumyajit Khan","email":"soumyajitkhan6@gmail.com","password":"123456"}' http://localhost:5000/api/auth/register
```

### Login
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email":"soumyajitkhan6@gmail.com","password":"123456"}' http://localhost:5000/api/auth/login
```

### Create a Todo
```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <your_token>" -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}' http://localhost:5000/api/todos
```

### Get All Todos
```bash
curl -H "Authorization: Bearer <your_token>" http://localhost:5000/api/todos
```
Note: A user already added for testing (as in example)