import { Button, Input } from "@headlessui/react";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import GlobalLoading from "../../components/GlobalLoading/GlobalLoading";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
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
        <div className="max-w-[400px] mx-auto w-full h-full flex flex-col items-center">
          <div className="mb-8 md:hidden">
            <Link to="/" className="text-2xl font-semibold">
              3legant.
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md h-full flex flex-col   justify-center space-y-3">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Forgot Password</h2>
              <p className="text-gray-500">
                Enter your email and we'll send you a link to reset your
                password.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
                >
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-green-600">
                  If an account exists for {email}, you will receive a password
                  reset link shortly.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
                >
                  Back to Forgot Password
                </Button>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/signin"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
