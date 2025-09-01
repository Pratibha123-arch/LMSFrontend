import Loading from '../../components/students/Loading'
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, []);
  return courses  ? (
   <div class="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
    <div class="w-full">
        <h2 class="pb-4 text-lg font-medium">My Courses</h2>
        <div class="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table class="md:table-auto table-fixed w-full overflow-hidden">
                <thead class="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                    <tr>
                        <th class="px-4 py-3 font-semibold truncate">All Courses</th>
                        <th class="px-4 py-3 font-semibold truncate">Earnings</th>
                        <th class="px-4 py-3 font-semibold truncate">Students</th>
                        <th class="px-4 py-3 font-semibold truncate">Published On</th>
                    </tr>
                </thead>
             <tbody className="text-sm text-gray-500">
  {courses && courses.length > 0 ? (
    courses.map((course) => (
      <tr key={course._id} className="border-b border-gray-500/20">
        {/* Thumbnail + Title */}
        <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
          <img
            src={course?.thumbnail || "/default-thumbnail.png"}
            alt="Course Image"
            className="w-16 h-12 object-cover rounded"
          />
          <span className="truncate hidden md:block">
            {course?.title || "Untitled"}
          </span>
        </td>

        {/* Earnings */}
        <td className="px-4 py-3 text-center">
  {currency}{(course?.enrollmentCount || 0) * (course?.price || 0)}
</td>




        {/* Total Enrollments */}
        <td className="px-4 py-3">
  {course?.enrolledStudents?.length ?? course?.enrollmentCount ?? 0}
</td>


        {/* Created At */}
        <td className="px-4 py-3">
          {course?.createdAt
            ? new Date(course.createdAt).toLocaleDateString()
            : "N/A"}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="4"
        className="px-4 py-6 text-center text-gray-400 italic"
      >
        No courses found
      </td>
    </tr>
  )}
</tbody>

            </table>
        </div>
    </div>
</div>
  ) : <Loading />
}

export default MyCourses
