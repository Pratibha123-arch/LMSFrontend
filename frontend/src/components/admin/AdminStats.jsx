import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const AdminStats = () => {
  const { token } = useContext(AppContext);

  const [stats, setStats] = useState(null);

  // Loading states
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingRetry, setLoadingRetry] = useState(false);

  // Test email inputs
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [defaultValues, setDefaultValues] = useState({});
  // Status messages
  const [statusMessage, setStatusMessage] = useState(null);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseId, setCourseId] = useState("");

  // Fetch stats
  const fetchStats = async () => {
    setLoadingStats(true);
    setStatusMessage(null);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (courseId) params.courseId = courseId;

      const res = await axios.get(
        "http://localhost:5000/api/scheduling/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setStats(res.data?.data || null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStatusMessage({ type: "error", text: "Failed to fetch scheduling stats." });
    } finally {
      setLoadingStats(false);
    }
  };

  // Process Pending
  const handleProcessPending = async () => {
    setLoadingPending(true);
    setStatusMessage(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/scheduling/admin/process-pending",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage({ type: "success", text: res.data.message || "Processed successfully!" });
      fetchStats();
    } catch (err) {
      console.error("Error processing pending schedules", err);
      setStatusMessage({ type: "error", text: "Failed to process pending schedules." });
    } finally {
      setLoadingPending(false);
    }
  };

  // Retry Failed
  const handleRetryFailed = async () => {
    setLoadingRetry(true);
    setStatusMessage(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/scheduling/admin/retry-failed",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage({ type: "success", text: res.data.message || "Retried failed schedules!" });
      fetchStats();
    } catch (err) {
      console.error("Error retrying failed schedules", err);
      setStatusMessage({ type: "error", text: "Failed to retry failed schedules." });
    } finally {
      setLoadingRetry(false);
    }
  };

  // Test Email Service
  const handleTestEmailService = async () => {
    setResponseMsg("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/scheduling/admin/test-email",
        { email, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponseMsg(res.data.message || "Email test sent!");
    } catch (err) {
      console.error("Error testing email service", err);
      setResponseMsg(err.response?.data?.message || "Failed to send test email.");
    }
  };

  const handleDefaults = async () => {
    setLoadingStats(true);
    try {
      const res = await axios.post("http://localhost:5000/api/scheduling/admin/seed/defaults",
        {},
        {headers:{Authorization:`Bearer ${token}`}}
      );
      setDefaultValues(res.data.data ||{});
    } catch(err) {
      console.error("Error seeding defaults", err);
      setDefaultValues({});
    } finally {
      setLoadingStats(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  // Overview Cards
  const renderOverview = () => {
    if (!stats?.overview?.length) return <p>No overview data</p>;
    const o = stats.overview[0];
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={o.totalSchedules} />
        <StatCard label="Pending" value={o.pendingSchedules} color="text-blue-500" />
        <StatCard label="Sent" value={o.sentSchedules} color="text-green-500" />
        <StatCard label="Failed" value={o.failedSchedules} color="text-red-500" />
      </div>
    );
  };

  // Reusable Table
  const renderTable = (title, data, columns) => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {data?.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((c) => (
                <th key={c.key} className="border p-2 text-left">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key} className="border p-2">
                    {row[c.key] ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No data available.</p>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Stats</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Course ID (optional)" value={courseId} onChange={(e) => setCourseId(e.target.value)} className="border p-2 rounded" />
        <button onClick={fetchStats} className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button onClick={handleProcessPending} disabled={loadingPending} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {loadingPending ? "Processing..." : "Process Pending"}
        </button>
        <button onClick={handleRetryFailed} disabled={loadingRetry} className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {loadingRetry ? "Retrying..." : "Retry Failed"}
        </button>
      </div>

      {/* Test Email Section */}
      <div className="mb-6 p-4 border rounded bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Test Email Service</h3>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Recipient Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded"
            rows="3"
          />
          <button
            onClick={handleTestEmailService}
            className="bg-purple-600 text-white px-3 py-2 rounded"
          >
            Send Test Email
          </button>
          {responseMsg && (
            <p className="text-sm mt-2 text-gray-700">{responseMsg}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      {statusMessage && (
        <p className={`mb-4 ${statusMessage.type === "error" ? "text-red-500" : "text-green-600"}`}>
          {statusMessage.text}
        </p>
      )}

      {/* Main Content */}
      {loadingStats ? (
        <p>Loading stats...</p>
      ) : stats ? (
        <>
          {renderOverview()}
          {renderTable("By Status", stats.byStatus, [
            { key: "_id", label: "Status" },
            { key: "count", label: "Count" },
          ])}
          {renderTable("By Student Level", stats.byLevel, [
            { key: "_id", label: "Level" },
            { key: "count", label: "Count" },
            { key: "averageInterval", label: "Avg Interval (h)" },
          ])}
          {renderTable("By Message Type", stats.byMessageType, [
            { key: "_id", label: "Message Type" },
            { key: "count", label: "Count" },
          ])}
        </>
      ) : (
        <p>No stats found.</p>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color = "" }) => (
  <div className="p-4 border rounded text-center bg-white shadow-sm">
    <p className={`text-xl font-bold ${color}`}>{value}</p>
    <p className="text-gray-500">{label}</p>
  </div>
);

export default AdminStats;
