const router = require('express').Router();
const controller = require('../controllers/optimize.controller');
const auth = require('../middleware/auth.middleware');

// Manual optimization
router.post('/optimize', auth, controller.optimizeCV);

// Download routes
router.get('/:jobId/download/cv', auth, controller.downloadCV);
router.get('/:jobId/download/cover-letter', auth, controller.downloadCoverLetter);

// Database optimization
router.post('/:jobId', auth, controller.optimize);

module.exports = router;