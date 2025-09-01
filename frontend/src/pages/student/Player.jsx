import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import VideoJS from "../../components/students/VideoJS";

const Player = () => {
  const { courseId } = useParams();
  const {
    allCourses,
    enrolledCourses,
    markTopicCompleted,
    updateCourseProgress,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [topicStatus, setTopicStatus] = useState({});

  //

  const isEnrolled = (id) => {
    return enrolledCourses.some((c) => c._id === id);
  };
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const course = allCourses.find((c) => String(c._id) === String(courseId));
      setCourseData(course || null);

      const status = {};
      course?.chapters?.forEach((ch, cIdx) => {
        ch.subchapters?.forEach((sub, sIdx) => {
          sub.topics?.forEach((t, tIdx) => {
            status[`${cIdx}-${sIdx}-${tIdx}`] = t.isCompleted || false;
          });
        });
      });
      setTopicStatus(status);
    }
  }, [allCourses, courseId]);

  const toggleSection = (chapterIndex) => {
    setOpenSections((prev) => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex],
    }));
  };

  const handleMarkComplete = async (cIdx, sIdx, tIdx, topic) => {
    const key = `${cIdx}-${sIdx}-${tIdx}`;
    try {
      await markTopicCompleted(courseId, topic._id);
      updateCourseProgress(courseId, topic._id);
      setTopicStatus((prev) => ({ ...prev, [key]: true }));
    } catch (err) {
      console.error("Error marking topic complete:", err);
    }
  };

  if (!allCourses || allCourses.length === 0) return <Loading />;
  if (allCourses.length > 0 && !courseData)
    return (
      <div className="text-center mt-10 text-red-500">Course not found.</div>
    );
   

  return (
    <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
      {/* Left column */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Course Structure</h2>

        {courseData?.chapters?.map((chapter, cIndex) => (
          <div key={cIndex} className="mb-6 border-b pb-3">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleSection(cIndex)}
            >
              <img
                className={`w-4 h-4 transform transition-transform mr-2 ${
                  openSections[cIndex] ? "rotate-180" : ""
                }`}
                src={assets.down_arrow_icon}
                alt="arrow icon"
              />
              <h3 className="text-lg font-semibold">
                {cIndex + 1}. {chapter.title}
              </h3>
            </div>

            {openSections[cIndex] && (
              <div className="mt-2">
                <p className="text-gray-600 mb-2">{chapter.description}</p>

                {chapter.subchapters?.map((subchapter, sIndex) => (
                  <div key={sIndex} className="ml-6 mb-4">
                    <h4 className="font-medium text-gray-700">
                      {cIndex + 1}.{sIndex + 1} {subchapter.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">
                      {subchapter.description}
                    </p>

                    {subchapter.topics?.map((topic, tIndex) => {
                      const key = `${cIndex}-${sIndex}-${tIndex}`;
                      const isCompleted = topicStatus[key];

                      return (
                        <div
                          key={tIndex}
                          className="ml-4 p-2 border-b last:border-b-0 flex justify-between items-center"
                        >
                          <div>
                            <h5 className="text-gray-800">{topic.title}</h5>
                            <p className="text-sm text-gray-500">
                              {topic.content}
                            </p>
                            <p className="text-xs text-gray-400">
                              Duration: {topic.duration} mins (
                              {humanizeDuration(
                                parseInt(topic.duration || 0) * 60 * 1000,
                                {
                                  units: ["h", "m"],
                                }
                              )}
                              )
                            </p>
                          </div>

                          <img
                            src={
                              isCompleted
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt="icon"
                            className="w-5 h-5"
                          />

                          {topic.videoUrl && isEnrolled(courseId) && (
                            <button
                              className="text-blue-600 hover:underline text-sm"
                              onClick={() => {
                                setModalVideoUrl(topic.videoUrl);
                                setIsModalOpen(true);
                              }}
                            >
                              Preview
                            </button>
                          )}


                          <button
                            className={`text-white px-2 py-1 rounded ${
                              isCompleted ? "bg-green-600" : "bg-blue-600"
                            } ml-2 text-sm`}
                            onClick={() =>
                              !isCompleted &&
                              handleMarkComplete(cIndex, sIndex, tIndex, topic)
                            }
                          >
                            {isCompleted ? "Completed" : "Mark Complete"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right column */}
      <div className="md:mt-10">
        {isModalOpen && modalVideoUrl ? (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded max-w-3xl w-full">
              {/* VideoJS supports YouTube and MP4 */}
              <VideoJS
                src={modalVideoUrl}
                type={
                  modalVideoUrl.includes("youtube.com") ||
                  modalVideoUrl.includes("youtu.be")
                    ? "youtube"
                    : "video/mp4"
                }
                controls
                autoplay
                width="640"
                height="360"
              />
              <button
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <img
            src={courseData?.thumbnail || ""}
            alt="Course Thumbnail"
            className="w-full object-cover rounded"
          />
        )}
      </div>
    </div>
  );
};

export default Player;
