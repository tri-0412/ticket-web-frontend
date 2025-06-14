import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { FiUser, FiUserCheck, FiPhone, FiMail, FiUsers } from "react-icons/fi";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GrFormClose } from "react-icons/gr";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoShieldCheckmarkOutline, IoTicket } from "react-icons/io5";
import { MdEventAvailable } from "react-icons/md";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import { MdOutlineWorkHistory } from "react-icons/md";
import { CgMenuRound } from "react-icons/cg";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [stats, setStats] = useState({ tickets: 0, customers: 0, events: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data);
      setProfileError("");
    } catch (err) {
      setProfileError(err.response?.data || "Không thể tải thông tin cá nhân");
      setUserProfile(null);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const response = { data: { tickets: 5, customers: 20, events: 3 } };
      setStats(response.data);
    } catch (err) {
      console.error("Không thể lấy quick stats:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchQuickStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setOldPasswordError("");
    setNewPasswordError("");
    setSuccessMessage("");

    if (changePasswordData.newPassword.length < 8) {
      setNewPasswordError("Mật khẩu mới phải dài ít nhất 8 ký tự.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/auth/change-password",
        changePasswordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Đổi mật khẩu thành công!");
      setChangePasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      const errorMessage = err.response?.data || "Không thể đổi mật khẩu";
      if (errorMessage.includes("Old password is incorrect")) {
        setOldPasswordError("Mật khẩu cũ không đúng.");
      } else if (
        errorMessage.includes("New password must be at least 8 characters long")
      ) {
        setNewPasswordError("Mật khẩu mới phải dài ít nhất 8 ký tự.");
      } else {
        setOldPasswordError(errorMessage);
      }
    }
  };

  const resetChangePasswordForm = () => {
    setChangePasswordData({ oldPassword: "", newPassword: "" });
    setOldPasswordError("");
    setNewPasswordError("");
    setSuccessMessage("");
    setShowChangePasswordModal(false);
  };

  const resetProfileModal = () => {
    setUserProfile(null);
    setProfileError("");
    setShowProfileModal(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF3E0] to-[#E0F7FA]">
      <div
        className={`fixed top-0 h-screen w-60 bg-gradient-to-b from-[#FFF3E0] to-[#E0F7FA] shadow-lg z-40 overflow-y-auto transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="p-4">
            <div className="flex justify-center items-center flex-col">
              <Link style={{ cursor: "default" }} to="/dashboard">
                <h1
                  className="text-3xl font-bold tracking-wider transition-all duration-300"
                  style={{
                    color: "#FF6F61",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    WebkitTextStroke: "1px black",
                  }}
                >
                  SnapCheck
                </h1>
              </Link>
              <p
                className="text-base font-medium transition-all duration-300 mb-5"
                style={{
                  color: "#333333",
                  textShadow: "0.5px 0.5px 1px rgba(0, 0, 0, 0.1)",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                Búng tay, check ngay!
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              {
                path: "/dashboard/tickets",
                label: "Ticket",
                icon: <IoTicket />,
              },
              {
                path: "/dashboard/customers",
                label: "Customer",
                icon: <FiUsers />,
              },
              {
                path: "/dashboard/events",
                label: "Event",
                icon: <MdEventAvailable />,
              },
              {
                path: "/dashboard/checkinLog",
                label: "Checkin History",
                icon: <MdOutlineWorkHistory />,
              },
              {
                path: "/dashboard/AssignPermission",
                label: "Assign Permission",
                icon: <IoShieldCheckmarkOutline />,
              },
              { path: "/dashboard/users", label: "User", icon: <FiUser /> },
              {
                path: "/dashboard/download",
                label: "Download",
                icon: <MdOutlineFileDownload />,
              },
            ].map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 transform ${
                  location.pathname === tab.path
                    ? "bg-[#FF6F61] text-white shadow-md"
                    : "text-[#333333] bg-transparent hover:bg-[#40C4FF] hover:text-white"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 pb-3 ${
          isSidebarOpen ? "ml-60 w-[calc(100%-16rem)]" : "ml-0 w-full"
        }`}
      >
        <div
          className={`z-30 flex justify-between items-center mb-2 pt-6 ${
            isSidebarOpen ? "max-w-6xl mx-auto pl-4 " : "px-4"
          }`}
        >
          <div className="flex items-center space-x-3">
            <button className="cursor-pointer" onClick={toggleSidebar}>
              {isSidebarOpen ? (
                <AiOutlineMenuFold className="w-8 h-8 text-[#FF6F61]" />
              ) : (
                <AiOutlineMenuUnfold className="w-8 h-8 text-[#FF6F61]" />
              )}
            </button>
            <Link to="/dashboard">
              <h1
                className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F61] to-[#40C4FF] animate-scale-up relative"
                style={{
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                  cursor: "default",
                }}
              >
                Dashboard
              </h1>
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 transition-all duration-200 cursor-pointer"
            >
              <CgMenuRound className="w-8 h-8 text-gray-500" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-100">
                <button
                  className="block cursor-pointer w-full text-left px-4 py-2 rounded-lg text-[#333333] hover:bg-[#40C4FF] hover:text-white"
                  onClick={() => {
                    fetchUserProfile();
                    setShowProfileModal(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="block cursor-pointer rounded-lg w-full text-left px-4 py-2 text-[#333333] hover:bg-[#40C4FF] hover:text-white"
                  onClick={() => {
                    setShowChangePasswordModal(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  Đổi mật khẩu
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="block cursor-pointer rounded-lg w-full text-left px-4 py-2 text-red-600 hover:bg-[#40C4FF] hover:text-white"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`bg-white rounded-2xl shadow-lg pt-1 pb-3 mb-2 px-3 ${
            isSidebarOpen ? "max-w-6xl mx-auto mt-6 ml-2" : "mx-4 mt-6"
          }`}
        >
          <Outlet context={{ userProfile, stats }} />
        </div>

        {showChangePasswordModal && (
          <div
            className="fixed inset-0 z-50 flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-4">
              <div className="flex items-center justify-between border-b border-gray-200 mb-4">
                <h5 className="text-lg font-semibold text-[#333333]">
                  Đổi mật khẩu
                </h5>
                <button
                  onClick={resetChangePasswordForm}
                  className="text-[#333333] cursor-pointer hover:text-[#FF6F61] text-xl font-bold focus:outline-none"
                >
                  <GrFormClose className="w-8 h-8" />
                </button>
              </div>
              <div className="space-y-4">
                <form onSubmit={handleChangePassword}>
                  <div className="mb-4">
                    <label
                      htmlFor="oldPassword"
                      className="block text-sm font-medium text-[#333333] mb-2"
                    >
                      Mật khẩu cũ
                    </label>
                    <input
                      type="password"
                      id="oldPassword"
                      value={changePasswordData.oldPassword}
                      onChange={(e) =>
                        setChangePasswordData({
                          ...changePasswordData,
                          oldPassword: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200"
                      placeholder="Nhập mật khẩu cũ"
                    />
                    <div className="h-3 mt-2">
                      {oldPasswordError && (
                        <div className="text-red-700 text-sm">
                          {oldPasswordError}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-[#333333] mb-2"
                    >
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={changePasswordData.newPassword}
                      onChange={(e) =>
                        setChangePasswordData({
                          ...changePasswordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <div className="h-5 mt-2">
                      {newPasswordError && (
                        <div className="text-red-700 text-sm">
                          {newPasswordError}
                        </div>
                      )}
                      {successMessage && (
                        <div className="bg-green-100 text-green-800 rounded-md text-sm text-center">
                          {successMessage}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-[#FF6F61] text-white font-medium rounded-md hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showProfileModal && (
          <div
            className="fixed inset-0 z-50 flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-6 pb-10">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={resetProfileModal}
                  className="text-[#333333] hover:text-[#FF6F61] cursor-pointer focus:outline-none"
                >
                  <GrFormClose className="w-8 h-8" />
                </button>
                <h5 className="text-xl font-semibold text-[#333333]">
                  Hồ sơ người dùng
                </h5>
                <div className="w-6 h-6"></div>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-[#40C4FF] flex items-center justify-center">
                    <FiUser className="w-10 h-10 text-[#FF6F61]" />
                  </div>
                </div>
                <div className="space-y-3 text-sm text-[#333333]">
                  {profileError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm text-center">
                      {profileError}
                    </div>
                  )}
                  {userProfile ? (
                    <>
                      <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                        <FiUser className="w-5 h-5 text-[#FF6F61]" />
                        <p>
                          <strong className="font-medium">
                            Tên đăng nhập:
                          </strong>{" "}
                          {userProfile.username}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 py-3 border-b border-gray-200">
                        <FiUserCheck className="w-5 h-5 text-[#FF6F61]" />
                        <p>
                          <strong className="font-medium">Họ tên:</strong>{" "}
                          {userProfile.fullName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 py-3 border-b border-gray-200">
                        <FiPhone className="w-5 h-5 text-[#FF6F61]" />
                        <p>
                          <strong className="font-medium">
                            Số điện thoại:
                          </strong>{" "}
                          {userProfile.phoneNumber}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 py-3 border-b border-gray-200">
                        <FiMail className="w-5 h-5 text-[#FF6F61]" />
                        <p>
                          <strong className="font-medium">Email:</strong>{" "}
                          {userProfile.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 py-3 border-b border-gray-200">
                        <FiUsers className="w-5 h-5 text-[#FF6F61]" />
                        <p>
                          <strong className="font-medium">Giới tính:</strong>{" "}
                          {userProfile.gender === "MALE" ? "Nam" : "Nữ"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 pt-3">
                        <VscWorkspaceTrusted className="w-5 h-5 text-[#FF6F61]" />
                        <p>
                          <strong className="font-medium">Vai trò:</strong>{" "}
                          {userProfile.role === "ADMIN_WEB"
                            ? "Admin Web"
                            : "Admin Mobile"}
                        </p>
                      </div>
                    </>
                  ) : (
                    !profileError && (
                      <p className="text-[#333333] text-sm text-center">
                        Đang tải thông tin...
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

const styles = `
  @keyframes scaleUp {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-scale-up {
    animation: scaleUp 0.5s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.7s ease-out forwards;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
