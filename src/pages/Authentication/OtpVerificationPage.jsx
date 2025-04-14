import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import GlobalLoading from "../../components/GlobalLoading/GlobalLoading";
import { userVerifyOtp } from "../../features/user/userSlice";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispath = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (pastedData.length !== 6 || isNaN(Number(pastedData))) return;

    const otpArray = pastedData.split("").slice(0, 6);
    setOtp(otpArray);
    inputRefs.current[5]?.focus();
  };

  const handleResend = () => {
    setTimer(60);
    // Add your resend OTP logic here
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    try {
      if (otpCode == "") {
        toast.error("Please enter the OTP code");
        return;
      }
      await dispath(
        userVerifyOtp({
          otp: otpCode,
          email: localStorage.getItem("emailForSignIn"),
        })
      ).unwrap();
      toast.success("OTP verified successfully");
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {loading && <GlobalLoading />}

      {/* Left side - Image */}
      <div className="hidden md:block relative bg-gray-50">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t2Y6hJ1oTOz4zsKWDxUs78AY5ceTbz.png"
          alt="Elegant armchair with throw blanket"
          className="object-cover"
        />
      </div>

      {/* Right side - OTP Form */}
      <div className="p-8 md:p-12 lg:p-16 flex flex-col">
        <div className="max-w-[400px] mx-auto w-full">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-2xl font-semibold">3legant.</h1>
          </div>

          {/* Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Enter OTP</h2>
              <p className="text-gray-500">
                We sent a verification code to your email. Please enter the
                code.
              </p>
            </div>

            <div className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center border rounded-lg text-lg font-semibold 
                               focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none
                               transition-all"
                  />
                ))}
              </div>

              {/* Timer and Resend */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-gray-500">
                    Resend code in{" "}
                    <span className="font-semibold">{timer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Resend Code
                  </button>
                )}
              </div>
              {error && (
                <div className="text-red-500 text-center">{error.message}</div>
              )}
              {/* Verify Button */}
              <button
                className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
                disabled={otp.some((digit) => !digit)}
                onClick={handleVerify}
              >
                Verify
              </button>

              <p className="text-center text-gray-500">
                Didn't receive the email?{" "}
                <Link href="#" className="text-gray-900 hover:underline">
                  Click to resend
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
