import GroupPlan from '../models/GroupPlan.js';

// @desc    Create new group plan
// @route   POST /api/group-plans
// @access  Private
export const createGroupPlan = async (req, res) => {
  try {
    const {
      hotelName,
      hotelImage,
      city,
      hotelRating,
      checkInDate,
      checkOutDate,
      rooms,
      guests,
      basePrice,
      gst,
      serviceFee,
      discount,
      totalPrice,
      perPersonSplit,
      splitType
    } = req.body;

    // Validate required fields
    if (!hotelName || !checkInDate || !checkOutDate || !rooms) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate per person split if not provided
    let calculatedPerPersonSplit = perPersonSplit;
    if (!calculatedPerPersonSplit && totalPrice && guests?.length > 0) {
      calculatedPerPersonSplit = Math.round(totalPrice / guests.length);
    }

    // Create guests array with default payment status
    const guestsWithPayment = guests.map(guest => ({
      name: guest.name,
      email: guest.email,
      phone: guest.phone || '',
      amountToPay: guest.amountToPay || calculatedPerPersonSplit,
      paymentStatus: 'pending'
    }));

    const groupPlan = new GroupPlan({
      userId: req.user?._id,
      hotelName,
      hotelImage,
      city,
      hotelRating,
      checkInDate,
      checkOutDate,
      rooms,
      guests: guestsWithPayment,
      basePrice,
      gst,
      serviceFee,
      discount,
      totalPrice,
      perPersonSplit: calculatedPerPersonSplit,
      splitType: splitType || 'equal',
      shareCode: 'GRP' + Date.now().toString(36).toUpperCase() + 
                 Math.random().toString(36).substr(2, 4).toUpperCase()
    });

    await groupPlan.save();

    // Get IO instance from app
    const io = req.app.get('io');
    if (io) {
      // Notify admin room about new group plan
      io.to('admin').emit('groupPlan:created', {
        groupPlan: groupPlan.toObject()
      });
    }

    res.status(201).json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Create group plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create group plan',
      error: error.message
    });
  }
};

// @desc    Get all group plans
// @route   GET /api/group-plans
// @access  Private/Admin
export const getAllGroupPlans = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }
    
    if (search) {
      query.$or = [
        { hotelName: { $regex: search, $options: 'i' } },
        { shareCode: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const groupPlans = await GroupPlan.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    // Calculate stats
    const stats = {
      total: groupPlans.length,
      pending: groupPlans.filter(gp => gp.bookingStatus === 'pending').length,
      confirmed: groupPlans.filter(gp => gp.bookingStatus === 'confirmed').length,
      cancelled: groupPlans.filter(gp => gp.bookingStatus === 'cancelled').length,
      completed: groupPlans.filter(gp => gp.bookingStatus === 'completed').length,
      totalValue: groupPlans.reduce((sum, gp) => sum + (gp.totalPrice || 0), 0)
    };

    res.json({
      success: true,
      data: groupPlans,
      stats
    });
  } catch (error) {
    console.error('Get all group plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch group plans',
      error: error.message
    });
  }
};

// @desc    Get group plan by share code (public)
// @route   GET /api/group-plans/:shareCode
// @access  Public
export const getGroupPlanByShareCode = async (req, res) => {
  try {
    const { shareCode } = req.params;

    const groupPlan = await GroupPlan.findOne({ shareCode })
      .select('-__v -userId');

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    res.json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Get group plan by share code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch group plan',
      error: error.message
    });
  }
};

// @desc    Get single group plan
// @route   GET /api/group-plans/:id
// @access  Private
export const getGroupPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const groupPlan = await GroupPlan.findById(id)
      .populate('userId', 'username email');

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    res.json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Get group plan by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch group plan',
      error: error.message
    });
  }
};

