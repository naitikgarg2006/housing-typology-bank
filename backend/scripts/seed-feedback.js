require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { connectDB, closeDB } = require('../db');
const Typology = require('../models/Typology');
const Feedback = require('../models/Feedback');

const userNames = [
  'Aarav Sharma', 'Priya Patel', 'Rohan Gupta', 'Ananya Reddy', 'Vikram Singh',
  'Sneha Iyer', 'Arjun Nair', 'Kavita Das', 'Rahul Mehta', 'Deepa Joshi',
  'Amit Kumar', 'Pooja Verma', 'Siddharth Rao', 'Meera Pillai', 'Karthik Menon',
];

const comments = [
  'Very well designed for the local climate. The ventilation details are practical and easy to implement.',
  'Good use of local materials. This would significantly reduce construction costs in our region.',
  'The foundation design seems solid for the terrain. Would love to see more cross-section details.',
  'Excellent hazard resistance features. This design could save lives during extreme weather events.',
  'The courtyard layout is perfect for our family. Traditional yet modern in its approach.',
  'Roof design handles monsoon rain very effectively. Tested a similar approach and it works great.',
  'Wall thickness specifications are ideal for thermal comfort. Our summers are brutal without proper insulation.',
  'Cost estimates seem accurate for current material prices. Very helpful for budget planning.',
  'The stilted design is exactly what flood-prone areas need. Practical and well-thought-out.',
  'Beautiful integration of traditional building techniques with modern engineering standards.',
  'The seismic resistance features give me confidence. We had a tremor last year and this design would hold.',
  'Simple enough for local masons to build. Not every design considers the skill level of rural builders.',
  'Energy efficiency is impressive. The passive cooling approach means less reliance on electricity.',
  'Would recommend this to anyone building in a similar climate zone. Very region-appropriate.',
  'The specifications are detailed enough to hand directly to a contractor. Very professional.',
  'Love the use of bamboo. Sustainable, affordable, and culturally appropriate for our area.',
  'The drainage design around the foundation is often overlooked. Glad to see it addressed here.',
  'This typology respects local architectural heritage while meeting modern safety codes.',
  'The estimated cost breakdown is realistic. Some designs online are wildly optimistic about costs.',
  'Perfect for a two-generation household. The layout separates private and common areas well.',
  'Tested the ventilation pattern described here. Cross ventilation reduces indoor temp by 4-5 degrees.',
  'The material choices make sourcing easy. Everything is available within a 50km radius.',
  'Structural bands and tie beams are a smart addition for earthquake zones. Should be standard practice.',
  'The roof pitch handles snow load well. Important detail for hill station construction.',
  'Compact footprint is ideal for narrow hill plots. Not easy to design for steep terrain.',
  'Lime plaster finish is a great choice. Breathable, cool, and low maintenance.',
  'The raised plinth is essential in our area. Flooding is annual and this addresses it simply.',
  'Good balance between cost and durability. Not everything needs to be RCC to be safe.',
  'The verandah design is culturally important here. Nice to see it included as a functional element.',
  'Clear specifications make regulatory approval easier. Our municipality requires detailed drawings.',
  'This design handles salt air corrosion well. Coastal construction needs this kind of attention.',
  'The insulation approach is innovative for rural areas. Most designs ignore thermal comfort.',
  'Practical for self-build projects. The construction sequence is logical and phased.',
  'Fire resistance could be improved, but overall a strong design for the price range.',
  'The natural lighting strategy reduces electricity use. Skylights and oriented windows work well.',
  'Would be great to see a version with solar panel integration on the roof.',
  'The modular layout allows future expansion. Important for growing families with limited initial budget.',
  'Drainage and waterproofing details are thorough. Prevents the dampness issues common in our area.',
  'This is exactly what government housing schemes should adopt. Practical and dignified.',
  'The use of local stone reduces carbon footprint. Transportation of materials is a hidden cost.',
  'Well-suited for the terrain. The stepped foundation adapts naturally to the slope.',
  'Indoor air quality would benefit from the ventilation design. Important for health in humid climates.',
  'The design accounts for future maintenance. Accessible plumbing and wiring paths are thoughtful.',
  'Traditional courtyard adapted for modern needs. Privacy without sacrificing natural light.',
  'Impressed by the wind resistance features. Our coastal village experiences strong gusts every season.',
  'The timber detailing is excellent. Proper joinery makes all the difference in longevity.',
  'Affordable without compromising safety. This strikes the right balance for rural housing.',
  'The floor plan is efficient. No wasted corridor space, every square foot is usable.',
  'Would suggest adding rainwater harvesting to the roof design. Otherwise excellent.',
  'Construction timeline estimate would be helpful. Otherwise, a very complete specification.',
];

async function seedFeedback() {
  await connectDB();

  const typologies = await Typology.find({}, { id: 1, _id: 0 }).lean();
  if (typologies.length === 0) {
    throw new Error('No typologies found. Import typologies first.');
  }

  const typologyIds = typologies.map((t) => t.id);
  const feedbackDocs = [];

  for (let i = 0; i < 50; i++) {
    const typologyId = typologyIds[i % typologyIds.length];
    const userName = userNames[i % userNames.length];
    const userId = uuidv4();
    const rating = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
    const comment = comments[i];
    const daysAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    feedbackDocs.push({
      id: uuidv4(),
      typologyId,
      userId,
      userName,
      rating,
      comment,
      createdAt,
    });
  }

  const inserted = await Feedback.insertMany(feedbackDocs);
  console.log(`Inserted ${inserted.length} feedback entries across ${typologyIds.length} typologies`);
}

seedFeedback()
  .then(async () => {
    await closeDB();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Feedback seeding failed:', err);
    await closeDB();
    process.exit(1);
  });
