import mongoose from 'mongoose';

export const connectDB = async () => {

        const DB = process.env.MONGODB_URI;

        if (!DB) {
                console.error("❌ MONGODB_URI is not defined in .env file");
                process.exit(1);
        }

        try {
                await mongoose.connect(DB);
                console.log('✅ MongoDB Connection Successful 🆗');
        } catch (err) {
                const error = err as Error;
                console.error('❌ DB Connection Error:', error.message);
                process.exit(1);
        }
}
