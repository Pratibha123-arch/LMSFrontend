import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const StudentEnrolled = () => {
  const { token } = useContext(AppContext);
  const [enrolledData, setEnrolledData] = useState([]);

  const fetchEnrolledStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const progressData = res.data.data.progress || [];
      console.log("Fetched data+++:", progressData);

      const formattedData = progressData.map((p) => ({
        studentName: p.student
          ? `${p.student.firstName} ${p.student.lastName}`
          : "Unknown Student",
        courseTitle: p.course?.title || "Unknown Course",
        enrolledAt: p.enrolledAt,
      }));

      console.log("formatted data====", formattedData);

      setEnrolledData(formattedData);
    } catch (err) {
      console.error("Failed to fetch enrolled students:", err);
    }
  };

  useEffect(() => {
    if (token) fetchEnrolledStudents();
  }, [token]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Enrolled Students
      </h2>
      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="border-b px-4 py-3 text-left font-medium">
                Student Name
              </th>
              <th className="border-b px-4 py-3 text-left font-medium">
                Course Title
              </th>
              <th className="border-b px-4 py-3 text-left font-medium">
                Enrolled Date
              </th>
            </tr>
          </thead>
          <tbody>
            {enrolledData.length > 0 ? (
              enrolledData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-gray-700">{item.studentName}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.courseTitle}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.enrolledAt
                      ? new Date(item.enrolledAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-400 italic"
                >
                  No enrolled students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentEnrolled;
