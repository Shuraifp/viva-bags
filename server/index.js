import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoute from "./routes/admin.js"
import userRoute from "./routes/user.js"

const app = express();
dotenv.config();

mongoose.connect(process.env.DB_URI).then(() => {
  console.log('MongoDB Connected');
}).catch((err) => {
  console.log(err);
});

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,           
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
}));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
// app.use('/uploads', (req, res, next) => {
//   const filePath = path.join(__dirname, 'uploads', req.path);

//   if (filePath.endsWith('.avif')) {
//     res.setHeader('Content-Type', 'image/avif');
//   }
//   next();
// });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/user', userRoute);
app.use('/admin', adminRoute);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
