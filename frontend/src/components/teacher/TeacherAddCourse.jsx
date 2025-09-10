// src/pages/teacher/TeacherAddCourse.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const TeacherAddCourse = () => {
  const { token } = useContext(AppContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "programming",
    level: "beginner",
    price: 0,
    duration: 60,
    learningOutcomes: [""],
    chapters: [],
    thumbnail: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // ===== Handlers =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOutcomeChange = (index, value) => {
    const updated = [...form.learningOutcomes];
    updated[index] = value;
    setForm((prev) => ({ ...prev, learningOutcomes: updated }));
  };

  const addOutcome = () => {
    setForm((prev) => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, ""],
    }));
  };

  const addChapter = () => {
    setForm((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        { title: "", description: "", order: prev.chapters.length + 1, subchapters: [] },
      ],
    }));
  };

  const handleChapterChange = (index, field, value) => {
    const updated = [...form.chapters];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, chapters: updated }));
  };

  const addSubchapter = (chapterIndex) => {
    const updated = [...form.chapters];
    updated[chapterIndex].subchapters.push({
      title: "",
      description: "",
      order: updated[chapterIndex].subchapters.length + 1,
      topics: [],
    });
    setForm((prev) => ({ ...prev, chapters: updated }));
  };

  const handleSubchapterChange = (chapterIndex, subIndex, field, value) => {
    const updated = [...form.chapters];
    updated[chapterIndex].subchapters[subIndex][field] = value;
    setForm((prev) => ({ ...prev, chapters: updated }));
  };

  const addTopic = (chapterIndex, subIndex) => {
    const updated = [...form.chapters];
    updated[chapterIndex].subchapters[subIndex].topics.push({
      title: "",
      content: "",
      videoUrl: "",
      duration: 0,
      order: updated[chapterIndex].subchapters[subIndex].topics.length + 1,
      resources: [],
      quiz: {},
      tags: [],
      prerequisites: [],
    });
    setForm((prev) => ({ ...prev, chapters: updated }));
  };

  const handleTopicChange = (chapterIndex, subIndex, topicIndex, field, value) => {
    const updated = [...form.chapters];
    updated[chapterIndex].subchapters[subIndex].topics[topicIndex][field] = value;
    setForm((prev) => ({ ...prev, chapters: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (!token) throw new Error("You must be logged in to create a course.");

      const payload = {
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration, 10),
        learningOutcomes: form.learningOutcomes.filter((o) => o.trim() !== ""),
      };

      await axios.post("http://localhost:5000/api/courses", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setSuccessMsg("Course created successfully!");
      setForm({
        title: "",
        description: "",
        category: "programming",
        level: "beginner",
        price: 0,
        duration: 60,
        learningOutcomes: [""],
        chapters: [],
        thumbnail: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Course</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ===== Basic Info ===== */}
          <div className="space-y-2">
            <label className="font-semibold">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-semibold">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-semibold">Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                disabled={loading}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {["beginner", "intermediate", "advanced"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ===== Thumbnail ===== */}
          <div className="space-y-2">
            <label className="font-semibold">Thumbnail URL</label>
            <input
              type="text"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {form.thumbnail && (
              <img
                src={form.thumbnail}
                alt="Thumbnail Preview"
                className="mt-2 w-40 h-24 object-cover rounded shadow"
              />
            )}
          </div>

          {/* ===== Price & Duration ===== */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-semibold">Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={loading}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="font-semibold">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min="1"
                disabled={loading}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* ===== Learning Outcomes ===== */}
          <div>
            <label className="font-semibold">Learning Outcomes</label>
            <div className="space-y-2">
              {form.learningOutcomes.map((o, i) => (
                <input
                  key={i}
                  value={o}
                  onChange={(e) => handleOutcomeChange(i, e.target.value)}
                  placeholder={`Outcome ${i + 1}`}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addOutcome}
              disabled={loading}
              className="mt-2 text-sm text-green-700 hover:underline"
            >
              + Add Outcome
            </button>
          </div>

          {/* ===== Chapters / Subchapters / Topics ===== */}
          <div>
            <label className="font-semibold">Chapters</label>
            <div className="space-y-4">
              {form.chapters.map((chapter, ci) => (
                <div key={ci} className="p-4 border rounded space-y-2 bg-gray-50">
                  <h4 className="font-bold">Chapter {ci + 1}</h4>
                  <input
                    placeholder="Title"
                    value={chapter.title}
                    onChange={(e) => handleChapterChange(ci, "title", e.target.value)}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={chapter.description}
                    onChange={(e) => handleChapterChange(ci, "description", e.target.value)}
                    disabled={loading}
                    rows={2}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />

                  {chapter.subchapters.map((sub, si) => (
                    <div key={si} className="ml-4 p-3 border rounded space-y-2 bg-white">
                      <h5 className="font-semibold">Subchapter {si + 1}</h5>
                      <input
                        placeholder="Title"
                        value={sub.title}
                        onChange={(e) => handleSubchapterChange(ci, si, "title", e.target.value)}
                        disabled={loading}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                      />
                      <textarea
                        placeholder="Description"
                        value={sub.description}
                        onChange={(e) => handleSubchapterChange(ci, si, "description", e.target.value)}
                        disabled={loading}
                        rows={2}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                      />

                      {sub.topics.map((topic, ti) => (
                        <div key={ti} className="ml-4 p-3 border rounded space-y-2 bg-gray-50">
                          <h6 className="font-medium">Topic {ti + 1}</h6>
                          <input
                            placeholder="Title"
                            value={topic.title}
                            onChange={(e) =>
                              handleTopicChange(ci, si, ti, "title", e.target.value)
                            }
                            disabled={loading}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          />
                          <textarea
                            placeholder="Content"
                            value={topic.content}
                            onChange={(e) =>
                              handleTopicChange(ci, si, ti, "content", e.target.value)
                            }
                            disabled={loading}
                            rows={2}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                          <input
                            placeholder="Video URL"
                            value={topic.videoUrl}
                            onChange={(e) =>
                              handleTopicChange(ci, si, ti, "videoUrl", e.target.value)
                            }
                            disabled={loading}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                          <input
                            type="number"
                            placeholder="Duration (minutes)"
                            value={topic.duration}
                            onChange={(e) =>
                              handleTopicChange(ci, si, ti, "duration", e.target.value)
                            }
                            disabled={loading}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addTopic(ci, si)}
                        disabled={loading}
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        + Add Topic
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSubchapter(ci)}
                    disabled={loading}
                    className="text-sm text-purple-600 hover:underline mt-1"
                  >
                    + Add Subchapter
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addChapter}
              disabled={loading}
              className="mt-2 text-sm
              text-blue-600 hover:underline"
            >
              + Add Chapter
            </button>
          </div>

          {/* ===== Submit ===== */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherAddCourse;
