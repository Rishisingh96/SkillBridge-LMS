import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa6";
import { FaAward } from "react-icons/fa";

import img from "../../assets/Empty.png";
import Nav from "../../components/navbar/Navbar";

const Certificates = () => {
  const { userData } = useSelector((state) => state.user);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/certificate`,
          { withCredentials: true }
        );
        setCertificates(response.data.certificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#f5f5f7] px-4 md:px-8 py-7 pt-[90px]">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="
          w-11 h-11 rounded-xl bg-white border border-gray-200
          flex items-center justify-center
          shadow-sm hover:shadow-md
          hover:-translate-x-1 transition-all duration-300
        "
        >
          <FaArrowLeft className="text-[18px]" />
        </button>

        <div className="mt-5">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            My Certificates
          </h1>

          <p className="text-gray-500 mt-2 text-[15px]">
            View and download your earned certificates.
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {loading ? (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-gray-500">Loading certificates...</p>
        </div>
      ) : !certificates || certificates.length === 0 ? (
        <div
          className="
          max-w-3xl mx-auto bg-white border border-gray-200
          rounded-[28px] p-10 text-center shadow-sm
        "
        >
          <div
            className="
            w-20 h-20 rounded-full bg-gray-100
            flex items-center justify-center mx-auto
          "
          >
            <FaAward className="text-[40px] text-gray-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-6">
            No Certificates Yet
          </h2>

          <p className="text-gray-500 mt-3 leading-7">
            Complete courses to earn your certificates.
            Start learning by exploring our premium courses.
          </p>

          <button
            onClick={() => navigate("/")}
            className="
            mt-7 bg-black text-white px-7 py-3 rounded-2xl
            font-semibold hover:bg-gray-800
            transition-all duration-300
          "
          >
            Explore Courses
          </button>
        </div>
      ) : (

        /* CERTIFICATES GRID */
        <div
          className="
          max-w-7xl mx-auto
          grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
          gap-6
        "
        >
          {certificates.map((certificate) => (
            <div
              key={certificate._id}
              className="
              bg-white rounded-[28px]
              border border-gray-200
              overflow-hidden
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1
            "
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <FaAward className="text-[24px] text-yellow-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <h2 className="text-[20px] font-bold text-gray-900 mt-4">
                  {certificate.course?.title || "Course Name"}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Certificate ID: {certificate.certificateId}
                </p>

                <button
                  onClick={() => window.open(`${import.meta.env.VITE_BACKEND_URL}/api/certificate/download/${certificate.course._id}`, '_blank')}
                  className="
                  mt-5 w-full
                  bg-black text-white
                  py-3 rounded-2xl
                  font-semibold text-[15px]
                  hover:bg-gray-800
                  transition-all duration-300
                "
                >
                  Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Certificates;
