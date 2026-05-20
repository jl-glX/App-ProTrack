import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

// Rate limiting configuration
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
  },
});

export const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 downloads per hour
  message: 'Too many download requests, please try again later.',
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
  },
});

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 feedback submissions per hour
  message: 'Too many feedback submissions, please try again later.',
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
  },
});

// Input validation middleware
export const validateBudgetInput = [
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('description').optional().trim().isLength({ max: 500 }).escape(),
  body('totalAmount').isFloat({ min: 0 }),
  body('currency').trim().isLength({ min: 3, max: 3 }),
  body('country').optional().trim().isLength({ max: 2 }),
  body('taxPercentage').optional().isFloat({ min: 0, max: 100 }),
];

export const validateCategoryInput = [
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('limit').isFloat({ min: 0 }),
  body('color').matches(/^#[0-9A-Fa-f]{6}$/),
  body('icon').trim().isLength({ min: 1, max: 50 }).escape(),
];

export const validateTransactionInput = [
  body('amount').isFloat({ min: 0 }),
  body('description').optional().trim().isLength({ max: 500 }).escape(),
  body('date').isISO8601(),
];

export const validateFeedbackInput = [
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 10, max: 1000 }).escape(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
];

// Error handling middleware for validation
export function handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}

// CAPTCHA verification (requires hCaptcha secret key)
export async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('HCAPTCHA_SECRET_KEY not configured - CAPTCHA verification disabled');
    return true; // Allow in development
  }

  if (!token || token.trim().length === 0) {
    console.warn('CAPTCHA token is empty');
    return false;
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    
    if (!response.ok) {
      console.error('CAPTCHA verification request failed:', response.statusText);
      return false;
    }

    const data: any = await response.json();
    
    if (data.success !== true) {
      console.warn('CAPTCHA verification failed:', data['error-codes']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return false;
  }
}

// Security headers middleware
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

// Sanitize output
export function sanitizeOutput(data: any): any {
  if (typeof data === 'string') {
    return data.replace(/[<>]/g, '');
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeOutput);
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const key in data) {
      sanitized[key] = sanitizeOutput(data[key]);
    }
    return sanitized;
  }
  return data;
}
