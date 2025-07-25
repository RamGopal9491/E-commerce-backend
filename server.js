const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cartRoutes = require('./routes/cart');
const adminRote=require('./routes/admin') 
const product= require('./routes/products')
dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);
app.use('/api/cart',cartRoutes)

app.use("/api/admin",adminRote)
app.use("/api/products",product)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));