import admin from '../firebase/admin.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header exists and starts with 'Bearer '
    if (!req.headers.authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = req.headers.authorization.split('Bearer ')[1];

    // Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Add the decoded user info to the request object
    req.user = decodedToken;

    // Move to the next middleware/route handler
    next();

  } catch (error) {
    // If token verification fails, send 401 Unauthorized
    res.status(401).json({ error: 'Invalid token' });
  }
};