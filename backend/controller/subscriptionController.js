import SubscriptionPlan from "../models/subscriptionPlanModel.js";
import Subscription from "../models/subscriptionModel.js";

// ======================================================
// ✅ CREATE SUBSCRIPTION PLAN (ADMIN ONLY)
// ======================================================

export const createSubscriptionPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      duration,
      features,
      maxCourses,
      maxStudents,
    } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create subscription plans",
      });
    }

    const plan = await SubscriptionPlan.create({
      name,
      description,
      price,
      currency: currency || "INR",
      duration,
      features: features || [],
      maxCourses: maxCourses || null,
      maxStudents: maxStudents || null,
    });

    res.status(201).json({
      success: true,
      message: "Subscription plan created successfully",
      plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ GET ALL SUBSCRIPTION PLANS (PUBLIC)
// ======================================================

export const getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({
      price: 1,
    });

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ GET ALL SUBSCRIPTION PLANS (ADMIN)
// ======================================================

export const getAllSubscriptionPlansAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all plans",
      });
    }

    const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ GET SINGLE SUBSCRIPTION PLAN
// ======================================================

export const getSubscriptionPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ UPDATE SUBSCRIPTION PLAN (ADMIN ONLY)
// ======================================================

export const updateSubscriptionPlan = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update subscription plans",
      });
    }

    const plan = await SubscriptionPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ DELETE SUBSCRIPTION PLAN (ADMIN ONLY)
// ======================================================

export const deleteSubscriptionPlan = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete subscription plans",
      });
    }

    const plan = await SubscriptionPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ TOGGLE SUBSCRIPTION PLAN STATUS (ADMIN ONLY)
// ======================================================

export const toggleSubscriptionPlanStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can toggle subscription plan status",
      });
    }

    const plan = await SubscriptionPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    res.status(200).json({
      success: true,
      message: plan.isActive
        ? "Subscription plan activated"
        : "Subscription plan deactivated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ CREATE SUBSCRIPTION
// ======================================================

export const createSubscription = async (req, res) => {
  try {
    const { planId, razorpaySubscriptionId, razorpayPaymentId } = req.body;

    const plan = await SubscriptionPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    if (!plan.isActive) {
      return res.status(400).json({
        success: false,
        message: "Subscription plan is not active",
      });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription",
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await Subscription.create({
      user: req.user._id,
      plan: planId,
      startDate,
      endDate,
      status: "active",
      razorpaySubscriptionId,
      razorpayPaymentId,
      amount: plan.price,
      currency: plan.currency,
      autoRenew: false,
    });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ GET USER SUBSCRIPTIONS
// ======================================================

export const getUserSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate("plan")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Subscription.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ GET ALL SUBSCRIPTIONS (ADMIN)
// ======================================================

export const getAllSubscriptions = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all subscriptions",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subscriptions = await Subscription.find()
      .populate("user", "name email")
      .populate("plan")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Subscription.countDocuments();

    res.status(200).json({
      success: true,
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ GET ACTIVE SUBSCRIPTION
// ======================================================

export const getActiveSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
    }).populate("plan");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found",
      });
    }

    // Check if subscription has expired
    if (new Date() > subscription.endDate) {
      subscription.status = "expired";
      await subscription.save();
    }

    res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ✅ CANCEL SUBSCRIPTION
// ======================================================

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      _id: req.params.id,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    if (subscription.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel inactive subscription",
      });
    }

    subscription.status = "cancelled";
    subscription.autoRenew = false;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      subscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
