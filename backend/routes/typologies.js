const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Typology = require('../models/Typology');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let typologies = await Typology.find().lean();
    const { material, climate, style, region, search } = req.query;

    if (material) {
      typologies = typologies.filter((t) =>
        (t.materials || []).some((m) => m.toLowerCase().includes(material.toLowerCase()))
      );
    }
    if (climate) {
      typologies = typologies.filter((t) =>
        t.climateType.toLowerCase().includes(climate.toLowerCase())
      );
    }
    if (style) {
      typologies = typologies.filter((t) =>
        t.constructionStyle.toLowerCase().includes(style.toLowerCase())
      );
    }
    if (region) {
      typologies = typologies.filter((t) =>
        t.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    if (search) {
      const q = search.toLowerCase();
      typologies = typologies.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.region.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    res.json(typologies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch typologies' });
  }
});

router.get('/markers', async (req, res) => {
  try {
    const typologies = await Typology.find().lean();
    const markers = typologies.map((t) => ({
      id: t.id,
      name: t.name,
      region: t.region,
      lat: t.lat,
      lng: t.lng,
      climateType: t.climateType,
      thumbnail: t.images?.[0] || null,
    }));
    res.json(markers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch markers' });
  }
});

router.get('/filters', async (req, res) => {
  try {
    const typologies = await Typology.find().lean();
    const materials = [...new Set(typologies.flatMap((t) => t.materials || []))].sort();
    const climates = [...new Set(typologies.map((t) => t.climateType))].sort();
    const styles = [...new Set(typologies.map((t) => t.constructionStyle))].sort();
    const regions = [...new Set(typologies.map((t) => t.region))].sort();
    res.json({ materials, climates, styles, regions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const typology = await Typology.findOne({ id: req.params.id }).lean();
    if (!typology) {
      return res.status(404).json({ error: 'Typology not found' });
    }
    res.json(typology);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch typology' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const typology = await Typology.create({
      id: uuidv4(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json(typology);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create typology' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Typology.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Typology not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update typology' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Typology.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Typology not found' });
    }
    res.json({ message: 'Typology deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete typology' });
  }
});

module.exports = router;
