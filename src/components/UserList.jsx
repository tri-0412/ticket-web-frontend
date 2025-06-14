import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { IoTrash } from "react-icons/io5";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser || showDeleteModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedUser, showDeleteModal]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Danh sách người dùng ban đầu:", response.data);
      setUsers(response.data);
      setError("");
    } catch (err) {
      setError("Lỗi khi lấy danh sách user.");
      console.error("Lỗi khi lấy danh sách user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập họ tên hoặc email để tìm kiếm.");
      setSearchedUsers(null);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/auth/users/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Kết quả tìm kiếm:", response.data);
      setSearchedUsers(response.data);
      setError("");
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setError("Không tìm thấy người dùng với từ khóa: " + searchTerm);
      setSearchedUsers(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchedUsers(null);
    setError("");
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: "",
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      gender: user.gender,
      role: user.role,
    });
    setErrors({});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/auth/users/${selectedUser.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? response.data : user
        )
      );
      setSearchedUsers(
        searchedUsers
          ? searchedUsers.map((user) =>
              user.id === selectedUser.id ? response.data : user
            )
          : null
      );
      setSelectedUser(null);
      setFormData({
        username: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        gender: "",
        role: "",
      });
      setErrors({});
    } catch (err) {
      if (err.response && err.response.status === 400) {
        if (typeof err.response.data === "object") {
          setErrors(err.response.data);
        } else {
          setErrors({ general: err.response.data });
        }
      }
    }
  };

  const handleDelete = (id) => {
    setUserIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/auth/users/${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userIdToDelete));
      setSearchedUsers(
        searchedUsers
          ? searchedUsers.filter((user) => user.id !== userIdToDelete)
          : null
      );
      setShowDeleteModal(false);
      setUserIdToDelete(null);
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      setShowDeleteModal(false);
      setUserIdToDelete(null);
    }
  };

  const usersToDisplay = searchedUsers || users;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl py-3 text-center font-bold text-[#333333]">
        Danh sách nhân viên
      </h3>

      <form onSubmit={handleSearch} className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2.5 text-sm text-[#333333] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-sm"
            placeholder="Nhập họ tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FF6F61]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#FF6F61] text-white font-medium rounded-lg hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200 cursor-pointer"
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          className="px-4 py-2.5 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm cursor-pointer"
          onClick={handleReset}
        >
          Xóa tìm kiếm
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm text-center shadow-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center text-[#333333] text-sm">Đang tải...</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#FFE0CC] to-[#C0EAF2] text-[#333333] text-[14px] font-semibold sticky top-0">
              <th className="px-4 py-4 text-left">ID</th>
              <th className="px-4 py-4 text-left">Tên đăng nhập</th>
              <th className="px-4 py-4 text-left">Họ tên</th>
              <th className="px-4 py-4 text-left">Số điện thoại</th>
              <th className="px-4 py-4 text-left">Email</th>
              <th className="py-4 text-center">Giới tính</th>
              <th className="px-4 py-4 text-left">Vai trò</th>
              <th className="px-2 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {usersToDisplay.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-3 text-center text-[#333333] text-sm"
                >
                  Không có người dùng nào để hiển thị.
                </td>
              </tr>
            ) : (
              usersToDisplay.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-[#E0F7FA] transition-all duration-150"
                >
                  <td className="px-4 py-3 text-[#333333] text-sm">
                    {user.id}
                  </td>
                  <td className="px-2 py-3 text-[#333333] text-sm">
                    {user.username}
                  </td>
                  <td className="px-2 py-3 text-[#333333] text-sm">
                    {user.fullName}
                  </td>
                  <td className="px-4 py-3 text-[#333333] text-sm">
                    {user.phoneNumber}
                  </td>
                  <td className="px-4 py-3 text-[#333333] text-sm">
                    {user.email}
                  </td>
                  <td className="px-3 py-3 text-[#333333] text-sm text-center">
                    {user.gender === "MALE" ? "Nam" : "Nữ"}
                  </td>
                  <td className="px-2 py-3 text-[#333333] text-sm">
                    {user.role === "ADMIN_WEB" ? "Admin Web" : "Admin Mobile"}
                  </td>
                  <td className="px-4 py-3 flex space-x-2">
                    <button
                      className="p-2 cursor-pointer text-[#FF6F61] hover:text-[#40C4FF] focus:outline-none transition-all duration-200 transform hover:scale-110"
                      onClick={() => handleEdit(user)}
                      title="Sửa"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 cursor-pointer text-[#FF6F61] hover:text-[#40C4FF] focus:outline-none transition-all duration-200 transform hover:scale-110"
                      onClick={() => handleDelete(user.id)}
                      title="Xóa"
                    >
                      <IoTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md max-h-[100vh]">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold text-[#333333]">
                Cập nhật người dùng
              </h5>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => {
                  setSelectedUser(null);
                  setErrors({});
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {errors.general && (
              <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm text-center mb-4 shadow-sm">
                {errors.general}
              </div>
            )}
            <form onSubmit={handleUpdate} className="space-y-2">
              <div>
                <label
                  htmlFor="updateUsername"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  className="mt-1 w-full px-2 py-1.5 text-sm text-[#333333] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 shadow-sm"
                  id="updateUsername"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                {errors.username && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.username}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="updatePassword"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Mật khẩu (để trống nếu không thay đổi)
                </label>
                <input
                  type="password"
                  className="mt-1 w-full px-2 py-1.5 text-sm text-[#333333] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 shadow-sm"
                  id="updatePassword"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {errors.password && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.password}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="updateFullName"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Họ tên
                </label>
                <input
                  type="text"
                  className="mt-1 w-full px-2 py-1.5 text-sm text-[#333333] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 shadow-sm"
                  id="updateFullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                {errors.fullName && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.fullName}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="updatePhoneNumber"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="mt-1 w-full px-2 py-1.5 text-sm text-[#333333] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 shadow-sm"
                  id="updatePhoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
                {errors.phoneNumber && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="updateEmail"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full px-2 py-1.5 text-sm text-[#333333] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 shadow-sm"
                  id="updateEmail"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.email}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="updateGender"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Giới tính
                </label>
                <select
                  className="mt-1 w-full px-2 py-1.5 text-sm text-[#333333] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 shadow-sm"
                  id="updateGender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
                {errors.gender && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.gender}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="updateRole"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Vai trò
                </label>
                <select
                  className="mt-1 w-full px-2 py-1.5 text-sm text-[#333333] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 shadow-sm"
                  id="updateRole"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="ADMIN_WEB">Admin Web</option>
                  <option value="ADMIN_MOBILE">Admin Mobile</option>
                </select>
                {errors.role && (
                  <div className="text-red-600 text-xs mt-1">{errors.role}</div>
                )}
              </div>
              <button
                type="submit"
                className="mt-1 w-full px-4 py-2.5 cursor-pointer bg-[#FF6F61] text-white font-medium rounded-md hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                Cập nhật
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold text-[#333333]">
                Xác nhận xóa
              </h5>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserIdToDelete(null);
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-[#333333] mb-6">
              Bạn có chắc chắn muốn xóa người dùng này không? Hành động xóa này
              là vĩnh viễn.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserIdToDelete(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-[#FF6F61] text-white font-medium rounded-lg hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
