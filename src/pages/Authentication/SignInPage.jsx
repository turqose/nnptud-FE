import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import GlobalLoading from "../../components/GlobalLoading/GlobalLoading";
import { userLogin } from "../../features/user/userSlice";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        password: savedPassword,
        rememberMe: true,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(userLogin(formData)).unwrap();
        if (formData.rememberMe) {
          localStorage.setItem("email", formData.email);
          localStorage.setItem("password", formData.password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        navigate("/");
        toast.success("Logged in successfully");
      } catch (error) {
        console.error("Sign in error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {loading && <GlobalLoading />}

      {/* Left Side - Image */}
      <div className="hidden md:block relative bg-gray-50">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t2Y6hJ1oTOz4zsKWDxUs78AY5ceTbz.png"
          alt="Elegant armchair with throw blanket"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side - Form */}
      <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center">
        <div className="max-w-[400px] mx-auto w-full h-full">
          <div className="mb-8 md:hidden">
            <Link to="/" className="text-2xl font-semibold">
              3legant.
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md h-full flex flex-col   justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Sign In</h1>
              <p className="mt-2 text-gray-600">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="text-green-600 hover:text-green-700"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Forgot password?
                </Link>
              </div>
              {error && (
                <div className="text-red-500 text-center">{error.message}</div>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
