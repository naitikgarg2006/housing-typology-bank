const mongoose = require('mongoose');

const typologySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    climateType: { type: String, required: true, trim: true },
    constructionStyle: { type: String, required: true, trim: true },
    materials: [{ type: String, trim: true }],
    description: { type: String, default: '' },
    foundationType: { type: String, default: '' },
    roofShape: { type: String, default: '' },
    floors: { type: Number, default: 1 },
    estimatedCost: { type: String, default: '' },
    hazardResistance: [{ type: String, trim: true }],
    suitabilityReason: { type: String, default: '' },
    specifications: {
      wallThickness: { type: String, default: '' },
      roofMaterial: { type: String, default: '' },
      foundationDepth: { type: String, default: '' },
      steelGrade: { type: String, default: '' },
      concreteGrade: { type: String, default: '' },
    },
    images: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.models.Typology || mongoose.model('Typology', typologySchema);
