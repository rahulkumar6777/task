import express from 'express';
import authRoutes from './v1/authRoutes.js';
import taskRoutes from './v1/taskRoutes.js';

const router = express.Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/tasks', taskRoutes);

export default router;