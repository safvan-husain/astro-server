import { Router } from 'express';
const router = Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Authentication logic here
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Registration logic here
}); 

export { router as authRoutes }