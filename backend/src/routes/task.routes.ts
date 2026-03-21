import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { createTask, getTasks, deleteTask,getAiSummary } from '../controllers/task.controller';

const router = Router();

router.use(protect); // jwt validator 

router.post('/', createTask);
router.get('/', getTasks);
router.delete('/:id', deleteTask);
router.get('/summary', getAiSummary);

export default router;