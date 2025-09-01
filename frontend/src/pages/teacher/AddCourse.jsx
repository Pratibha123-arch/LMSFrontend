import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const AddCourse = () => {
  const { token, user } = useContext(AppContext);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    teacher: user?._id || "",
    category: "programming",
    level: "beginner",
    price: 0,
    currency: "USD",
    duration: 0,
    tags: [],
    prerequisites: [],
    learningOutcomes: [],
    chapters: [],
    thumbnail: "", // URL string
  });

  const [activeChapter, setActiveChapter] = useState(null);
  const [activeSubchapter, setActiveSubchapter] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleChapter = (index) =>
    setActiveChapter(activeChapter === index ? null : index);

  const toggleSubchapter = (cIndex, sIndex) => {
    const key = `${cIndex}-${sIndex}`;
    setActiveSubchapter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddChapter = () => {
    setCourseData((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          title: "",
          description: "",
          order: prev.chapters.length + 1,
          subchapters: [],
        },
      ],
    }));
  };

  const handleChapterChange = (index, field, value) => {
    const updated = [...courseData.chapters];
    updated[index][field] = value;
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleAddSubchapter = (cIndex) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters.push({
      title: "",
      description: "",
      order: updated[cIndex].subchapters.length + 1,
      topics: [],
    });
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleSubchapterChange = (cIndex, sIndex, field, value) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters[sIndex][field] = value;
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleAddTopic = (cIndex, sIndex) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters[sIndex].topics.push({
      title: "",
      content: "",
      videoUrl: "",
      duration: 0,
      order: updated[cIndex].subchapters[sIndex].topics.length + 1,
      resources: [],
      quiz: { questions: [], passingScore: 70, maxAttempts: 3 },
    });
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleTopicChange = (cIndex, sIndex, tIndex, field, value) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters[sIndex].topics[tIndex][field] = value;
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleAddResource = (cIndex, sIndex, tIndex) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters[sIndex].topics[tIndex].resources.push({
      title: "",
      url: "",
      type: "link",
    });
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleResourceChange = (
    cIndex,
    sIndex,
    tIndex,
    rIndex,
    field,
    value
  ) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters[sIndex].topics[tIndex].resources[rIndex][
      field
    ] = value;
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleAddQuiz = (cIndex, sIndex, tIndex) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters[sIndex].topics[tIndex].quiz.questions.push({
      question: "",
      options: [{ text: "", isCorrect: false }],
    });
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleQuizChange = (cIndex, sIndex, tIndex, qIndex, field, value) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters[sIndex].topics[tIndex].quiz.questions[qIndex][
      field
    ] = value;
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleOptionChange = (
    cIndex,
    sIndex,
    tIndex,
    qIndex,
    oIndex,
    field,
    value
  ) => {
    const updated = [...courseData.chapters];
    updated[cIndex].subchapters[sIndex].topics[tIndex].quiz.questions[
      qIndex
    ].options[oIndex][field] = value;
    setCourseData((prev) => ({ ...prev, chapters: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in courseData) {
        if (key === "chapters")
          formData.append(key, JSON.stringify(courseData[key]));
        else formData.append(key, courseData[key]);
      }

      const res = await axios.post(
        "http://localhost:5000/api/courses",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Course created successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(
        "Failed to create course:",
        err.response?.data || err.message
      );
      alert("Failed to create course");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={courseData.title}
              onChange={handleChange}
              className="border p-3 w-full rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price in USD"
              value={courseData.price}
              onChange={handleChange}
              className="border p-3 w-full rounded"
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration in minutes"
              value={courseData.duration}
              onChange={handleChange}
              className="border p-3 w-full rounded"
              required
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block font-semibold mb-1">Thumbnail URL</label>
            <input
              type="text"
              name="thumbnail"
              placeholder="Paste image URL here"
              value={courseData.thumbnail}
              onChange={(e) =>
                setCourseData((prev) => ({
                  ...prev,
                  thumbnail: e.target.value,
                }))
              }
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="category"
              value={courseData.category}
              onChange={handleChange}
              className="border p-3 w-full rounded"
            >
              {[
                "programming",
                "design",
                "business",
                "marketing",
                "photography",
                "music",
                "health",
                "language",
                "other",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <select
              name="level"
              value={courseData.level}
              onChange={handleChange}
              className="border p-3 w-full rounded"
            >
              {["beginner", "intermediate", "advanced"].map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Course Description"
            value={courseData.description}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            rows={5}
            required
          />

          {/* Chapters */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto border p-4 rounded bg-gray-50">
            <h3 className="font-semibold text-xl mb-3">Chapters</h3>
            {courseData.chapters.map((chapter, cIndex) => (
              <div key={cIndex} className="border rounded p-4 bg-white mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleChapter(cIndex)}
                >
                  <h4 className="font-bold">
                    {chapter.title || `Chapter ${cIndex + 1}`}
                  </h4>
                  <span>{activeChapter === cIndex ? "-" : "+"}</span>
                </div>

                {activeChapter === cIndex && (
                  <div className="mt-3 space-y-3 max-h-[300px] overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Chapter Title"
                      value={chapter.title}
                      onChange={(e) =>
                        handleChapterChange(cIndex, "title", e.target.value)
                      }
                      className="border p-2 w-full rounded"
                      required
                    />
                    <textarea
                      placeholder="Chapter Description"
                      value={chapter.description}
                      onChange={(e) =>
                        handleChapterChange(
                          cIndex,
                          "description",
                          e.target.value
                        )
                      }
                      className="border p-2 w-full rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubchapter(cIndex)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Add Subchapter
                    </button>

                    {/* Subchapters */}
                    {chapter.subchapters.map((sub, sIndex) => {
                      const subKey = `${cIndex}-${sIndex}`;
                      return (
                        <div
                          key={sIndex}
                          className="border p-3 rounded bg-gray-50 mt-2 ml-4"
                        >
                          <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSubchapter(cIndex, sIndex)}
                          >
                            <h5 className="font-semibold">
                              {sub.title || `Subchapter ${sIndex + 1}`}
                            </h5>
                            <span>{activeSubchapter[subKey] ? "-" : "+"}</span>
                          </div>

                          {activeSubchapter[subKey] && (
                            <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                              <input
                                type="text"
                                placeholder="Subchapter Title"
                                value={sub.title}
                                onChange={(e) =>
                                  handleSubchapterChange(
                                    cIndex,
                                    sIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="border p-2 w-full rounded"
                                required
                              />
                              <textarea
                                placeholder="Subchapter Description"
                                value={sub.description}
                                onChange={(e) =>
                                  handleSubchapterChange(
                                    cIndex,
                                    sIndex,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="border p-2 w-full rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddTopic(cIndex, sIndex)}
                                className="bg-green-500 text-white px-3 py-1 rounded"
                              >
                                Add Topic
                              </button>

                              {/* Topics */}
                              {sub.topics.map((topic, tIndex) => (
                                <div
                                  key={tIndex}
                                  className="border p-3 rounded bg-white mt-2 ml-4"
                                >
                                  <input
                                    type="text"
                                    placeholder="Topic Title"
                                    value={topic.title}
                                    onChange={(e) =>
                                      handleTopicChange(
                                        cIndex,
                                        sIndex,
                                        tIndex,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    className="border p-2 w-full rounded"
                                    required
                                  />
                                  <textarea
                                    placeholder="Topic Content"
                                    value={topic.content}
                                    onChange={(e) =>
                                      handleTopicChange(
                                        cIndex,
                                        sIndex,
                                        tIndex,
                                        "content",
                                        e.target.value
                                      )
                                    }
                                    className="border p-2 w-full rounded"
                                  />

                                  <input
                                    type="text"
                                    placeholder="Video URL"
                                    value={topic.videoUrl}
                                    onChange={(e) =>
                                      handleTopicChange(
                                        cIndex,
                                        sIndex,
                                        tIndex,
                                        "videoUrl",
                                        e.target.value
                                      )
                                    }
                                    className="border p-2 w-full rounded"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddResource(cIndex, sIndex, tIndex)
                                    }
                                    className="bg-purple-500 text-white px-3 py-1 rounded"
                                  >
                                    Add Resource
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddQuiz(cIndex, sIndex, tIndex)
                                    }
                                    className="bg-yellow-500 text-white px-3 py-1 rounded ml-2"
                                  >
                                    Add Quiz
                                  </button>

                                  {/* Resources */}
                                  {topic.resources.map((res, rIndex) => (
                                    <div key={rIndex} className="ml-4 mt-1">
                                      <input
                                        type="text"
                                        placeholder="Resource Title"
                                        value={res.title}
                                        onChange={(e) =>
                                          handleResourceChange(
                                            cIndex,
                                            sIndex,
                                            tIndex,
                                            rIndex,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        className="border p-2 w-full rounded mt-1"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Resource URL"
                                        value={res.url}
                                        onChange={(e) =>
                                          handleResourceChange(
                                            cIndex,
                                            sIndex,
                                            tIndex,
                                            rIndex,
                                            "url",
                                            e.target.value
                                          )
                                        }
                                        className="border p-2 w-full rounded mt-1"
                                      />
                                    </div>
                                  ))}

                                  {/* Quiz Questions */}
                                  {topic.quiz.questions.map((q, qIndex) => (
                                    <div
                                      key={qIndex}
                                      className="ml-4 mt-2 border p-2 rounded bg-gray-100"
                                    >
                                      <input
                                        type="text"
                                        placeholder="Question"
                                        value={q.question}
                                        onChange={(e) =>
                                          handleQuizChange(
                                            cIndex,
                                            sIndex,
                                            tIndex,
                                            qIndex,
                                            "question",
                                            e.target.value
                                          )
                                        }
                                        className="border p-2 w-full rounded mt-1"
                                      />
                                      {q.options.map((opt, oIndex) => (
                                        <div
                                          key={oIndex}
                                          className="flex gap-2 mt-1 items-center"
                                        >
                                          <input
                                            type="text"
                                            placeholder="Option Text"
                                            value={opt.text}
                                            onChange={(e) =>
                                              handleOptionChange(
                                                cIndex,
                                                sIndex,
                                                tIndex,
                                                qIndex,
                                                oIndex,
                                                "text",
                                                e.target.value
                                              )
                                            }
                                            className="border p-2 w-full rounded"
                                          />
                                          <label>
                                            Correct
                                            <input
                                              type="checkbox"
                                              checked={opt.isCorrect}
                                              onChange={(e) =>
                                                handleOptionChange(
                                                  cIndex,
                                                  sIndex,
                                                  tIndex,
                                                  qIndex,
                                                  oIndex,
                                                  "isCorrect",
                                                  e.target.checked
                                                )
                                              }
                                              className="ml-1"
                                            />
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddChapter}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Chapter
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded w-full text-lg"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
