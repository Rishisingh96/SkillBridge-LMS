import { FaArrowLeft, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../../App";
import { useTheme } from "../../context/ThemeContext";
import { fetchPublishedCourses, fetchCreatorCourses } from "../../redux/slices/courseSlice";

const Coupons = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { isDark } = useTheme();
  const { courseData, creatorCourseData, loading: coursesLoading } = useSelector(state => state.course);
  
  const isAdmin = userData?.role === 'admin';
  const isEducator = userData?.role === 'educator';
  
  // Use appropriate course data based on role
  const courses = isAdmin ? courseData : creatorCourseData;
  
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minPurchase: "",
    expiryDate: "",
    usageLimit: "",
    couponFor: "all",
    applicableCourses: []
  });

  useEffect(() => {
    fetchCoupons();
    // Fetch courses based on role
    if (isAdmin) {
      dispatch(fetchPublishedCourses());
    } else if (isEducator) {
      dispatch(fetchCreatorCourses());
    }
  }, [dispatch, isAdmin, isEducator]);

  const fetchCoupons = async () => {
    try {
      // Use different endpoint based on role
      const endpoint = isAdmin ? '/api/coupon/all' : '/api/coupon/my-coupons';
      const { data } = await axios.get(`${serverUrl}${endpoint}`, {
        withCredentials: true
      });
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${serverUrl}/api/coupon/create`, formData, {
        withCredentials: true
      });
      if (data.success) {
        toast.success("Coupon created successfully");
        setShowCreateModal(false);
        resetForm();
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/coupon/update/${selectedCoupon._id}`,
        formData,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Coupon updated successfully");
        setShowEditModal(false);
        resetForm();
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update coupon");
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      const { data } = await axios.delete(`${serverUrl}/api/coupon/delete/${couponId}`, {
        withCredentials: true
      });
      if (data.success) {
        toast.success("Coupon deleted successfully");
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleToggleStatus = async (couponId) => {
    try {
      const { data } = await axios.patch(`${serverUrl}/api/coupon/toggle/${couponId}`, {}, {
        withCredentials: true
      });
      if (data.success) {
        toast.success(data.message);
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle status");
    }
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minPurchase: coupon.minPurchase,
      expiryDate: coupon.expiryDate?.split('T')[0],
      usageLimit: coupon.usageLimit,
      couponFor: coupon.couponFor,
      applicableCourses: coupon.applicableCourses || []
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      maxDiscount: "",
      minPurchase: "",
      expiryDate: "",
      usageLimit: "",
      couponFor: "all",
      applicableCourses: []
    });
    setSelectedCoupon(null);
  };

  const handleCourseToggle = (courseId) => {
    setFormData(prev => ({
      ...prev,
      applicableCourses: prev.applicableCourses.includes(courseId)
        ? prev.applicableCourses.filter(id => id !== courseId)
        : [...prev.applicableCourses, courseId]
    }));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-[#f5f6fa]'} px-3 md:px-8 py-4 md:py-6`}>
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6 md:mb-8">
        
        {/* Left */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/educator/profile")}
            className={`min-w-[42px] h-[42px] rounded-full shadow flex items-center justify-center transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
          >
            <FaArrowLeft className="text-[17px]" />
          </button>

          <div>
            <h1 className={`text-[22px] md:text-3xl font-bold leading-tight ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              {isAdmin ? 'All Coupons' : 'My Coupons'}
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isAdmin ? 'Manage all platform discount coupons' : 'Create and manage your discount coupons'}
            </p>
          </div>
        </div>

        {/* Right */}
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-black text-white px-5 py-3 rounded-xl font-medium hover:scale-105 transition duration-200 shadow-md w-full md:w-auto flex items-center justify-center gap-2"
        >
          <FaPlus />
          Create Coupon
        </button>
      </div>

      {/* Desktop Table */}
      <div className={`hidden md:block max-w-7xl mx-auto ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border overflow-hidden`}>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            
            {/* Header */}
            <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr>
                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Coupon Code
                </th>
                {isAdmin && (
                  <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Creator
                  </th>
                )}
                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Discount
                </th>
                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Usage
                </th>
                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Expires
                </th>
                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </th>
                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? "7" : "6"} className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Loading...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "7" : "6"} className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No coupons found. Create your first coupon!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className={`border-t ${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition`}>
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>
                      {coupon.code}
                    </td>
                    {isAdmin && (
                      <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div>
                          <p className="font-medium">{coupon.createdBy?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{coupon.creatorRole || 'admin'}</p>
                        </div>
                      </td>
                    )}
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {coupon.discountType === 'fixed' ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}
                      {coupon.maxDiscount > 0 && ` (Max ₹${coupon.maxDiscount})`}
                    </td>
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {coupon.usedCount} / {coupon.usageLimit}
                    </td>
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className={`px-6 py-4`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(coupon._id)}
                          className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                          title={coupon.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {coupon.isActive ? <FaToggleOn className="text-green-500" /> : <FaToggleOff className="text-red-500" />}
                        </button>
                        <button
                          onClick={() => openEditModal(coupon)}
                          className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden max-w-7xl mx-auto space-y-4">
        {loading ? (
          <div className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading...
          </div>
        ) : coupons.length === 0 ? (
          <div className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No coupons found. Create your first coupon!
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon._id} className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {coupon.code}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>Creator: {coupon.createdBy?.name || 'Unknown'}</p>
                <p>Discount: {coupon.discountType === 'fixed' ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}</p>
                <p>Usage: {coupon.usedCount} / {coupon.usageLimit}</p>
                <p>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => handleToggleStatus(coupon._id)}
                  className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {coupon.isActive ? <FaToggleOn className="text-green-500" /> : <FaToggleOff className="text-red-500" />}
                </button>
                <button
                  onClick={() => openEditModal(coupon)}
                  className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                Create New Coupon
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    placeholder="e.g., SAVE20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Discount Type
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Discount Value
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                      placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                      required
                    />
                  </div>
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Maximum Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                      placeholder="e.g., 1000"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Minimum Purchase (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                      placeholder="e.g., 500"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                      placeholder="e.g., 100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Applicable To
                  </label>
                  <select
                    value={formData.couponFor}
                    onChange={(e) => setFormData({...formData, couponFor: e.target.value, applicableCourses: []})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                  >
                    <option value="all">All Courses</option>
                    <option value="specific">Specific Courses</option>
                  </select>
                </div>

                {formData.couponFor === 'specific' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Select Courses
                    </label>
                    <div className="space-y-1 max-h-60 overflow-y-auto border rounded-lg p-2">
                      {coursesLoading ? (
                        <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Loading courses...
                        </p>
                      ) : courses && courses.length > 0 ? (
                        courses.map((course) => (
                          <label key={course._id} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition`}>
                            <input
                              type="checkbox"
                              checked={formData.applicableCourses.includes(course._id)}
                              onChange={() => handleCourseToggle(course._id)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className={`text-sm flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {course.title}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          No courses available
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                Edit Coupon
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Discount Type
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Discount Value
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                      required
                    />
                  </div>
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Maximum Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Minimum Purchase (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Applicable To
                  </label>
                  <select
                    value={formData.couponFor}
                    onChange={(e) => setFormData({...formData, couponFor: e.target.value, applicableCourses: []})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                  >
                    <option value="all">All Courses</option>
                    <option value="specific">Specific Courses</option>
                  </select>
                </div>

                {formData.couponFor === 'specific' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Select Courses
                    </label>
                    <div className="space-y-1 max-h-60 overflow-y-auto border rounded-lg p-2">
                      {coursesLoading ? (
                        <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Loading courses...
                        </p>
                      ) : courses && courses.length > 0 ? (
                        courses.map((course) => (
                          <label key={course._id} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition`}>
                            <input
                              type="checkbox"
                              checked={formData.applicableCourses.includes(course._id)}
                              onChange={() => handleCourseToggle(course._id)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className={`text-sm flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {course.title}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          No courses available
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  >
                    Update Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
