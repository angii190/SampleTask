import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router();
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', authMiddleware, async (req, res) => {
  const { score } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (score > user.highScore) {
    user.highScore = score;
    await user.save();
  }

  res.json({ message: 'Score updated', highScore: user.highScore });
});

router.get('/', async (req, res) => {
  const topScores = await User.find().sort({ highScore: -1 }).limit(10).select('username highScore');
  res.json(topScores);
});

export default router
