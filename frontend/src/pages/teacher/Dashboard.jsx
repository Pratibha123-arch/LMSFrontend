import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../components/students/Loading';

const Dashboard = () => {
  const { dashboardData, loadingDashboard, currency } = useContext(AppContext);

  if (loadingDashboard) return <Loading />;

  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.patients_icon} alt="patients_icon" className="w-8 h-8"  />
            <div>
  <p className="text-2xl font-medium text-gray-600">
   {dashboardData?.myCourses?.reduce(
  (total, course) => total + (course.enrollmentCount || 0),
  0
) || 0}

  </p>
  <p className="text-base text-gray-500">Total Enrolments</p>
</div>

          </div>

          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.appointment_icon} alt="appointment_icon"  className="w-8 h-8" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData?.totalCourses || 0}
              </p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="earning_icon"  className="w-10 h-10" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {currency}{dashboardData?.totalEarnings || 0}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
  <h2 className="pb-4 text-lg font-medium">Latest Enrolments</h2>
  <table className="table-fixed md:table-auto w-full overflow-hidden">
    <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
      <tr>
        <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
        <th className="px-4 py-3 font-semibold">Course Title</th>
        <th className="px-4 py-3 font-semibold text-center">Enrolments</th>
      </tr>
    </thead>
   <tbody className="text-sm text-gray-500">
  {dashboardData?.myCourses?.map((course, index) => (
    <tr key={course._id} className="border-b border-gray-500/20">
      <td className="px-4 py-3 text-center hidden sm:table-cell">
        {index + 1}
      </td>
      <td className="px-4 py-3 truncate">{course.title}</td>
      <td className="px-4 py-3 text-center">
        {course.enrollmentCount || 0}
      </td>
    </tr>
  ))}
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
