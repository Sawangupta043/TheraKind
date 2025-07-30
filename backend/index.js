const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Session = require('./models/Session');
const Feedback = require('./models/Feedback');
const Notification = require('./models/Notification');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://localhost:5173',
    'https://your-netlify-site.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Password reset request endpoint
app.post('/api/password-reset-request', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // TODO: Send resetToken to user's email (integrate real email service here)
    res.json({ message: 'Password reset email sent (mock)', resetToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Password reset endpoint
app.post('/api/password-reset', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Email verification endpoint
app.post('/api/send-verification-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const verifyToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // TODO: Send verifyToken to user's email (integrate real email service here)
    res.json({ message: 'Verification email sent (mock)', verifyToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/verify-email', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get user profile
app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // Prevent password change here
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create session (booking)
app.post('/api/sessions', auth, async (req, res) => {
  try {
    const session = new Session({ ...req.body, clientId: req.user.userId });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sessions for client
app.get('/api/sessions/client', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ clientId: req.user.userId });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sessions for therapist
app.get('/api/sessions/therapist', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ therapistId: req.user.userId });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel session
app.delete('/api/sessions/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    // Only client or therapist can cancel
    if (session.clientId.toString() !== req.user.userId && session.therapistId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    session.status = 'cancelled';
    await session.save();
    res.json({ message: 'Session cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit feedback
app.post('/api/feedback', auth, async (req, res) => {
  try {
    const { sessionId, therapistId, rating, feedback } = req.body;
    const fb = new Feedback({
      sessionId,
      clientId: req.user.userId,
      therapistId,
      rating,
      feedback
    });
    await fb.save();
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feedback for therapist
app.get('/api/feedback/therapist', auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ therapistId: req.user.userId });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feedback for admin (all feedback)
app.get('/api/feedback', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification
app.post('/api/notifications', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const notification = new Notification({ userId: req.user.userId, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications for user
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get overview stats
app.get('/api/admin/overview', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    const userCount = await User.countDocuments();
    const therapistCount = await User.countDocuments({ role: 'therapist' });
    const sessionCount = await Session.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    res.json({ userCount, therapistCount, sessionCount, feedbackCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list users
app.get('/api/admin/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list therapists
app.get('/api/admin/therapists', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    const therapists = await User.find({ role: 'therapist' }).select('-password');
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete user
app.delete('/api/admin/users/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});