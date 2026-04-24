import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

// ⚠️  PENTING: route spesifik (/top-borrowers) HARUS didefinisikan
//    SEBELUM route dengan parameter dinamis (/:id) agar Express
//    tidak salah mencocokkan "top-borrowers" sebagai nilai :id.

// GET /api/loans/top-borrowers  ← endpoint baru
router.get('/top-borrowers', LoanController.getTopBorrowers);

// GET /api/loans
router.get('/', LoanController.getLoans);

// POST /api/loans
router.post('/', LoanController.createLoan);

export default router;