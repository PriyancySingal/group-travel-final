import express from 'express';
import { 
  createGroupPlan,
  getAllGroupPlans,
  getGroupPlanByShareCode,
  getGroupPlanById,
  updateMemberPayment,
  addMemberToGroup,
  confirmGroupPlan,
  cancelGroupPlan,
  updateGroupPlanPricing,
  completeGroupPlan,
  deleteGroupPlan
} from '../controllers/groupPlanController.js';

const router = express.Router();

// @route   POST /api/group-plans
// @desc    Create new group plan
// @access  Private
router.post('/', createGroupPlan);

// @route   GET /api/group-plans
// @desc    Get all group plans
// @access  Private/Admin
router.get('/', getAllGroupPlans);

// @route   GET /api/group-plans/all
// @desc    Get all group plans (public for share links)
// @access  Public
router.get('/all', getAllGroupPlans);

// @route   GET /api/group-plans/:shareCode
// @desc    Get group plan by share code
// @access  Public
router.get('/share/:shareCode', getGroupPlanByShareCode);

// @route   GET /api/group-plans/:id
// @desc    Get single group plan by ID
// @access  Private
router.get('/:id', getGroupPlanById);

// @route   PUT /api/group-plans/:id/payment
// @desc    Update member payment status
// @access  Private
router.put('/:id/payment', updateMemberPayment);

// @route   PUT /api/group-plans/:id/member
// @desc    Add member to group plan
// @access  Public (via share link)
router.put('/:id/member', addMemberToGroup);

// @route   PUT /api/group-plans/:id/confirm
// @desc    Confirm group plan (Admin)
// @access  Admin
router.put('/:id/confirm', confirmGroupPlan);

// @route   PUT /api/group-plans/:id/cancel
// @desc    Cancel group plan
// @access  Private/Admin
router.put('/:id/cancel', cancelGroupPlan);

// @route   PUT /api/group-plans/:id/pricing
// @desc    Update group plan pricing
// @access  Private
router.put('/:id/pricing', updateGroupPlanPricing);

// @route   PUT /api/group-plans/:id/complete
// @desc    Mark group plan as completed
// @access  Admin
router.put('/:id/complete', completeGroupPlan);

// @route   DELETE /api/group-plans/:id
// @desc    Delete group plan
// @access  Admin
router.delete('/:id', deleteGroupPlan);

export default router;
