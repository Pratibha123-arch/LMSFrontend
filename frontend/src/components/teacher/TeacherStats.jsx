import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/students/Loading";

const Dashboard = () => {
  const { dashboardData, loadingDashboard, currency } = useContext(AppContext);

  if (loadingDashboard) return <Loading />;

  return dashboardData ? (
    <div className="min-h-screen flex flex-col gap-8 p-6 md:p-10 bg-gray-50">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-5 bg-white shadow-sm border border-blue-200 rounded-2xl hover:shadow-md transition">
          <img
            src={assets.patients_icon}
            alt="students"
            className="w-10 h-10"
          />
          <div>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData?.myCourses?.reduce(
                (total, course) => total + (course.enrollmentCount || 0),
                0
              ) || 0}
            </p>
            <p className="text-sm text-gray-500">Total Enrolments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white shadow-sm border border-green-200 rounded-2xl hover:shadow-md transition">
          <img
            src={assets.appointment_icon}
            alt="courses"
            className="w-10 h-10"
          />
          <div>
            <p className="text-3xl font-bold text-green-600">
              {dashboardData?.totalCourses || 0}
            </p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white shadow-sm border border-yellow-200 rounded-2xl hover:shadow-md transition">
          <img src={assets.earning_icon} alt="earnings" className="w-12 h-12" />
          <div>
            <p className="text-3xl font-bold text-yellow-600">
              {currency}
              {Math.ceil(dashboardData?.totalEarnings || 0)}
            </p>

            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Latest Enrolments Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <h2 className="px-6 py-4 text-lg font-semibold text-gray-800 border-b">
          Latest Enrolments
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 hidden sm:table-cell">#</th>
                <th className="px-6 py-3">Course Title</th>
                <th className="px-6 py-3 text-center">Enrolments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData?.myCourses?.map((course, index) => (
                <tr key={course._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 truncate">{course.title}</td>
                  <td className="px-6 py-3 text-center">
                    {course.enrollmentCount || 0}
                  </td>
                </tr>
              ))}

              {dashboardData?.myCourses?.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-6 text-center text-gray-400"
                  >
                    No enrolments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
