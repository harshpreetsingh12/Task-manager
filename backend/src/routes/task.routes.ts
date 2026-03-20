import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { createTask, getTasks, deleteTask } from '../controllers/task.controller';

const router = Router();

router.use(protect); // jwt validator 

router.post('/', createTask);
router.get('/', getTasks);
router.delete('/:id', deleteTask);

export default router;