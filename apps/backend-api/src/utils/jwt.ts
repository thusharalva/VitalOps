// JWT utility functions
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate JWT token
 */
export const generateToken = (payload: TokenPayload): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): TokenPayload => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, jwtSecret) as TokenPayload;
};

