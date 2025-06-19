const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const customerRequestRoutes = require('./routes/customerRequestRoutes');

// Rappel des réservations à retourner
const reservationReminder = require('./utils/reminderService');

// Chargement variables d'environnement 
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/customer-requests', customerRequestRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});