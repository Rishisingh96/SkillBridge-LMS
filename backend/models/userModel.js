import mongoose from "mongoose"; // ✅ Mongoose uppercase hataya

const userSchema = new mongoose.Schema({

  // ── Basic Info ─────────────────────────
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,                         
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,                    
    trim: true,                          
  },

  password: {
    type: String,
    default: null,                       // ✅ Google auth ke liye null
  },

  photoUrl: {
    type: String,
    default: null,                       // ✅ "" ki jagah null
  },

  // ── Profile Info ───────────────────────
  bio: {
    type: String,
    default: null,
    maxlength: [500, "Bio too long"],
    trim: true,
  },

  phone: {
    type: String,
    default: null,
    trim: true,
  },

  dateOfBirth: {
    type: Date,
    default: null,
  },

  gender: {
    type: String,
    enum: ["male", "female", "other", null],
    default: null,
  },

  // ── Role & Access ──────────────────────
  role: {
    type: String,
    enum: ["student", "educator", "admin"],
    default: "student",
    required: true,
  },

  isBanned: {                            // ✅ Admin ban kar sake
    type: Boolean,
    default: false,
  },

  // ── Verification ───────────────────────
  isVerified: {
    type: Boolean,
    default: false,
  },

  resetOtp: {
    type: String,
    default: null,
  },

  otpExpires: {
    type: Date,
    default: null,
  },

  isOtpVerifed: {
    type: Boolean,
    default: false,
  },

  // ── Student ────────────────────────────
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],

  // ── Educator ───────────────────────────
  totalEarnings: {                       
    type: Number,
    default: 0,
  },

  // ── Analytics ──────────────────────────
  lastLogin: {                           
    type: Date,
    default: null,
  },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;