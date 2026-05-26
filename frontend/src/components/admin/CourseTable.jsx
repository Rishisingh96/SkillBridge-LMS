import React from "react";

import {
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

const CourseTable = ({
  courses,
  onDelete,
  onTogglePublish,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left px-6 py-4">
                Course
              </th>

              <th className="text-left px-6 py-4">
                Educator
              </th>

              <th className="text-left px-6 py-4">
                Price
              </th>

              <th className="text-left px-6 py-4">
                Status
              </th>

              <th className="text-center px-6 py-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {courses.map((course) => (

              <tr
                key={course._id}
                className="border-b hover:bg-gray-50 transition-all"
              >

                {/* COURSE */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <img
                      src={course.thumbnail || "https://via.placeholder.com/150"}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                    <div>

                      <h2 className="font-bold text-gray-800">
                        {course.title}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {course.category}
                      </p>

                    </div>

                  </div>

                </td>

                {/* EDUCATOR */}

                <td className="px-6 py-5">

                  <div>

                    <h2 className="font-semibold text-gray-700">
                      {course.creator?.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {course.creator?.email}
                    </p>

                  </div>

                </td>

                {/* PRICE */}

                <td className="px-6 py-5">

                  <span className="font-bold text-green-600">
                    ₹ {course.coursePrice}
                  </span>

                </td>

                {/* STATUS */}

                <td className="px-6 py-5">

                  {course.isPublished ? (

                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                      Published
                    </span>

                  ) : (

                    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium">
                      Unpublished
                    </span>

                  )}

                </td>

                {/* ACTIONS */}

                <td className="px-6 py-5">

                  <div className="flex items-center justify-center gap-3">

                    <button
                      onClick={() =>
                        onTogglePublish(course._id)
                      }
                      className={`p-3 rounded-xl transition-all
                      ${
                        course.isPublished
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                    >

                      {course.isPublished ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                    <button
                      onClick={() =>
                        onDelete(course._id)
                      }
                      className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-all"
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default CourseTable;