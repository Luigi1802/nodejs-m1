const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes/fleurs');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/fleurs', routes);
// API Bouquets

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});