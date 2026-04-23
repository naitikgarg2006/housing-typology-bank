const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const Typology = require('../models/Typology');

const router = express.Router();

router.get('/:typologyId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ typologyId: req.params.typologyId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { typologyId, rating, comment } = req.body;

    if (!typologyId || !rating) {
      return res.status(400).json({ error: 'Typology ID and rating are required' });
    }

    const typology = await Typology.findOne({ id: typologyId }).lean();
    if (!typology) {
      return res.status(404).json({ error: 'Typology not found' });
    }

    const entry = await Feedback.create({
      id: uuidv4(),
      typologyId,
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment || '',
      createdAt: new Date(),
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all feedback' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Feedback.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

module.exports = router;
