import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { 
  getUser
} from '../controllers/user.controller';

const router = Router();

router.use(protect); 

router.get('/', getUser);

export default router;