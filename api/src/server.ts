import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';
import {connectDB} from "./config/db.js";


const PORT = process.env.PORT || 5000;


import {initCloudinary} from "./shared/utils/cloudinary.js";

initCloudinary(); // 🔥 BURADA ÇAĞIR

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🛜 Server running on port ${PORT}`);
    });
};

startServer()
    .then(r => r)
    .catch(err => console.error('❌ DB Connection Error! :', err.message))



