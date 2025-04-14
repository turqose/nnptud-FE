import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";

AccountDetails.propTypes = {
  user: PropTypes.shape({
    full_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    displayName: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
};
export default function AccountDetails({ user, onSubmit, onPasswordChange }) {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone || "",
    displayName: user.displayName || "",
    avatar: user.avatar || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState({ account: false, password: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (fields) => {
    const newErrors = {};

    if (fields.includes("full_name") && !formData.full_name) {
      newErrors.full_name = "Full name is required";
    }
    if (fields.includes("email")) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    }

    if (fields.includes("password")) {
      if (!formData.oldPassword) {
        newErrors.oldPassword = "Current password is required";
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(["full_name", "email"])) {
      setLoading((prev) => ({ ...prev, account: true }));
      await onSubmit(formData);
      setLoading((prev) => ({ ...prev, account: false }));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (validateForm(["password"])) {
      setLoading((prev) => ({ ...prev, password: true }));
      await onPasswordChange(formData);
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <div className=" lg:col-span-9 lg:mt-0">
      {/* Account Details Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold">Account Details</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${errors.full_name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.full_name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                ${errors.displayName ? "border-red-500" : "border-gray-300"}`}
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be how your name will be displayed in the account
                section and in reviews
              </p>
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.displayName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                disabled
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border bg-slate-200 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg mt-5 bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900"
            disabled={loading.account}
          >
            {loading.account ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      {/* Password Change Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <form onSubmit={handleChangePassword}>
          <h2 className="text-lg font-semibold">Password</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.oldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${errors.oldPassword ? "border-red-500" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("oldPassword")}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600"
                >
                  {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("newPassword")}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600"
                >
                  {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Repeat New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("confirmPassword")}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600"
                >
                  {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg mt-5 bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900"
            disabled={loading.password}
          >
            {loading.password ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
