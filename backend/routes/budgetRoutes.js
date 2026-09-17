import { Router } from 'express';
import { getBudget, saveBudget } from '../controllers/budgetController.js';
import { authenticate } from '../utils/auth.js';

const router = Router();

router.get('/', authenticate, getBudget);
router.post('/', authenticate, saveBudget);

export default router;
