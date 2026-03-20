import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { 
  register, 
  login, 
} from '../controllers/auth.controller';

const router = Router();

// router.get('/', getTasks);
router.post('/register', register);
router.post('/login', login);

export default router;