// @desc    Update payment status for a member
// @route   PUT /api/group-plans/:id/payment
// @access  Private
export const updateMemberPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberIndex, memberEmail, paymentStatus } = req.body;

    const groupPlan = await GroupPlan.findById(id);

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    // Find member by index or email
    let member;
    if (memberIndex !== undefined) {
      member = groupPlan.guests[memberIndex];
    } else if (memberEmail) {
      member = groupPlan.guests.find(g => 
        g.email.toLowerCase() === memberEmail.toLowerCase()
      );
    }

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Update payment status
    member.paymentStatus = paymentStatus || 'paid';

    // Recalculate payment progress
    const paidCount = groupPlan.guests.filter(g => g.paymentStatus === 'paid').length;
    groupPlan.paymentProgress = Math.round((paidCount / groupPlan.guests.length) * 100);

    // Update payment status
    if (groupPlan.paymentProgress === 100) {
      groupPlan.paymentStatus = 'ready_for_confirmation';
    } else if (groupPlan.paymentProgress > 0) {
      groupPlan.paymentStatus = 'partial';
    }

    await groupPlan.save();

    // Get IO instance and emit update
    const io = req.app.get('io');
    if (io) {
      // Emit to the specific group plan room
      io.to(`group:${groupPlan.shareCode}`).emit('payment:updated', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode,
        member: member.toObject(),
        paymentProgress: groupPlan.paymentProgress,
        paymentStatus: groupPlan.paymentStatus
      });

      // Notify admin
      io.to('admin').emit('payment:updated', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode,
        hotelName: groupPlan.hotelName,
        paymentProgress: groupPlan.paymentProgress
      });
    }

    res.json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment',
      error: error.message
    });
  }
};

// @desc    Add member to group plan
// @route   PUT /api/group-plans/:id/member
// @access  Public (via share link)
export const addMemberToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const groupPlan = await GroupPlan.findById(id);

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    // Check if email already exists
    const emailExists = groupPlan.guests.some(g => 
      g.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered in the group'
      });
    }

    // Add new member
    const newMember = {
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      amountToPay: groupPlan.perPersonSplit,
      paymentStatus: 'pending'
    };

    groupPlan.guests.push(newMember);

    // Recalculate pricing if needed
    if (groupPlan.splitType === 'equal') {
      const newPerPerson = Math.round(groupPlan.totalPrice / groupPlan.guests.length);
      groupPlan.perPersonSplit = newPerPerson;
      
      // Update all members' amounts
      groupPlan.guests.forEach(g => {
        g.amountToPay = newPerPerson;
      });
    }

    await groupPlan.save();

    // Get IO instance and emit update
    const io = req.app.get('io');
    if (io) {
      io.to(`group:${groupPlan.shareCode}`).emit('member:joined', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode,
        member: newMember,
        totalMembers: groupPlan.guests.length
      });

      // Notify admin
      io.to('admin').emit('member:joined', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode,
        hotelName: groupPlan.hotelName,
        newMember,
        totalMembers: groupPlan.guests.length
      });
    }

    res.json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add member',
      error: error.message
    });
  }
};

// @desc    Confirm group plan (Admin)
// @route   PUT /api/group-plans/:id/confirm
// @access  Admin
export const confirmGroupPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const groupPlan = await GroupPlan.findById(id);

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    // Check if all payments are complete
    const allPaid = groupPlan.guests.every(g => g.paymentStatus === 'paid');
    
    if (!allPaid) {
      return res.status(400).json({
        success: false,
        message: 'Cannot confirm: Not all members have paid',
        paymentProgress: groupPlan.paymentProgress
      });
    }

    // Generate confirmation number
    groupPlan.confirmationNumber = groupPlan.generateConfirmationNumber();
    groupPlan.bookingStatus = 'confirmed';
    groupPlan.paymentStatus = 'confirmed';
    groupPlan.adminNotes = adminNotes || '';

    await groupPlan.save();

    // Get IO instance and emit update
    const io = req.app.get('io');
    if (io) {
      io.to(`group:${groupPlan.shareCode}`).emit('booking:confirmed', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode,
        confirmationNumber: groupPlan.confirmationNumber,
        hotelName: groupPlan.hotelName,
        checkInDate: groupPlan.checkInDate,
        checkOutDate: groupPlan.checkOutDate
      });

      // Notify all members via their emails would be handled by email service
      // For real-time, notify the room
      io.to('admin').emit('booking:confirmed', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode,
        confirmationNumber: groupPlan.confirmationNumber
      });
    }

    res.json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Confirm group plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm group plan',
      error: error.message
    });
  }
};

