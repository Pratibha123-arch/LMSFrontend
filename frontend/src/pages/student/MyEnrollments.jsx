import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/students/Footer";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    allCourses,
    calculateCourseDuration,
    fetchUserEnrolledCourses,
    navigate,
    subscribeToCourse,
  } = useContext(AppContext);

  useEffect(() => {
    fetchUserEnrolledCourses();
  }, []);

  const handleButtonClick = async (course) => {
    if (!course.isSubscribed) {
      try {
        await subscribeToCourse(course._id);
        await fetchUserEnrolledCourses();
        navigate("/player/" + course._id);
      } catch (err) {
        console.error("Subscription failed:", err);
      }
    } else {
      navigate("/player/" + course._id);
    }
  };

  const calculateNoOfTopics = (course) => {
    if (!course || !course.chapters) return 0;
    return course.chapters.reduce((chapterAcc, chapter) => {
      return (
        chapterAcc +
        (chapter.subchapters?.reduce((subAcc, subchapter) => {
          return subAcc + (subchapter.topics?.length || 0);
        }, 0) || 0)
      );
    }, 0);
  };

  return (
    <div className="flex flex-col min-h-screen"> {/* full page flex container */}
      <main className="flex-grow"> {/* pushes footer down */}
        <div className="md:px-36 px-8 pt-10">
          <h1 className="text-2xl font-semibold">My Enrollments</h1>

          {enrolledCourses.length === 0 ? (
            <p className="text-gray-600 mt-6">
              You haven’t enrolled in any courses yet.
            </p>
          ) : (
            <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
                <tr>
                  <th className="px-4 py-3 font-semibold truncate">Course</th>
                  <th className="px-4 py-3 font-semibold truncate">Duration</th>
                  <th className="px-4 py-3 font-semibold truncate">Topics</th>
                  <th className="px-4 py-3 font-semibold truncate">Status</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {enrolledCourses.map((course, index) => {
                  const progress = course.progress || {};
                  const progressPercent = progress.overallProgress || 0;
                  const isCourseCompleted = progress.isCompleted || false;
                  const hasSubscription = course.isSubscribed;

                  const fullCourse = allCourses?.find(
                    (c) => c._id === course._id
                  );

                  return (
                    <tr key={index} className="border-b border-gray-500/20">
                      <td className="flex items-center gap-3 px-4 py-2">
                        <img
                          src={course.thumbnail || "/default-course.jpg"}
                          alt={course.title}
                          className="w-14 sm:w-24 md:w-28 rounded"
                        />
                        <div>
                          <p className="font-medium">{course.title}</p>
                         
                        </div>
                      </td>
                      <td className="px-4 py-3 max-sm:hidden">
                        {calculateCourseDuration(fullCourse || course)}
                      </td>
                      <td className="px-4 py-3 max-sm:hidden">
                        <p>
                          {fullCourse
                            ? `${calculateNoOfTopics(fullCourse)} Topics`
                            : "N/A"}
                        </p>
                      </td>
                      <td className="px-4 py-3 max-sm:text-right">
                        <button
                          className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded text-white ${
                            hasSubscription
                              ? isCourseCompleted
                                ? "bg-green-600"
                                : "bg-blue-600"
                              : "bg-yellow-500"
                          } max-sm:text-xs`}
                          onClick={() => handleButtonClick(course)}
                        >
                          {!hasSubscription
                            ? "Subscribe"
                            : isCourseCompleted
                            ? "Completed"
                            : "Continue"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* sticky footer at bottom */}
      <Footer />
    </div>
  );
};

export default MyEnrollments;
