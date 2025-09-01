import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const AdminUsers = () => {
  const { token } = useContext(AppContext);

  // Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Teachers state
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [teachersError, setTeachersError] = useState(null);

  // Reset Password state
  const [resetUserId, setResetUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");


// Teachers table: pagination + sorting
const [teacherPage, setTeacherPage] = useState(1);
const [teachersPerPage] = useState(5);
const [teacherSortConfig, setTeacherSortConfig] = useState({
  key: "fullName",
  direction: "asc",
});

const handleTeacherSort = (key) => {
  setTeacherSortConfig((prev) => ({
    key,
    direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
  }));
};

const sortedTeachers = [...teachers].sort((a, b) => {
  if (!teacherSortConfig.key) return 0;
  const aVal = a[teacherSortConfig.key] ?? "";
  const bVal = b[teacherSortConfig.key] ?? "";

  if (aVal < bVal) return teacherSortConfig.direction === "asc" ? -1 : 1;
  if (aVal > bVal) return teacherSortConfig.direction === "asc" ? 1 : -1;
  return 0;
});

const paginatedTeachers = sortedTeachers.slice(
  (teacherPage - 1) * teachersPerPage,
  teacherPage * teachersPerPage
);

const totalTeacherPages = Math.ceil(teachers.length / teachersPerPage) || 1;


  // New User form
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
  });

  // Pagination, filters, sorting
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // --- Existing handlers (unchanged) ---
  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/admin/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User created successfully!");
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "student",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${editingUser._id}`,
        editingUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleEditClick = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(res.data.data.user);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch user details.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedStatus =
        res.data.data.isActive === true || res.data.data.isActive === "true";

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: updatedStatus } : u))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleResetPasswordClick = (userId) => {
    setResetUserId(userId);
    setNewPassword("");
  };

  const handleResetPassword = async () => {
    if (!newPassword) return alert("Enter a new password");
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${resetUserId}/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password reset successfully!");
      setResetUserId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  // --- Fetch users ---
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, sortBy, sortOrder };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.isActive = statusFilter === "true";
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setUsers(Array.isArray(res.data?.data?.users) ? res.data.data.users : []);
      setTotalPages(res.data?.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch teachers ---
  const fetchTeachers = async () => {
    setTeachersLoading(true);
    setTeachersError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeachers(Array.isArray(res.data?.data?.teachers) ? res.data.data.teachers : []);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setTeachersError("Failed to fetch teachers.");
      setTeachers([]);
    } finally {
      setTeachersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTeachers(); // call teachers API as well
  }, [page, roleFilter, statusFilter, searchTerm, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePromoteToTeacher = async (userId) => {
  if (!window.confirm("Are you sure you want to promote this user to Teacher?")) return;

  try {
    await axios.patch(
      `http://localhost:5000/api/admin/users/${userId}/promote-teacher`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("User promoted to Teacher successfully!");
    fetchUsers();
    fetchTeachers();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to promote user.");
  }
};


  // --- Render ---
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Users</h2>

      {/* CREATE / EDIT FORM */}
      <div className="p-4 border rounded mb-6">
        <h3 className="text-xl font-semibold mb-2">
          {editingUser ? "Edit User" : "Create New User"}
        </h3>
        <form
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          className="flex flex-col gap-2 max-w-md"
        >
          {/* First Name */}
          <input
            type="text"
            name="firstName"
            value={editingUser ? editingUser.firstName : newUser.firstName}
            onChange={(e) => {
              const value = e.target.value;
              if (editingUser) setEditingUser({ ...editingUser, firstName: value });
              else setNewUser({ ...newUser, firstName: value });
            }}
            placeholder="First Name"
            className="border p-2 rounded"
            required
          />
          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            value={editingUser ? editingUser.lastName : newUser.lastName}
            onChange={(e) => {
              const value = e.target.value;
              if (editingUser) setEditingUser({ ...editingUser, lastName: value });
              else setNewUser({ ...newUser, lastName: value });
            }}
            placeholder="Last Name"
            className="border p-2 rounded"
            required
          />
          {/* Email */}
          <input
            type="email"
            name="email"
            value={editingUser ? editingUser.email : newUser.email}
            onChange={(e) => {
              const value = e.target.value;
              if (editingUser) setEditingUser({ ...editingUser, email: value });
              else setNewUser({ ...newUser, email: value });
            }}
            placeholder="Email"
            className="border p-2 rounded"
            required
          />
          {/* Password (new user only) */}
          {!editingUser && (
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleNewUserChange}
              placeholder="Password"
              className="border p-2 rounded"
              required
              autoComplete="new-password"
            />
          )}
          {/* Role */}
          <select
            name="role"
            value={editingUser ? editingUser.role : newUser.role}
            onChange={(e) => {
              const value = e.target.value;
              if (editingUser) setEditingUser({ ...editingUser, role: value });
              else setNewUser({ ...newUser, role: value });
            }}
            className="border p-2 rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          {/* Buttons */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            disabled={loading}
          >
            {loading
              ? editingUser
                ? "Updating..."
                : "Creating..."
              : editingUser
              ? "Update User"
              : "Create User"}
          </button>
          {editingUser && (
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => setEditingUser(null)}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 flex-1 min-w-[200px]"
        />
      </div>

      {/* USERS TABLE */}
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 cursor-pointer">
              <th className="border p-2" onClick={() => handleSort("firstName")}>
                Name {sortBy === "firstName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="border p-2" onClick={() => handleSort("email")}>
                Email {sortBy === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="border p-2" onClick={() => handleSort("role")}>
                Role {sortBy === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="border p-2" onClick={() => handleSort("isActive")}>
                Status {sortBy === "isActive" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="border p-2" onClick={() => handleSort("lastLogin")}>
                Last Login {sortBy === "lastLogin" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id || user.id}>
                  <td className="border p-2">{user.fullName || `${user.firstName} ${user.lastName}`}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">{user.isActive ? "Active" : "Inactive"}</td>
                  <td className="border p-2">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                  </td>
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(user._id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className={`px-2 py-1 rounded text-white ${
                          user.isActive ? "bg-green-500" : "bg-gray-500"
                        }`}
                      >
                        {user.isActive ? "Activate" : "Deactivate"}
                      </button>
                      <button
                        onClick={() => handleResetPasswordClick(user._id)}
                        className="bg-purple-500 text-white px-2 py-1 rounded"
                      >
                        Reset Password
                      </button>
                      {user.role === "student" && (
  <button
    onClick={() => handlePromoteToTeacher(user._id)}
    className="bg-indigo-500 text-white px-2 py-1 rounded"
  >
    Promote
  </button>
)}

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No users found.
                </td>
              </tr>  
            )}
          </tbody>
        </table>
      )}
            
            
      {/* PAGINATION */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* RESET PASSWORD MODAL */}
      {resetUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              autoComplete="new-password"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setResetUserId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="bg-purple-500 text-white px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
     {/* TEACHERS TABLE */}
<h2 className="text-2xl font-bold mt-10 mb-4">Teachers</h2>
{teachersLoading ? (
  <p>Loading teachers...</p>
) : teachersError ? (
  <p className="text-red-500">{teachersError}</p>
) : (
  <>
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th
            className="border p-2 cursor-pointer"
            onClick={() => handleTeacherSort("fullName")}
          >
            Name
          </th>
          <th
            className="border p-2 cursor-pointer"
            onClick={() => handleTeacherSort("email")}
          >
            Email
          </th>
          <th
            className="border p-2 cursor-pointer"
            onClick={() => handleTeacherSort("totalCourses")}
          >
            Courses
          </th>
          <th
            className="border p-2 cursor-pointer"
            onClick={() => handleTeacherSort("publishedCourses")}
          >
            Published
          </th>
          <th
            className="border p-2 cursor-pointer"
            onClick={() => handleTeacherSort("totalEnrollments")}
          >
            Enrollments
          </th>
          <th className="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
  {paginatedTeachers.length > 0 ? (
    paginatedTeachers.map((t) => (
      <tr key={t._id}>
        <td className="border p-2">
          {t.fullName || `${t.firstName} ${t.lastName}`}
        </td>
        <td className="border p-2">{t.email}</td>
        <td className="border p-2">{t.totalCourses}</td>
        <td className="border p-2">{t.publishedCourses}</td>
        <td className="border p-2">{t.totalEnrollments}</td>
        <td className="border p-2">{t.isActive ? "Active" : "Inactive"}</td>
        <td className="border p-2">
          <button
            onClick={() => (window.location.href = `/admin/teachers/${t._id}`)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            View
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center p-4">
        No teachers found.
      </td>
    </tr>
  )}
</tbody>

    </table>

    {/* TEACHER PAGINATION */}
    <div className="flex justify-between items-center mt-4">
      <button
        disabled={teacherPage === 1}
        onClick={() => setTeacherPage((p) => p - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {teacherPage} of {totalTeacherPages}
      </span>
      <button
        disabled={teacherPage === totalTeacherPages}
        onClick={() => setTeacherPage((p) => p + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </>
)}

    </div>
  );
};

export default AdminUsers;
