import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const RequestOtp = () => {
  const { requestOtp } = useContext(AppContext);

  const [mode, setMode] = useState("login"); 
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("student");
  const [deliveryMethod, setDeliveryMethod] = useState("email");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please provide a valid email";
      }
    }

    // Register-only validations
    if (mode === "register") {
      if (!firstName || firstName.length < 2 || firstName.length > 50) {
        newErrors.firstName = "First name must be between 2 and 50 characters";
      }
      if (!lastName || lastName.length < 2 || lastName.length > 50) {
        newErrors.lastName = "Last name must be between 2 and 50 characters";
      }
      if (!["student", "teacher", "admin"].includes(role)) {
        newErrors.role = "Role must be student, teacher, or admin";
      }
    }

    // Delivery Method
    if (!["email", "whatsapp"].includes(deliveryMethod)) {
      newErrors.deliveryMethod = "Delivery method must be email or whatsapp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setErrors((prev) => ({ ...prev, api: undefined }));

    const payload = { //req body
      mode,                 // IMPORTANT: tell backend whether it's login/register
      email,
      deliveryMethod,
      firstName: mode === "register" ? firstName : undefined,
      lastName: mode === "register" ? lastName : undefined,
      role: mode === "register" ? role : undefined,
    };

    try {
      await requestOtp(payload); // your AppContext function
      // success → go to verify page
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      const status = err?.response?.status;
      let message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      // Robust, status-based messages
      if (mode === "login" && status === 404) {
        message = "This email is not registered. Please register first.";
      }
      if (mode === "register" && status === 409) {
        message = "This email is already registered. Please login instead.";
      }

      setErrors({ api: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">
        {mode === "login" ? "Login with OTP" : "Register with OTP"}
      </h2>

      {/* Switch mode */}
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className={`px-3 py-1 rounded ${
            mode === "login" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("login")}
        >
          Already User (Login)
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded ${
            mode === "register" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("register")}
        >
          New User (Register)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Extra fields for Register */}
        {mode === "register" && (
          <>
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>

            <div>
              <select
                className="w-full p-2 border rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>
          </>
        )}

        {/* Delivery Method */}
        <div>
          <p className="mb-1 text-gray-700 font-medium">Delivery Method:</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="email"
                checked={deliveryMethod === "email"}
                onChange={() => setDeliveryMethod("email")}
              />
              Email
            </label>
            <label className="flex items-center gap-2">
              <input
                  type="radio"
                 value="whatsapp"
                checked={deliveryMethod === "whatsapp"}
                onChange={() => setDeliveryMethod("whatsapp")}
              />
              WhatsApp
            </label>
          </div>
          {errors.deliveryMethod && (
            <p className="text-red-500 text-sm">{errors.deliveryMethod}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Request OTP"}
        </button>
      </form>

      {errors.api && <p className="mt-4 text-red-500">{errors.api}</p>}
    </div>
  );
};

export default RequestOtp;
