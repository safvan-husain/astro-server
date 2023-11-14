import { Router } from 'express';
const router = Router();

router.get('/unread-messages', (req, res) => {
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Registration logic here
});

export { router as chatRoute }
