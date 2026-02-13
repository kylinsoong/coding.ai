import express from 'express'
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  updateActivityStatus,
  getActiveActivity,
} from '../controllers/activityController.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'

const router = express.Router()

router.post('/', protect, adminOnly, validate(schemas.createActivity), createActivity)
router.get('/', protect, adminOnly, getActivities)
router.get('/active', getActiveActivity)
router.get('/:id', protect, adminOnly, getActivityById)
router.put('/:id', protect, adminOnly, updateActivity)
router.delete('/:id', protect, adminOnly, deleteActivity)
router.patch('/:id/status', protect, adminOnly, updateActivityStatus)

export default router
