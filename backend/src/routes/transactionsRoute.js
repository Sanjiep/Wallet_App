import express from 'express';
import {
    getTransactionsByUserId,
    createTransaction,
    deleteTransactions,
    getSummaryByUserId
} from '../controllers/transactionsController.js';

export const router = express.Router();

router.get('/:user_id', getTransactionsByUserId)
router.post('/', createTransaction);
router.delete('/:id', deleteTransactions);
router.get('/summary/:user_id', getSummaryByUserId)

export default router;