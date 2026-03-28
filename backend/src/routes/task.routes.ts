import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { createTask, getTasks, deleteTask,getAiSummary, updateTask, taskChat, taskChatSearchTester } from '../controllers/task.controller';

const router = Router();

router.use(protect); // jwt validator 

router.post('/', createTask);
router.get('/', getTasks);
router.delete('/:id', deleteTask);
router.put('/:id', updateTask);
router.get('/summary', getAiSummary);
router.post('/taskChat', taskChat);
router.post('/taskChatTest', taskChatSearchTester);

export default router;