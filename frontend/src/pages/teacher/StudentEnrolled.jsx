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

      // Map to include student name and course title
      const formattedData = progressData.map((p) => ({
        studentName: p.student
          ? `${p.student.firstName} ${p.student.lastName}`
          : "Unknown Student",
        courseTitle: p.course?.title || "Unknown Course",
        enrolledAt: p.enrolledAt,
      }));

      setEnrolledData(formattedData);
    } catch (err) {
      console.error("Failed to fetch enrolled students:", err);
    }
  };

  useEffect(() => {
    if (token) fetchEnrolledStudents();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Enrolled Students</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Student Name</th>
              <th className="border px-4 py-2 text-left">Course Title</th>
              <th className="border px-4 py-2 text-left">Enrolled Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledData.length > 0 ? (
              enrolledData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.studentName}</td>
                  <td className="border px-4 py-2">{item.courseTitle}</td>
                  <td className="border px-4 py-2">
                    {item.enrolledAt
                      ? new Date(item.enrolledAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
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
