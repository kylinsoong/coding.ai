import express from 'express'
import {
  createRedEnvelope,
  getRedEnvelopes,
  getRedEnvelopeById,
  updateRedEnvelope,
  deleteRedEnvelope,
  toggleRedEnvelope,
} from '../controllers/redEnvelopeController.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'

const router = express.Router()

router.post('/', protect, adminOnly, validate(schemas.createRedEnvelope), createRedEnvelope)
router.get('/', protect, adminOnly, getRedEnvelopes)
router.get('/:id', protect, adminOnly, getRedEnvelopeById)
router.put('/:id', protect, adminOnly, updateRedEnvelope)
router.delete('/:id', protect, adminOnly, deleteRedEnvelope)
router.patch('/:id/toggle', protect, adminOnly, toggleRedEnvelope)

export default router
