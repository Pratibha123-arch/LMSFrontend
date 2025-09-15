import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";

export const AppContext = createContext();

export const useAppContext = () => {
  return React.useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();

  // ===== State =====
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isTeacher, setIsTeacher] = useState(true);
  const [subscriptions, setUserSubscriptions] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // ===== Axios auth header =====
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ===== Fetch All Courses =====
  const fetchAllCourses = async () => {
    try {
      const res = await axios.get("http://13.233.183.81/api/courses");
      console.log("API /courses response:", res.data);

      let coursesData = [];
      if (Array.isArray(res.data)) coursesData = res.data;
      else if (Array.isArray(res.data.courses)) coursesData = res.data.courses;
      else if (Array.isArray(res.data.data?.courses))
        coursesData = res.data.data.courses;
      else if (Array.isArray(res.data.data)) coursesData = res.data.data;

      setAllCourses(coursesData);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setAllCourses([]);
    }
  };

  // ===== Enroll in Course =====
  // ===== Enroll in Course =====
  const enrollInCourse = async (courseId) => {
    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await axios.post(
        `http://13.233.183.81/api/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Progress object (from backend)
      const progress = res.data.data;

      // Find full course from allCourses
      const enrolledCourse = allCourses.find((c) => c._id === courseId);

      setEnrolledCourses((prev = []) => {
        if (prev.some((c) => c._id === courseId)) return prev;
        return enrolledCourse ? [...prev, enrolledCourse] : prev;
      });

      alert("Enrolled successfully!");
    } catch (err) {
      console.error("Enroll failed:", err.response?.data || err.message);
      alert("Enrollment failed!");
    }
  };

  // ===== Progress & Topic Functions =====
  const markTopicCompleted = async (courseId, topicId, timeSpent = 0) => {
    try {
      const res = await axios.post(
        `http://13.233.183.81/api/progress/course/${courseId}/topic/${topicId}/complete`,
        { timeSpent },
        { withCredentials: true }
      );

      if (res.data.success) {
        fetchUserEnrolledCourses();
        setEnrolledCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId
              ? { ...course, progress: res.data.progress }
              : course
          )
        );
      }
    } catch (err) {
      console.error("Error marking topic completed:", err);
    }
  };

  const updateCourseProgress = (courseId, topicId) => {
    setAllCourses((prev) =>
      prev.map((c) => {
        if (c._id === courseId) {
          const updated = { ...c };
          updated.chapters.forEach((ch) =>
            ch.subchapters.forEach((sub) =>
              sub.topics.forEach((t) => {
                if (t._id === topicId) t.isCompleted = true;
              })
            )
          );
          return updated;
        }
        return c;
      })
    );
  };

  const toggleBookmark = async (courseId, topicId) => {
    try {
      const res = await axios.post(
        `/api/progress/course/${courseId}/topic/${topicId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { isBookmarked } = res.data.data;
      setBookmarks(
        (prev) =>
          isBookmarked
            ? [...prev, topicId] // add
            : prev.filter((id) => id !== topicId) // remove
      );
      return isBookmarked;
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    }
  };

  // ===== Subscription =====
  const subscribeToCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://13.233.183.81/api/subscriptions/course/${courseId}`,
        {
          subscriptionType: "free",
          paymentMethod: "free",
          transactionId: "134567",
          discountCode: "13456",
        },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      console.log("Subscribed:", res.data);
      setUserSubscriptions((prev) => [...prev, res.data]);
      fetchUserEnrolledCourses();
    } catch (err) {
      console.error("Error subscribing:", err.response?.data || err.message);
    }
  };

  // ===== Calculations =====
  const calculateRating = (course) => course?.rating?.average || 0;
  const calculateRatingCount = (course) => course?.rating?.count || 0;

  const calculateChapterTime = (chapter) => {
    if (!chapter?.subchapters?.length) return "0m";
    let totalMinutes = 0;
    chapter.subchapters.forEach((sub) => {
      sub.topics?.forEach((topic) => {
        totalMinutes += topic.timeSpent || 0;
      });
    });
    return totalMinutes === 0
      ? "0m"
      : humanizeDuration(totalMinutes * 60 * 1000, {
          units: ["h", "m"],
          round: true,
        });
  };

  const calculateCourseDuration = (course) => {
    if (!course?.chapters?.length) return "0m";
    let totalMinutes = 0;
    course.chapters.forEach((chapter) => {
      chapter.subchapters?.forEach((sub) => {
        sub.topics?.forEach((topic) => {
          totalMinutes += Number(topic.duration) || 0;
        });
      });
    });
    return totalMinutes === 0
      ? "0m"
      : humanizeDuration(totalMinutes * 60 * 1000, {
          units: ["h", "m"],
          round: true,
        });
  };

  const calculateNoOfTopics = (course) => {
    if (!course?.chapters?.length) return 0;
    let totalTopics = 0;
    course.chapters.forEach((chapter) => {
      chapter.subchapters?.forEach((sub) => {
        totalTopics += sub.topics?.length || 0;
      });
    });
    return totalTopics;
  };

  // ===== Auth =====
  const requestOtp = async (payload) => {
    try {
      const res = await axios.post(
        "http://13.233.183.81/api/auth/request-otp",
        payload
      );
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await axios.post(
        "http://13.233.183.81/api/auth/verify-otp",
        { email, otp }
      );
      const jwt = res.data.data.token;
      const loggedUser = res.data.data.user;

      localStorage.setItem("token", jwt);
      setToken(jwt);
      setUser(loggedUser);

      return res.data;
    } catch (err) {
      throw (
        err.response?.data || { message: err.message || "Something went wrong" }
      );
    }
  };

  const resendOtp = async (email, deliveryMethod = "email") => {
    const res = await axios.post("http://13.233.183.81/api/auth/resend-otp", {
      email,
      deliveryMethod,
    });
    return res.data.data;
  };

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://13.233.183.81/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (err) {
      console.error("Profile fetch failed:", err.response?.data || err.message);
    }
  };

 const updateProfile = async (formData) => {
    if (!token) return;
    try {
      const res = await axios.put(
        "http://13.233.183.81/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data.data); 
    } catch (err) {
      console.error("Profile update failed:", err.response?.data || err.message);
      throw err;
    }
  };


  const logout = async () => {
    try {
      await axios.post(
        "http://13.233.183.81/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.clear();
      setToken(null);
      setUser(null);
      navigate("");
    }
  };

  // ===== Enrolled Courses =====
  const fetchUserEnrolledCourses = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://13.233.183.81/api/progress");
      const progressData = res.data.data.progress || [];

      const mergedCourses = progressData.map((p) => {
        const course = p.course || {};
        const chapters = course.chapters || [];

        let totalTopics = 0;
        let completedTopics = 0;

        chapters.forEach((chap) => {
          chap.subchapters?.forEach((sub) => {
            const topics = sub.topics || [];
            totalTopics += topics.length;
            completedTopics += topics.filter((t) => t.isCompleted).length;
          });
        });

        const overallProgress =
          totalTopics > 0
            ? Math.round((completedTopics / totalTopics) * 100)
            : 0;
        const isCompleted = totalTopics > 0 && completedTopics === totalTopics;

        return {
          ...course,
          progress: {
            totalTopics,
            completedTopics,
            overallProgress,
            isCompleted,
          },
        };
      });

      setEnrolledCourses(mergedCourses);
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
      if (err.response?.status === 401) logout();
      setEnrolledCourses([]);
    }
  };

  // ===== Dashboard & Teacher =====
  const fetchDashboardData = async () => {
    if (!token || !user?._id) return;
    setLoadingDashboard(true);
    try {
      const coursesRes = await axios.get(
        `http://13.233.183.81/api/courses/teacher/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const myCourses = coursesRes.data?.data?.courses || [];

      const totalEarnings = myCourses.reduce(
        (acc, course) =>
          acc + (course.price || 0) * (course.enrollmentCount || 0),
        0
      );

      const progressRes = await axios.get(
        "http://13.233.183.81/api/progress",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const progressData = progressRes.data.data.progress || [];

      const enrolledStudentsData = progressData.map((p) => {
        const course = myCourses.find((c) => c._id === p.course) || {};
        return {
          student: p.student || {
            name: "Unknown",
            thumbnail: "/default-profile.png",
          },
          title: course.title || "Unknown Course",
          createdAt: p.enrolledAt,
        };
      });

      setDashboardData({
        totalCourses: myCourses.length,
        myCourses,
        totalEarnings,
        enrolledStudentsData,
      });
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setDashboardData({
        totalCourses: 0,
        myCourses: [],
        totalEarnings: 0,
        enrolledStudentsData: [],
      });
    } finally {
      setLoadingDashboard(false);
    }
  };

  // ===== Quizzes =====
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://13.233.183.81/api/quizzes");
      let quizzesData = [];
      if (Array.isArray(res.data)) quizzesData = res.data;
      else if (Array.isArray(res.data.quizzes)) quizzesData = res.data.quizzes;
      else if (Array.isArray(res.data.data?.quizzes))
        quizzesData = res.data.data.quizzes;
      else if (Array.isArray(res.data.data)) quizzesData = res.data.data;

      setQuizzes(quizzesData);
    } catch (err) {
      console.error("Error fetching quizzes", err);
      setQuizzes([]);
    }
  };

  const addQuiz = async (quiz) => {
    try {
      const res = await axios.post("http://13.233.183.81/api/quizzes", quiz, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const quizData = res.data?.data?.quiz || res.data?.data || res.data;
      setQuizzes((prev) => [...prev, quizData]);
      return res.data;
    } catch (err) {
      console.error("Error adding quiz:", err);
      throw err;
    }
  };

  const startQuiz = async (quizId) => {
    try {
      const res = await axios.post(
        `http://13.233.183.81/api/quizzes/${quizId}/start`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data; // should include { quiz, questions, attemptNumber, attemptsRemaining }
    } catch (err) {
      console.error("Error starting quiz:", err.response?.data || err.message);
      throw err;
    }
  };

  const submitQuiz = async (quizId, answers, timeSpent = 0) => {
    try {
      const res = await axios.post(
        `http://13.233.183.81/api/quizzes/${quizId}/submit`,
        { answers, timeSpent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.error(
        "Error submitting quiz:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  // ===== Admin APIs =====
  const fetchAdminDashboard = async () => {
    const res = await axios.get("http://13.233.183.81/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  };

  const fetchAdminUsers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("http://13.233.183.81/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setAdminUsers(res.data?.data?.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setAdminUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id) => {
    const res = await axios.patch(
      `http://13.233.183.81/api/admin/users/${id}/toggle-status`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  };

  // ===== Effects =====
  useEffect(() => {
    fetchAllCourses();
  }, []);
  useEffect(() => {
    if (allCourses.length > 0) fetchUserEnrolledCourses();
  }, [allCourses]);
  useEffect(() => {
    if (token) fetchUserEnrolledCourses();
  }, [token]);
  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);
  useEffect(() => {
    if (token && user?._id) fetchDashboardData();
  }, [token, user]);

  // ===== Context Value =====
  const value = {
    currency,
    allCourses,
    navigate,
    fetchAllCourses,
    calculateRating,
    calculateRatingCount,
    isTeacher,
    setIsTeacher,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfTopics,
    enrolledCourses,
    fetchUserEnrolledCourses,
    user,
    token,
    requestOtp,
    verifyOtp,
    resendOtp,
    fetchProfile,
    logout,
    setUser,
    markTopicCompleted,
    toggleBookmark,
    subscribeToCourse,
    updateCourseProgress,
    updateProfile,
    fetchDashboardData,
    loadingDashboard,
    dashboardData,
    quizzes,
    loading,
    fetchQuizzes,
    addQuiz,
    startQuiz,
    submitQuiz,
    fetchAdminDashboard,
    fetchAdminUsers,
    toggleUserStatus,
    enrollInCourse,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
