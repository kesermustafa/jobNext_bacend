import express, { Application, Request, Response, NextFunction } from 'express';

import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss';
import cookieParser from 'cookie-parser'
import hpp from 'hpp'
import authRoutes from "./routes/authRoutes.js";
import {globalErrorHandler} from "./middlewares/error.middleware.js";
import gigRorutes from "./routes/gigRorutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app: Application = express();

app.set('trust proxy', 1);
app.use(helmet());

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 'error',
        statusCode: 429,
        message: 'Çok fazla istek gönderdiniz, lütfen 15 dakika sonra tekrar deneyin.'
    }
});

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: {
        status: 'error',
        statusCode: 429,
        message: 'Çok fazla giriş denemesi, lütfen 10 dakika sonra tekrar deneyin.'
    }
});

app.use('/api', limiter);
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(hpp());


/**
 * NoSQL Injection Koruması (Özyinelemeli/Recursive)
 * Anahtarlardaki $ ve . karakterlerini temizler.
 */
const sanitizeInput = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach((key) => {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeInput(obj[key]);
        }
    });
};

/**
 * XSS Koruması (Özyinelemeli/Recursive)
 * String değerlerdeki zararlı HTML/Script etiketlerini temizler.
 */
const sanitizeXSS = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') {
            obj[key] = xss(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeXSS(obj[key]);
        }
    });
};

// --- Middleware Entegrasyonu ---

// Body parser'dan SONRA, Route'lardan ÖNCE eklemeli
app.use(express.json({ limit: '10kb' })); // Önce body'yi oku

app.use((req: Request, res: Response, next: NextFunction) => {
    // Body temizliği
    if (req.body) {
        sanitizeInput(req.body);
        sanitizeXSS(req.body);
    }
    // Query string temizliği (Genelde NoSQL Injection burada çok olur)
    if (req.query) {
        sanitizeInput(req.query);
    }
    // Params temizliği
    if (req.params) {
        sanitizeInput(req.params);
    }

    next();
});

app.use((req, res, next) => {
    req.setTimeout(10000, () => {
        if (!res.headersSent) {
            next(new Error('İstek zaman aşımına uğradı.' ));
        }
    });
    next();
});

// Route'lar buraya gelecek...


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/gig", gigRorutes)
app.use("/api/reviews", reviewRoutes)


/*// Temel Route
app.get('/', (req: Request, res: Response) => {
    res.send('API Çalışıyor! 🚀');
});*/

app.get('/favicon.ico',
    (req: Request, res: Response, next: NextFunction) =>
    res.status(204).end());

app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
    next(new Error(`Cannot find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler)

export default app;