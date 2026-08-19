const router = require('express').Router();
const controller = require('../controllers/cv.controller');
const auth = require('../middleware/auth.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, controller.createCV);
router.get('/', authMiddleware, controller.getAllCVs);
router.put('/:id', authMiddleware, controller.updateCV);
router.delete('/:id', authMiddleware, controller.deleteCV);

module.exports = router;