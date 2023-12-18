import { Router } from 'express';
import { Notification } from '../models/notification_model.js';

const router = Router();

router.post('/general-notification', async (req, res) => {
    const { title, description } = req.body;
    const notification = new Notification({ title, description });
    await Notification.createNotification(req.body);
    try {
        await notification.save();
        res.status(200).json({ message : "success"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/notification', async (req, res) => {
    const { title, description, phone } = req.body;
    const notification = new Notification({ title, description, to: phone });
    await Notification.createNotification(req.body);
    try {
        await notification.save();
        res.status(200).json({ message : "success"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/notifications', async (req, res) => {
    const { phone } = req.query;
    try {
        const notifications = await Notification.findByPhone(phone); 
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export { router as notificationRoutes };