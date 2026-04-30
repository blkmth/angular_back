require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');

const users = [
  { username: 'admin', password: '1234', role: 'admin' },
  { username: 'user', password: '1234', role: 'user' }
];

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI manquant dans .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    for (const u of users) {
      const existing = await User.findOne({ username: u.username });
      if (existing) {
        console.log(`⚠️  Utilisateur ${u.username} existe déjà — skip`);
        continue;
      }

      const hashed = await bcrypt.hash(u.password, 10);
      const newUser = new User({ username: u.username, password: hashed, role: u.role });
      await newUser.save();
      console.log(`✅ Utilisateur créé: ${u.username} (${u.role})`);
    }
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
