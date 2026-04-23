const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const Typology = require('../models/Typology');
const User = require('../models/User');

const router = express.Router();

router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [typologies, feedback, users] = await Promise.all([
      Typology.find().lean(),
      Feedback.find().sort({ createdAt: -1 }).lean(),
      User.find().lean(),
    ]);

    const totalTypologies = typologies.length;
    const totalFeedback = feedback.length;
    const totalUsers = users.length;
    const avgRating =
      feedback.length > 0
        ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
        : 0;

    const materialCounts = {};
    typologies.forEach((t) => {
      (t.materials || []).forEach((m) => {
        materialCounts[m] = (materialCounts[m] || 0) + 1;
      });
    });

    const climateCounts = {};
    typologies.forEach((t) => {
      const climate = t.climateType || 'Unknown';
      climateCounts[climate] = (climateCounts[climate] || 0) + 1;
    });

    const regionCounts = {};
    typologies.forEach((t) => {
      const region = t.region || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    res.json({
      totalTypologies,
      totalFeedback,
      totalUsers,
      avgRating: Number(avgRating),
      materialCounts,
      climateCounts,
      regionCounts,
      recentFeedback: feedback.slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
