
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from './config/db.js';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';

dbConnect()



const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));


app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api', apiRoutes);

app.get("/", (req, res) => {
  res.send("Mock E-Com Cart API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