// @desc    Cancel group plan
// @route   PUT /api/group-plans/:id/cancel
// @access  Private/Admin
export const cancelGroupPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const groupPlan = await GroupPlan.findById(id);

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    groupPlan.bookingStatus = 'cancelled';
    groupPlan.paymentStatus = 'cancelled';
    groupPlan.adminNotes = reason || 'Cancelled by admin';

    await groupPlan.save();

    // Get IO instance and emit update
    const io = req.app.get('io');
    if (io) {
      io.to(`group:${groupPlan.shareCode}`).emit('booking:cancelled', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode,
        reason: reason
      });

      io.to('admin').emit('booking:cancelled', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode
      });
    }

    res.json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Cancel group plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel group plan',
      error: error.message
    });
  }
};

// @desc    Update group plan pricing
// @route   PUT /api/group-plans/:id/pricing
// @access  Private
export const updateGroupPlanPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      basePrice, 
      gst, 
      serviceFee, 
      discount, 
      totalPrice, 
      perPersonSplit,
      splitType,
      customSplits 
    } = req.body;

    const groupPlan = await GroupPlan.findById(id);

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    // Update pricing fields
    if (basePrice !== undefined) groupPlan.basePrice = basePrice;
    if (gst !== undefined) groupPlan.gst = gst;
    if (serviceFee !== undefined) groupPlan.serviceFee = serviceFee;
    if (discount !== undefined) groupPlan.discount = discount;
    if (totalPrice !== undefined) groupPlan.totalPrice = totalPrice;
    
    if (splitType !== undefined) {
      groupPlan.splitType = splitType;
      
      if (splitType === 'equal' && perPersonSplit !== undefined) {
        groupPlan.perPersonSplit = perPersonSplit;
        // Update all member amounts
        groupPlan.guests.forEach(g => {
          g.amountToPay = perPersonSplit;
        });
      } else if (splitType === 'custom' && customSplits) {
        // Apply custom splits
        customSplits.forEach((amount, index) => {
          if (groupPlan.guests[index]) {
            groupPlan.guests[index].amountToPay = amount;
          }
        });
      }
    }

    await groupPlan.save();

    // Emit pricing update
    const io = req.app.get('io');
    if (io) {
      io.to(`group:${groupPlan.shareCode}`).emit('pricing:updated', {
        groupPlanId: groupPlan._id,
        shareCode: groupPlan.shareCode,
        pricing: {
          basePrice: groupPlan.basePrice,
          gst: groupPlan.gst,
          serviceFee: groupPlan.serviceFee,
          discount: groupPlan.discount,
          totalPrice: groupPlan.totalPrice,
          perPersonSplit: groupPlan.perPersonSplit,
          splitType: groupPlan.splitType
        }
      });
    }

    res.json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pricing',
      error: error.message
    });
  }
};

// @desc    Mark group plan as completed
// @route   PUT /api/group-plans/:id/complete
// @access  Admin
export const completeGroupPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const groupPlan = await GroupPlan.findById(id);

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    groupPlan.bookingStatus = 'completed';
    await groupPlan.save();

    res.json({
      success: true,
      data: groupPlan
    });
  } catch (error) {
    console.error('Complete group plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete group plan',
      error: error.message
    });
  }
};

// @desc    Delete group plan
// @route   DELETE /api/group-plans/:id
// @access  Admin
export const deleteGroupPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const groupPlan = await GroupPlan.findByIdAndDelete(id);

    if (!groupPlan) {
      return res.status(404).json({
        success: false,
        message: 'Group plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Group plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete group plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete group plan',
      error: error.message
    });
  }
};
