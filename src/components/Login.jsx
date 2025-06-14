/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // State cho quên mật khẩu
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Kiểm soát hiển thị form quên mật khẩu
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    emailOrUsername: "",
    otp: "",
    newPassword: "",
  });
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });

      console.log("Token nhận được:", response.data);
      if (typeof response.data === "object" && response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        localStorage.setItem("token", response.data);
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      console.log(err);
    }
  };

  const handleForgotPasswordStep1 = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/forgot-password", {
        emailOrUsername: forgotPasswordData.emailOrUsername,
      });
      setForgotPasswordMessage(response.data);
      setForgotPasswordError("");
      setForgotPasswordStep(2);
    } catch (err) {
      setForgotPasswordError(err.response?.data || "Gửi OTP thất bại");
      setForgotPasswordMessage("");
    }
  };

  const handleForgotPasswordStep2 = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/verify-otp", {
        emailOrUsername: forgotPasswordData.emailOrUsername,
        otp: forgotPasswordData.otp,
      });
      setForgotPasswordMessage(response.data);
      setForgotPasswordError("");
      setForgotPasswordStep(3);
    } catch (err) {
      setForgotPasswordError(err.response?.data || "Xác minh OTP thất bại");
      setForgotPasswordMessage("");
    }
  };

  const handleForgotPasswordStep3 = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/reset-password", {
        emailOrUsername: forgotPasswordData.emailOrUsername,
        newPassword: forgotPasswordData.newPassword,
      });
      setForgotPasswordMessage(response.data);
      setForgotPasswordError("");
      setTimeout(() => {
        setIsForgotPassword(false); // Quay lại form đăng nhập
        setForgotPasswordStep(1);
        setForgotPasswordData({
          emailOrUsername: "",
          otp: "",
          newPassword: "",
        });
        setForgotPasswordMessage("");
        setForgotPasswordError("");
      }, 2000);
    } catch (err) {
      setForgotPasswordError(err.response?.data || "Đặt lại mật khẩu thất bại");
      setForgotPasswordMessage("");
    }
  };

  const resetForgotPassword = () => {
    setForgotPasswordStep(1);
    setForgotPasswordData({ emailOrUsername: "", otp: "", newPassword: "" });
    setForgotPasswordMessage("");
    setForgotPasswordError("");
    setIsForgotPassword(false); // Quay lại form đăng nhập
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF3E0] to-[#E0F7FA]">
      <div className="max-w-md w-full mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg animate-scale-up">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
          {isForgotPassword ? "Quên mật khẩu" : "Đăng nhập"}
        </h2>
        <p className="text-sm text-[#333333] text-opacity-70 mb-6 text-center">
          {isForgotPassword
            ? "Nhập thông tin để đặt lại mật khẩu của bạn."
            : "Chào mừng trở lại! Đăng nhập để bắt đầu quản lý kiểm soát vé sự kiện."}
        </p>

        {/* Thông báo lỗi */}
        {error && !isForgotPassword && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        {forgotPasswordMessage && isForgotPassword && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {forgotPasswordMessage}
          </div>
        )}
        {forgotPasswordError && isForgotPassword && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {forgotPasswordError}
          </div>
        )}

        {/* Form */}
        {!isForgotPassword ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#333333] mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#333333] mb-1"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#333333] hover:text-[#FF6F61] cursor-pointer"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="h-5 w-5" />
                  ) : (
                    <IoEyeOutline className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right mb-6">
              <button
                type="button"
                className="text-sm hover:underline text-[#333333] hover:text-[#FF6F61] font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsForgotPassword(true)}
              >
                Quên mật khẩu
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#FF6F61] text-white font-semibold cursor-pointer rounded-full hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-300"
            >
              Đăng nhập
            </button>
          </form>
        ) : (
          <>
            {forgotPasswordStep === 1 && (
              <form onSubmit={handleForgotPasswordStep1}>
                <div className="mb-4">
                  <label
                    htmlFor="emailOrUsername"
                    className="block text-sm font-medium text-[#333333] mb-1"
                  >
                    Email hoặc Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="emailOrUsername"
                    value={forgotPasswordData.emailOrUsername}
                    onChange={(e) =>
                      setForgotPasswordData({
                        ...forgotPasswordData,
                        emailOrUsername: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent"
                    placeholder="Nhập email hoặc tên đăng nhập"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#FF6F61] text-white rounded-full hover:bg-[#40C4FF] cursor-pointer"
                >
                  Gửi OTP
                </button>
              </form>
            )}

            {forgotPasswordStep === 2 && (
              <form onSubmit={handleForgotPasswordStep2}>
                <div className="mb-4">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-[#333333] mb-1"
                  >
                    Mã OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={forgotPasswordData.otp}
                    onChange={(e) =>
                      setForgotPasswordData({
                        ...forgotPasswordData,
                        otp: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent"
                    placeholder="Nhập mã OTP"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#FF6F61] text-white rounded-full hover:bg-[#40C4FF]"
                >
                  Xác minh OTP
                </button>
              </form>
            )}

            {forgotPasswordStep === 3 && (
              <form onSubmit={handleForgotPasswordStep3}>
                <div className="mb-4">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-[#333333] mb-1"
                  >
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={forgotPasswordData.newPassword}
                      onChange={(e) =>
                        setForgotPasswordData({
                          ...forgotPasswordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF]"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#333333] hover:text-[#FF6F61] cursor-pointer"
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="h-5 w-5" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#FF6F61] text-white rounded-full hover:bg-[#40C4FF]"
                >
                  Đặt lại mật khẩu
                </button>
              </form>
            )}

            <div className="text-center mt-4">
              <button
                type="button"
                className="text-sm text-[#333333] hover:text-[#FF6F61] hover:underline font-medium transition-colors duration-200 cursor-pointer"
                onClick={resetForgotPassword}
              >
                Quay lại đăng nhập
              </button>
            </div>
          </>
        )}

        {/* Link Đăng ký */}
        {!isForgotPassword && (
          <p className="mt-6 text-center text-sm text-[#333333] text-opacity-70">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-[#333333] font-medium hover:underline hover:text-[#FF6F61]"
            >
              Đăng ký
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
