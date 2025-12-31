# Support Server Backend

Backend API for the ExtraHand Support Server application.

## Features

- User authentication (login/signup)
- JWT-based authentication
- Contact form submission
- MongoDB integration
- Rate limiting
- CORS support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env` and update the values.

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact messages (admin only)

### Health Check
- `GET /health` - Server health status

## Environment Variables

- `PORT` - Server port (default: 5001)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `CLIENT_URL` - Frontend URL for CORS

## Default Port

Backend runs on port **5001**
