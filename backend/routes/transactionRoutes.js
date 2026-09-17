import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction
} from '../controllers/transactionController.js';
import { authenticate } from '../utils/auth.js';

const router = Router();

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, createTransaction);
router.put('/:id', authenticate, updateTransaction);
router.delete('/:id', authenticate, deleteTransaction);

export default router;
