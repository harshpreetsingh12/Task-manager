import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { 
  register, 
  login, logout
} from '../controllers/auth.controller';

const router = Router();

// router.get('/', getTasks);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;