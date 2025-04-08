// server/middlewares/authMiddleware.js
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
dotenv.config();

// Create middleware for validating access tokens
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE, // Your API identifier in Auth0
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL, // Your Auth0 domain with https://
  tokenSigningAlg: 'RS256'
});

// Middleware to extract user info from token
export const extractUserFromToken = (req, res, next) => {
  if (req.auth && req.auth.payload) {
    // Extract user info from the JWT token
    req.user = {
      sub: req.auth.payload.sub, // Auth0 user ID
      email: req.auth.payload.email,
      name: req.auth.payload.name || req.auth.payload.nickname || '',
      // You can extract other claims as needed
    };
  }
  next();
};

// Simple middleware to check if user is authenticated
export const ensureAuthenticated = (req, res, next) => {
  if (!req.auth || !req.auth.payload) {
    return res.status(401).json({ message: 'Unauthorized: Missing authentication' });
  }
  next();
};

// For future use - once you implement roles
export const checkRoles = (requiredRoles) => {
  return (req, res, next) => {
    // Since you're not using roles yet, we'll just check authentication
    if (!req.auth || !req.auth.payload) {
      return res.status(401).json({ message: 'Unauthorized: Missing authentication' });
    }
    next();
  };
};