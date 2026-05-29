import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  BadgePercent,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Lock,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

import { serverUrl } from "../../App";
import Nav from "../../components/navbar/Navbar.jsx";

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { selectedCourse } = useSelector(
    (state) => state.course
  );

  const { userData } = useSelector(
    (state) => state.user
  );

  // =========================================
  // USER DETAILS
  // =========================================

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
    });

  // =========================================
  // COUPON STATES
  // =========================================

  const [coupon, setCoupon] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [appliedCouponId, setAppliedCouponId] =
    useState(null);

  const [couponMessage, setCouponMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [couponLoading, setCouponLoading] =
    useState(false);

  const [showFullDescription, setShowFullDescription] = useState(false);

  // =========================================
  // AUTO USER FILL
  // =========================================

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
      });
    }
  }, [userData]);

  // =========================================
  // FINAL PRICE
  // =========================================

  const finalPrice = useMemo(() => {
    if (!selectedCourse) return 0;

    return Math.max(
      selectedCourse.price - discount,
      0
    );
  }, [selectedCourse, discount]);

  // =========================================
  // FORMAT DESCRIPTION
  // =========================================

  const formatDescription = (description) => {
    if (!description) return null;

    const lines = description.split('\n');
    const moduleRegex = /^(Module\s+\d+[:\s]|Module\s+\d+\.)/i;
    
    const formattedContent = [];
    let currentModule = null;
    let currentContent = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (moduleRegex.test(trimmedLine)) {
        if (currentModule) {
          formattedContent.push({
            type: 'module',
            title: currentModule,
            content: currentContent
          });
        }
        
        currentModule = trimmedLine;
        currentContent = [];
      } else if (currentModule) {
        if (trimmedLine) {
          currentContent.push(trimmedLine);
        }
      } else {
        if (trimmedLine) {
          formattedContent.push({
            type: 'text',
            content: trimmedLine
          });
        }
      }
    });

    if (currentModule) {
      formattedContent.push({
        type: 'module',
        title: currentModule,
        content: currentContent
      });
    }

    return formattedContent;
  };

  const formattedDescription = useMemo(() => {
    return formatDescription(selectedCourse?.description);
  }, [selectedCourse]);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================================
  // APPLY COUPON
  // =========================================

  const applyCoupon = async () => {
    try {
      if (!coupon) {
        return alert(
          "Please enter coupon"
        );
      }

      setCouponLoading(true);

      const { data } =
        await axios.post(
          serverUrl + "/api/coupon/apply",
          {
            code: coupon,
            courseId:
              selectedCourse?._id,
          },
          {
            withCredentials: true,
          }
        );

      if (data.success) {
        setDiscount(data.discount);
        setAppliedCouponId(data.couponId);

        setCouponMessage(
          `Coupon Applied Successfully 🎉`
        );
      }
    } catch (error) {
      console.log(error);

      setDiscount(0);

      setCouponMessage(
        error?.response?.data
          ?.message ||
          "Invalid Coupon ❌"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // =========================================
  // PAYMENT
  // =========================================

  const handlePayment = async () => {
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        return alert("Please fill all details");
      }

      setLoading(true);

      const orderData = await axios.post(
        serverUrl + "/api/order/razorpay-order",
        { 
          courseId: selectedCourse?._id,
          couponCode: coupon,
          discount: discount
        },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.order.amount,
        currency: "INR",
        name: "LEARN SKILLS",
        description: "COURSE ENROLLMENT",
        order_id: orderData.data.order.id,
        
        handler: async function (response) {
          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/order/verifypayment",
              { 
                ...response, 
                courseId: selectedCourse?._id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                originalPrice: selectedCourse?.price,
                discountAmount: discount,
                couponId: appliedCouponId,
                couponCode: coupon
              },
              { withCredentials: true }
            );

            toast.success(verifyPayment.data.message);
            navigate(`/viewlecture/${selectedCourse?._id}`);
          } catch (error) {
            toast.error(error.response?.data?.message);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* TOP NAVBAR */}
      <Nav />

      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid lg:grid-cols-[1.1fr_.8fr] gap-10">
          {/* LEFT */}

          <div>
            <div className="space-y-7">
              {/* TITLE */}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-orange-500" />

                  <p className="text-orange-500 font-semibold">
                    Best Seller Course
                  </p>
                </div>

                <h1 className="text-3xl md:text-5xl font-black leading-tight text-gray-900">
                  {
                    selectedCourse?.title
                  }
                </h1>
              </div>

              {/* IMAGE */}

              <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                <img
                  src={
                    selectedCourse?.thumbnail
                  }
                  alt=""
                  className="w-full h-[250px] md:h-[420px] object-cover group-hover:scale-105 duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold">
                    Hindi
                  </div>

                  <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold">
                    New Course
                  </div>
                </div>
              </div>

              {/* PRICE */}

              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-4xl font-black text-gray-900">
                  ₹ {finalPrice}
                </h2>

                <p className="text-2xl text-gray-400 line-through">
                  ₹{" "}
                  {
                    selectedCourse?.price
                  }
                </p>

                <div className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full">
                  {selectedCourse
                    ?.discount || 0}
                  % OFF
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <div className="text-gray-700 text-lg leading-9 space-y-4">
                  {formattedDescription?.slice(0, showFullDescription ? formattedDescription.length : 2).map((item, index) => {
                    if (item.type === 'text') {
                      return (
                        <p key={index} className="leading-8">
                          {item.content}
                        </p>
                      );
                    } else if (item.type === 'module') {
                      return (
                        <div key={index} className="rounded-2xl p-4 bg-gray-50">
                          <h3 className="text-lg font-bold mb-2 text-indigo-600">
                            {item.title}
                          </h3>
                          <ul className="space-y-1 ml-4">
                            {item.content.map((contentItem, contentIndex) => (
                              <li key={contentIndex} className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                <span className="leading-7">{contentItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {formattedDescription?.length > 2 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-4 px-6 py-3 rounded-2xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 transition-all"
                  >
                    {showFullDescription ? "Show Less" : "View All"}
                  </button>
                )}

                <div className="mt-8 grid sm:grid-cols-2 gap-5">
                  <div className="bg-[#f5f7fb] rounded-2xl p-5">
                    <CheckCircle2 className="text-green-500 mb-3" />

                    <h3 className="font-bold text-lg">
                      Lifetime Access
                    </h3>

                    <p className="text-gray-500 mt-1">
                      Learn anytime
                      anywhere.
                    </p>
                  </div>

                  <div className="bg-[#f5f7fb] rounded-2xl p-5">
                    <ShieldCheck className="text-blue-500 mb-3" />

                    <h3 className="font-bold text-lg">
                      Certificate
                    </h3>

                    <p className="text-gray-500 mt-1">
                      Verified completion
                      certificate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div>
            <div className="sticky top-24">
              <div className="bg-white border border-gray-100 shadow-xl rounded-[32px] overflow-hidden">
                {/* HEADER */}

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <h2 className="text-3xl font-black">
                    Secure Checkout 🔒
                  </h2>

                  <p className="mt-2 text-white/80">
                    Complete your payment
                    securely
                  </p>
                </div>

                <div className="p-6 md:p-8 space-y-7">
                  {/* DETAILS */}

                  <div>
                    <h3 className="text-xl font-bold mb-5">
                      Your Details
                    </h3>

                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter Your Name"
                        value={
                          formData.name
                        }
                        onChange={
                          handleChange
                        }
                        className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter Your Email"
                        value={
                          formData.email
                        }
                        onChange={
                          handleChange
                        }
                        className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <input
                        type="number"
                        name="phone"
                        placeholder="Enter Your Phone"
                        value={
                          formData.phone
                        }
                        onChange={
                          handleChange
                        }
                        className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* PLAN */}

                  <div className="border border-gray-200 rounded-3xl p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold">
                          One Time
                          Payment
                        </h2>

                        <p className="text-gray-500 mt-1">
                          Lifetime
                          Validity
                        </p>
                      </div>

                      <CreditCard className="text-blue-600" />
                    </div>
                  </div>

                  {/* COUPON */}

                  <div className="border border-gray-200 rounded-3xl p-5">
                    <div className="flex items-center gap-3 mb-5">
                      <BadgePercent className="text-orange-500" />

                      <h2 className="text-xl font-bold">
                        Apply Coupon
                      </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Enter Coupon"
                        value={coupon}
                        onChange={(e) =>
                          setCoupon(
                            e.target.value
                          )
                        }
                        className="flex-1 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                      />

                      <button
                        onClick={
                          applyCoupon
                        }
                        disabled={
                          couponLoading
                        }
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-bold duration-300"
                      >
                        {couponLoading
                          ? "Applying..."
                          : "Apply"}
                      </button>
                    </div>

                    {couponMessage && (
                      <p
                        className={`mt-4 font-semibold ${
                          discount > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {
                          couponMessage
                        }
                      </p>
                    )}
                  </div>

                  {/* BILL */}

                  <div className="bg-[#f8faff] rounded-3xl p-6 border border-gray-100">
                    <h2 className="text-2xl font-black mb-6">
                      Bill Summary
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>
                          Original Price
                        </span>

                        <span>
                          ₹{" "}
                          {
                            selectedCourse?.price
                          }
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-green-600">
                        <span>
                          Discount
                        </span>

                        <span>
                          - ₹{" "}
                          {discount}
                        </span>
                      </div>

                      <div className="border-t pt-5 flex items-center justify-between">
                        <span className="text-xl font-bold">
                          Total Amount
                        </span>

                        <span className="text-3xl font-black text-blue-600">
                          ₹{" "}
                          {
                            finalPrice
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT */}

                  <button
                    onClick={
                      handlePayment
                    }
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] duration-300 text-white py-5 rounded-3xl font-black text-xl shadow-xl"
                  >
                    {loading
                      ? "Processing..."
                      : `Pay ₹${finalPrice}`}
                  </button>

                  {/* SECURITY */}

                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Lock size={18} />

                    <p>
                      100% Secure Payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE FIXED BAR */}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-gray-500 text-sm">
                Total
              </p>

              <h2 className="text-2xl font-black">
                ₹ {finalPrice}
              </h2>
            </div>

            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-7 py-4 rounded-2xl font-bold"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;