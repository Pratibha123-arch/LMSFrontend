import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { assets } from "../../assets/assets";
import Footer from "../../components/students/Footer";
import VideoJS from "../../components/students/VideoJS";

const CourseDetails = () => {
  const { id } = useParams();
  const {
    allCourses,
    currency,
    calculateCourseDuration,
    calculateNoOfTopics,
    enrolledCourses,
    enrollInCourse,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [modalVideoUrl, setModalVideoUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAlreadyEnrolled = enrolledCourses?.some((c) => c._id === id);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const findCourse = allCourses.find((course) => String(course._id) === id);
      setCourseData(findCourse || null);
    }
  }, [id, allCourses]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!allCourses || allCourses.length === 0) return <Loading />;

  if (allCourses.length > 0 && !courseData)
    return (
      <div className="text-center mt-10 text-red-500">Course not found.</div>
    );

  return courseData ? (
    <>
      {/* Main Content */}
      <div className="relative md:px-36 px-8 md:pt-28 pt-20">
        <div className="absolute top-0 left-0 w-full h-section-height bg-gradient-to-b from-cyan-100/70 -z-10"></div>
        <div className="flex md:flex-row flex-col gap-10 items-start justify-between">
          {/* Left Column */}
          <div className="flex-1 max-w-3xl text-gray-500">
            <h1 className="text-3xl md:text-6xl font-bold text-gray-800">
              {courseData.title}
            </h1>
            <p
              className="pt-4 md:text-base text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  courseData.description?.slice(0, 300) ||
                  "No description available.",
              }}
            />

            {/* Course Structure */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Course Structure</h2>
              {courseData.chapters?.map((chapter, cIndex) => (
                <div key={cIndex} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {cIndex + 1}. {chapter.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{chapter.description}</p>

                  {/* Subchapters */}
                  {chapter.subchapters?.map((subchapter, sIndex) => (
                    <div key={sIndex} className="ml-4 mb-4">
                      <h4 className="font-medium text-gray-700">
                        {cIndex + 1}.{sIndex + 1} {subchapter.title}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {subchapter.description}
                      </p>

                      {/* Topics */}
                      {subchapter.topics?.map((topic, tIndex) => (
                        <div
                          key={tIndex}
                          className="ml-6 p-2 border-b last:border-b-0 flex justify-between items-center"
                        >
                          <div>
                            <h5 className="text-gray-800">{topic.title}</h5>
                            <p className="text-sm text-gray-500">
                              {topic.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Duration:{" "}
                              {(Number(topic.duration) / 60).toFixed(1)} mins
                            </p>

                            {/* Resources */}
                            {topic.resources?.length > 0 && (
                              <ul className="list-disc ml-5 text-sm mt-1 text-blue-600">
                                {topic.resources.map((res, rIndex) => (
                                  <li key={rIndex}>
                                    <a
                                      href={res.url}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {res.title} ({res.type})
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Quiz */}
                      {subchapter.quiz && (
                        <div className="mt-6 p-4 border rounded-lg">
                          <h2 className="text-2xl font-semibold mb-2">Quiz</h2>
                          {subchapter.quiz.questions?.map((q, qIdx) => (
                            <div key={qIdx} className="mb-4">
                              <p className="font-medium">
                                Q{qIdx + 1}. {q.question}
                              </p>
                              <ul className="ml-4 mt-1">
                                {q.options.map((opt, oIdx) => (
                                  <li key={oIdx} className="text-sm">
                                    ◼ {opt.text}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-gray-500 text-sm mt-1">
                                💡 {q.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Full Description */}
            <div className="py-20 text-sm md:text-default">
              <h3 className="text-xl font-semibold text-gray-800">
                Course Description
              </h3>
              <p
                className="pt-3 rich-text"
                dangerouslySetInnerHTML={{
                  __html: courseData.description,
                }}
              ></p>
            </div>
          </div>

          {/* Right Column (Course Card) */}
          <div className="max-w-course-card shadow-custom-card rounded overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
            {modalVideoUrl && isModalOpen ? (
              <VideoJS
                src={modalVideoUrl}
                autoplay={true}
                controls={true}
                width={640}
                height={360}
              />
            ) : (
              <img
                src={courseData.thumbnail}
                alt="course thumbnail"
                className="w-[400px] h-[250px] object-cover rounded-lg"
              />
            )}

            <div className="p-5">
              <div className="flex items-center gap-2">
                <img
                  className="w-3.5"
                  src={assets.time_left_clock_icon}
                  alt="time left clock icon"
                />
                <p className="text-red-500">
                  <span className="font-medium">5 days</span> left at this
                  price!
                </p>
              </div>

              {/* Price */}
              <div className="flex gap-3 items-center pt-2">
                <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                  {currency}{" "}
                  {courseData.discount > 0
                    ? (
                        courseData.price -
                        (courseData.discount * courseData.price) / 100
                      ).toFixed(2)
                    : courseData.price}
                </p>
                {courseData.discount > 0 && (
                  <>
                    <p className="md:text-lg text-gray-500 line-through">
                      {currency} {courseData.price}
                    </p>
                    <p className="md:text-lg text-gray-500">
                      {courseData.discount}%off
                    </p>
                  </>
                )}
              </div>

              {/* Rating / Duration / Lessons */}
              <div className="flex items-center text-sm md:text-default gap-4 pt-2 text-gray-500">
                <div className="flex items-center gap-1">
                  <img src={assets.star} alt="star icon" className="w-5 h-5" />
                  <p>
                    {courseData.rating?.count > 0
                      ? `${courseData.rating.average} (${courseData.rating.count})`
                      : "No ratings yet"}
                  </p>
                </div>

                <div className="h-4 w-px bg-gray-500/40"></div>

                <div className="flex items-center gap-1">
                  <img
                    src={assets.time_clock_icon}
                    alt="clock icon"
                    className="w-5 h-5"
                  />
                  <p>{calculateCourseDuration(courseData)}</p>
                </div>

                <div className="h-4 w-px bg-gray-500/40"></div>

                <div className="flex items-center gap-1">
                  <img
                    src={assets.lession_icon}
                    alt="lesson icon"
                    className="w-5 h-5"
                  />
                  <p>{calculateNoOfTopics(courseData)} Topics</p>
                </div>
              </div>

              {/* Enroll Button */}
              <button
                onClick={() => enrollInCourse(id)}
                disabled={isAlreadyEnrolled}
                className={`md:mt-6 mt-4 w-full py-3 rounded font-medium ${
                  isAlreadyEnrolled
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
              </button>

              {/* What's in the Course */}
              <div className="pt-6">
                <p className="md:text-xl text-lg font-medium text-gray-800">
                  What's in the course?
                </p>
                <ul className="ml-4 pt-2 list-disc text-gray-500 text-base md:text-lg">
                  <li>Lifetime access with free updates.</li>
                  <li>Step-by-step, hands-on project guidance.</li>
                  <li>Downloadable resources and source code.</li>
                  <li>Quizzes to test your knowledge.</li>
                  <li>Certificate of completion.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
