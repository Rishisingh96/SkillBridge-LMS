import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceModal = ({
  enrollment,
  onClose,
}) => {

  const invoiceRef = useRef();

  const downloadInvoice = async () => {

    const element =
      invoiceRef.current;

    const canvas =
      await html2canvas(element, {
        scale: 2,
      });

    const imageData =
      canvas.toDataURL(
        "image/png"
      );

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) /
      canvas.width;

    pdf.addImage(
      imageData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(
      `invoice-${enrollment?._id}.pdf`
    );
  };

  const formatDate = (date) => {

    if (!date)
      return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-[30px]
          w-full
          max-w-5xl
          overflow-hidden
          shadow-2xl
        "
      >

        <div
          ref={invoiceRef}
          className="p-10"
        >

          <div
            className="
              flex
              justify-between
              items-start
              border-b
              border-gray-200
              pb-8
            "
          >

            <div>

              <h1
                className="
                  text-5xl
                  font-black
                  text-gray-900
                "
              >
                INVOICE
              </h1>

              <p
                className="
                  mt-3
                  text-gray-500
                "
              >
                Invoice ID :
                {" "}
                {
                  enrollment?._id
                }
              </p>

              <p
                className="
                  text-gray-500
                  mt-1
                "
              >
                Date :
                {" "}
                {formatDate(
                  enrollment?.createdAt
                )}
              </p>

            </div>

            <div className="text-right">

              <h2
                className="
                  text-3xl
                  font-bold
                  text-gray-900
                "
              >
                Your LMS
              </h2>

              <p className="text-gray-500 mt-2">
                India
              </p>

              <p className="text-gray-500">
                support@yourlms.com
              </p>

            </div>

          </div>

          <div
            className="
              grid
              md:grid-cols-2
              gap-10
              mt-10
            "
          >

            <div>

              <h3
                className="
                  text-xl
                  font-bold
                  text-gray-900
                "
              >
                Billed To
              </h3>

              <div className="mt-4 space-y-2">

                <p className="text-gray-700">
                  {
                    enrollment?.studentName
                  }
                </p>

                <p className="text-gray-700">
                  {
                    enrollment?.studentEmail
                  }
                </p>

                <p className="text-gray-700">
                  {
                    enrollment?.studentPhone
                  }
                </p>

              </div>

            </div>

            <div className="md:text-right">

              <h3
                className="
                  text-xl
                  font-bold
                  text-gray-900
                "
              >
                Payment Details
              </h3>

              <div className="mt-4 space-y-2">

                <p className="text-gray-700">
                  Order ID :
                  {" "}
                  {
                    enrollment?.orderId
                  }
                </p>

                <p className="text-gray-700">
                  Payment ID :
                  {" "}
                  {
                    enrollment?.paymentId
                  }
                </p>

                <p className="text-gray-700">
                  Method :
                  {" "}
                  {
                    enrollment?.paymentMethod
                  }
                </p>

                <p className="text-gray-700">
                  Status :
                  {" "}
                  {
                    enrollment?.paymentStatus
                  }
                </p>

              </div>

            </div>

          </div>

          <div className="mt-12">

            <table className="w-full">

              <thead>

                <tr
                  className="
                    bg-gray-100
                    text-left
                  "
                >

                  <th className="px-5 py-4">
                    Course
                  </th>

                  <th className="px-5 py-4">
                    Original Price
                  </th>

                  <th className="px-5 py-4">
                    Discount
                  </th>

                  <th className="px-5 py-4">
                    Final Price
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr
                  className="
                    border-b
                    border-gray-200
                  "
                >

                  <td className="px-5 py-5">

                    <div className="flex items-center gap-4">

                      <img
                        src={
                          enrollment?.course
                            ?.thumbnail
                        }
                        alt=""
                        className="
                          w-16
                          h-16
                          rounded-xl
                          object-cover
                        "
                      />

                      <div>

                        <p
                          className="
                            font-semibold
                            text-gray-900
                          "
                        >
                          {
                            enrollment?.course
                              ?.title
                          }
                        </p>

                        <p
                          className="
                            text-sm
                            text-gray-500
                            mt-1
                          "
                        >
                          {
                            enrollment?.course
                              ?.category
                          }
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-5">

                    ₹
                    {
                      enrollment?.originalPrice
                    }

                  </td>

                  <td className="px-5 py-5">

                    ₹
                    {
                      enrollment?.discountAmount
                    }

                  </td>

                  <td
                    className="
                      px-5
                      py-5
                      font-bold
                      text-lg
                    "
                  >

                    ₹
                    {
                      enrollment?.pricePaid
                    }

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          <div
            className="
              mt-12
              flex
              justify-between
              items-end
              border-t
              border-gray-200
              pt-8
            "
          >

            <div>

              <p className="text-gray-500">
                Coupon Used :
                {" "}
                {
                  enrollment?.couponCode ||
                  "N/A"
                }
              </p>

              <p className="text-gray-500 mt-2">
                Enrollment Status :
                {" "}
                {
                  enrollment?.status
                }
              </p>

              <p className="text-gray-500 mt-2">
                Access Valid Till :
                {" "}
                {formatDate(
                  enrollment?.endDate
                )}
              </p>

            </div>

            <div className="text-right">

              <p className="text-gray-500">
                Total Amount
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  text-gray-900
                  mt-2
                "
              >
                ₹
                {
                  enrollment?.pricePaid
                }
              </h2>

            </div>

          </div>

        </div>

        <div
          className="
            border-t
            border-gray-200
            p-6
            flex
            justify-end
            gap-4
            bg-gray-50
          "
        >

          <button
            onClick={onClose}
            className="
              px-6
              py-3
              rounded-2xl
              border
              border-gray-300
              font-semibold
              hover:bg-gray-100
              transition-all
            "
          >
            Close
          </button>

          <button
            onClick={
              downloadInvoice
            }
            className="
              px-6
              py-3
              rounded-2xl
              bg-black
              text-white
              font-semibold
              hover:bg-gray-800
              transition-all
            "
          >
            Download PDF
          </button>

        </div>

      </div>

    </div>
  );
};

export default InvoiceModal;