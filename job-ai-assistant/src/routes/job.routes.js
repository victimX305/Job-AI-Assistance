const router = require('express').Router();
const controller = require('../controllers/job.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, controller.createJob);
router.get('/', auth, controller.getAllJobs);
router.get('/:id', auth, controller.getJobById);
router.put('/:id', auth, controller.updateJob);
router.delete('/:id', auth, controller.deleteJob);
router.patch('/:id/status', auth, controller.updateStatus);

module.exports = router;