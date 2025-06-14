import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "MALE",
    role: "ADMIN_WEB",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        formData
      );
      alert(response.data); // Hiển thị thông báo thành công
    } catch (err) {
      if (err.response && err.response.status === 400) {
        if (typeof err.response.data === "object") {
          const translatedErrors = {};
          for (const [key, value] of Object.entries(err.response.data)) {
            translatedErrors[key] = translateError(value);
          }
          setErrors(translatedErrors); // Lưu lỗi đã dịch
        } else {
          setErrors({ general: translateError(err.response.data) }); // Lỗi chung
        }
      }
    }
  };

  // Hàm dịch lỗi sang tiếng Việt
  const translateError = (errorMessage) => {
    switch (errorMessage.toLowerCase()) {
      case "username must be unique":
        return "Tên đăng nhập đã tồn tại.";
      case "email must be a valid email":
        return "Email không hợp lệ.";
      case "password must be at least 6 characters":
        return "Mật khẩu phải có ít nhất 6 ký tự.";
      case "phone number must be a valid phone number":
        return "Số điện thoại không hợp lệ.";
      default:
        return "Tài khoản, email hoặc số điện thoại đã được sử dụng.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF3E0] to-[#E0F7FA]">
      <div className="max-w-3xl w-full mx-auto px-6 py-6 bg-white rounded-2xl shadow-lg animate-scale-up">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
          Đăng ký
        </h2>
        <p className="text-sm text-[#333333] text-opacity-70 text-center">
          Tạo tài khoản mới để bắt đầu quản lý kiểm soát vé sự kiện.
        </p>

        {/* Thông báo lỗi chung */}
        <div className="h-6 mb-4 text-center text-sm">
          {errors.general && (
            <div className="p-2 bg-red-100 text-red-700 rounded-lg inline-block">
              {errors.general}
            </div>
          )}
        </div>

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cột 1 */}
            <div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Nhập tên đăng nhập"
                />
                <div className="h-6">
                  {errors.username && (
                    <div className="text-red-700 text-xs mt-1">
                      {errors.username}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Nhập mật khẩu"
                />
                <div className="h-6">
                  {errors.password && (
                    <div className="text-red-700 text-xs mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Họ tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Nhập họ tên"
                />
                <div className="h-6">
                  {errors.fullName && (
                    <div className="text-red-700 text-xs mt-1">
                      {errors.fullName}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Nhập số điện thoại"
                />
                <div className="h-6">
                  {errors.phoneNumber && (
                    <div className="text-red-700 text-xs mt-1">
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cột 2 */}
            <div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Nhập email"
                />
                <div className="h-6">
                  {errors.email && (
                    <div className="text-red-700 text-xs mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Giới tính
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
                <div className="h-6">
                  {errors.gender && (
                    <div className="text-red-700 text-xs mt-1">
                      {errors.gender}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-[#333333] mb-1"
                >
                  Vai trò
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="ADMIN_WEB">Admin Web</option>
                  <option value="ADMIN_MOBILE">Admin Mobile</option>
                </select>
                <div className="h-6">
                  {errors.role && (
                    <div className="text-red-700 text-xs mt-1">
                      {errors.role}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-6 py-2.5 bg-[#FF6F61] text-white font-semibold rounded-full hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-300 text-sm"
          >
            Đăng ký
          </button>
        </form>

        {/* Link Quay lại đăng nhập */}
        <p className="mt-6 text-center text-sm text-[#333333] text-opacity-70">
          Bạn đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-[#333333] font-medium hover:underline hover:text-[#FF6F61]"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
