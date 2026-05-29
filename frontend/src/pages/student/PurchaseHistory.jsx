import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaArrowLeft,
} from "react-icons/fa6";

import {
  FaReceipt,
} from "react-icons/fa";

import img from "../../assets/Empty.png";

import Nav from "../../components/navbar/Navbar";

import InvoiceModal from "../../components/student/InvoiceModal";

import {
  fetchUserEnrollments,
} from "../../redux/slices/enrollmentSlice";

const PurchaseHistory = () => {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const {enrollments, loading, error,} = useSelector((state) => {
      console.log("Enrollment state:", state.enrollment);
      return state.enrollment;
    }
  );

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState(null);

  useEffect(() => {

    dispatch(
      fetchUserEnrollments()
    );

  }, [dispatch]);

  const formatDate = (
    date
  ) => {

    if (!date)
      return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {

    return (

      <>
        <Nav />

        <div
          className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-[#f5f5f7]
          "
        >

          <div
            className="
              w-14
              h-14
              border-4
              border-black
              border-t-transparent
              rounded-full
              animate-spin
            "
          />

        </div>
      </>
    );
  }

  return (

    <>
      <Nav />

      <div
        className="
          min-h-screen
          bg-[#f5f5f7]
          px-4
          md:px-8
          py-7
          pt-[90px]
        "
      >

        <div className="max-w-7xl mx-auto mb-8">

          <button
            onClick={() =>
              navigate(
                "/student/dashboard"
              )
            }
            className="
              w-11
              h-11
              rounded-xl
              bg-white
              border
              border-gray-200
              flex
              items-center
              justify-center
              shadow-sm
              hover:shadow-md
              hover:-translate-x-1
              transition-all
              duration-300
            "
          >

            <FaArrowLeft className="text-[18px]" />

          </button>

          <div className="mt-5">

            <h1
              className="
                text-3xl
                md:text-4xl
                font-bold
                text-gray-900
              "
            >
              Purchase History
            </h1>

            <p
              className="
                text-gray-500
                mt-2
                text-[15px]
              "
            >
              View all your purchased
              courses and payment
              history.
            </p>

          </div>

        </div>

        {!loading &&
        enrollments?.length ===
          0 ? (

          <div
            className="
              max-w-3xl
              mx-auto
              bg-white
              border
              border-gray-200
              rounded-[28px]
              p-10
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-full
                bg-gray-100
                flex
                items-center
                justify-center
                mx-auto
              "
            >

              <FaReceipt
                className="
                  text-[40px]
                  text-gray-500
                "
              />

            </div>

            <h2
              className="
                text-2xl
                font-bold
                text-gray-900
                mt-6
              "
            >
              No Purchases Yet
            </h2>

            <p
              className="
                text-gray-500
                mt-3
                leading-7
              "
            >
              You haven't purchased
              any course yet.
            </p>

            <button
              onClick={() =>
                navigate("/")
              }
              className="
                mt-7
                bg-black
                text-white
                px-7
                py-3
                rounded-2xl
                font-semibold
                hover:bg-gray-800
                transition-all
                duration-300
              "
            >
              Explore Courses
            </button>

          </div>

        ) : (

          <div
            className="
              max-w-7xl
              mx-auto
              bg-white
              border
              border-gray-200
              rounded-[28px]
              shadow-sm
              overflow-hidden
            "
          >

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead
                  className="
                    bg-gray-50
                    border-b
                    border-gray-200
                  "
                >

                  <tr>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Course
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Purchase Date
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Amount
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Invoice
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {enrollments?.map(
                    (
                      enrollment,
                      index
                    ) => (

                      <tr
                        key={
                          enrollment?._id ||
                          index
                        }
                        className="
                          border-b
                          border-gray-100
                          hover:bg-gray-50
                          transition-all
                        "
                      >

                        <td className="px-6 py-4">

                          <div
                            className="
                              flex
                              items-center
                              gap-4
                            "
                          >

                            <img
                              src={
                                enrollment
                                  ?.course
                                  ?.thumbnail ||
                                img
                              }
                              alt=""
                              className="
                                w-14
                                h-14
                                rounded-xl
                                object-cover
                              "
                            />

                            <div>

                              <h3
                                className="
                                  font-semibold
                                  text-gray-900
                                "
                              >
                                {
                                  enrollment
                                    ?.course
                                    ?.title
                                }
                              </h3>

                              <p
                                className="
                                  text-sm
                                  text-gray-500
                                  mt-1
                                "
                              >
                                {
                                  enrollment
                                    ?.course
                                    ?.category
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            text-gray-600
                          "
                        >
                          {formatDate(
                            enrollment?.createdAt
                          )}
                        </td>

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            font-bold
                            text-gray-900
                          "
                        >
                          ₹
                          {
                            enrollment?.pricePaid
                          }
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-semibold
                              ${
                                enrollment?.status ===
                                "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                          >
                            {
                              enrollment?.status
                            }
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              setSelectedInvoice(
                                enrollment
                              )
                            }
                            className="
                              text-sm
                              font-semibold
                              text-blue-600
                              hover:text-blue-800
                              transition-all
                            "
                          >
                            Download
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

      {selectedInvoice && (

        <InvoiceModal
          enrollment={
            selectedInvoice
          }
          onClose={() =>
            setSelectedInvoice(
              null
            )
          }
        />

      )}
    </>
  );
};

export default PurchaseHistory;