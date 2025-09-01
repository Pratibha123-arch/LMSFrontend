import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";

const AdminCourses = () => {
  const { allCourses, fetchAllCourses, deleteCourse } = useContext(AppContext);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin - Manage Courses</h2>
        <button
          onClick={() => window.location.href = "/admin/courses/create"}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Create Course
        </button>
      </div>

      {Array.isArray(allCourses) && allCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCourses.map((course) => (
            <div
              key={course._id || course.id}
              className="p-4 border rounded-lg shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600">
                  {course.description || "No description"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Teacher: {course.teacher?.fullName || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      course.isPublished ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    (window.location.href = `/admin/courses/edit/${course._id}`)
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No courses available</p>
      )}
    </div>
  );
};

export default AdminCourses;
