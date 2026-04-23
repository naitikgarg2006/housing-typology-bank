require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { connectDB, closeDB } = require('../db');
const Typology = require('../models/Typology');
const Feedback = require('../models/Feedback');

async function importTypologies() {
  const inputPath = process.argv[2] || path.join(__dirname, '..', '..', 'dummy.json');
  const raw = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Input file must contain a non-empty array of typologies');
  }

  const now = new Date();
  const docs = data.map((item) => ({
    id: uuidv4(),
    name: item.name,
    region: item.region,
    state: item.state,
    lat: Number(item.lat),
    lng: Number(item.lng),
    climateType: item.climateType,
    constructionStyle: item.constructionStyle,
    materials: Array.isArray(item.materials) ? item.materials : [],
    description: item.description || '',
    foundationType: item.foundationType || '',
    roofShape: item.roofShape || '',
    floors: Number(item.floors) || 1,
    estimatedCost: item.estimatedCost || '',
    hazardResistance: Array.isArray(item.hazardResistance) ? item.hazardResistance : [],
    suitabilityReason: item.suitabilityReason || '',
    specifications: {
      wallThickness: item.specifications?.wallThickness || '',
      roofMaterial: item.specifications?.roofMaterial || '',
      foundationDepth: item.specifications?.foundationDepth || '',
      steelGrade: item.specifications?.steelGrade || '',
      concreteGrade: item.specifications?.concreteGrade || '',
    },
    images: Array.isArray(item.images) ? item.images : [],
    createdAt: now,
    updatedAt: now,
  }));

  await connectDB();

  const [typologyDeleteResult, feedbackDeleteResult] = await Promise.all([
    Typology.deleteMany({}),
    Feedback.deleteMany({}),
  ]);

  const inserted = await Typology.insertMany(docs);

  console.log(`Deleted ${typologyDeleteResult.deletedCount} typologies`);
  console.log(`Deleted ${feedbackDeleteResult.deletedCount} feedback entries`);
  console.log(`Imported ${inserted.length} typologies from ${inputPath}`);
}

importTypologies()
  .then(async () => {
    await closeDB();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Typology import failed:', err);
    await closeDB();
    process.exit(1);
  });
