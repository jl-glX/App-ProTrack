import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupStaticServing } from './static-serve.js';
import { setupDatabase } from './database.js';
import { budgetsRouter } from './routes/budgets.js';
import { categoriesRouter } from './routes/categories.js';
import { transactionsRouter } from './routes/transactions.js';
import { templatesRouter } from './routes/templates.js';
import { taxesRouter } from './routes/taxes.js';
import { feedbackRouter } from './routes/feedback.js';
import { downloadsRouter } from './routes/downloads.js';
import { professionalBudgetsRouter } from './routes/professional-budgets.js';
import { apiLimiter, securityHeaders } from './middleware/security.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(securityHeaders);
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for API routes
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/budgets/professional', professionalBudgetsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/taxes', taxesRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/downloads', downloadsRouter);

// Export a function to start the server
export async function startServer(port: number | string) {
  try {
    await setupDatabase();
    
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}
