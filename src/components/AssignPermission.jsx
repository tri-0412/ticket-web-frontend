import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  IoTrash,
  IoCalendarOutline,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";

const AssignPermission = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventName, setSelectedEventName] = useState("Chọn sự kiện");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [eventError, setEventError] = useState("");
  const [userError, setUserError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [permissionToRevoke, setPermissionToRevoke] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      fetchPermissions();
    }
  }, [events]);

  useEffect(() => {
    if (showRevokeModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showRevokeModal]);

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEventDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setUserError("Lỗi khi lấy danh sách nhân viên.");
      console.error("Lỗi khi lấy danh sách nhân viên:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (err) {
      setEventError("Lỗi khi lấy danh sách sự kiện.");
      console.error("Lỗi khi lấy danh sách sự kiện:", err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/checkin/permissions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const permissionsData = response.data.map((perm) => {
        const event = events.find((e) => e.id === perm.eventId) || {
          eventName: "Unknown Event",
        };
        return {
          eventId: perm.eventId,
          userId: perm.user.id,
          userName: perm.user.fullName,
          eventName: event.eventName,
        };
      });
      setPermissions(permissionsData);
    } catch (err) {
      setUserError("Lỗi khi lấy danh sách quyền check-in.");
      console.error("Lỗi khi lấy danh sách quyền:", err);
    }
  };

  const handleUserSelect = (userId, checked) => {
    setSelectedUserIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
    setUserError("");
  };

  const handleEventSelect = (eventId, eventName) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName);
    setEventError("");
    setIsEventDropdownOpen(false);
  };

  const toggleEventDropdown = () => {
    setIsEventDropdownOpen(!isEventDropdownOpen);
  };

  const handleGrantPermission = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!selectedEventId) {
      setEventError("Vui lòng chọn một sự kiện.");
      hasError = true;
    } else {
      setEventError("");
    }

    if (selectedUserIds.length === 0) {
      setUserError("Vui lòng chọn ít nhất một nhân viên.");
      hasError = true;
    } else {
      setUserError("");
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/checkin/permissions/grant",
        {
          eventId: parseInt(selectedEventId),
          userIds: selectedUserIds.map((id) => parseInt(id)),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchPermissions();
      setSuccess("Cấp quyền thành công!");
      setShowSuccessPopup(true);
      setEventError("");
      setUserError("");
      setSelectedEventId("");
      setSelectedEventName("Chọn sự kiện");
      setSelectedUserIds([]);
    } catch (err) {
      console.error("Lỗi khi cấp quyền:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Lỗi khi cấp quyền. Vui lòng thử lại.";
      if (errorMessage.includes("No valid permissions to grant")) {
        setUserError("Nhân viên đã được phân quyền cho sự kiện này.");
      } else {
        setUserError(errorMessage);
      }
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokePermission = (eventId, userId) => {
    setPermissionToRevoke({ eventId, userId });
    setShowRevokeModal(true);
  };

  const confirmRevoke = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/checkin/permissions/revoke?eventId=${permissionToRevoke.eventId}&userId=${permissionToRevoke.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPermissions();
      setSuccess("Thu hồi quyền thành công!");
      setShowSuccessPopup(true);
      setEventError("");
      setUserError("");
      setShowRevokeModal(false);
      setPermissionToRevoke(null);
    } catch (err) {
      console.error("Lỗi khi thu hồi quyền:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Lỗi khi thu hồi quyền. Vui lòng thử lại.";
      setUserError(errorMessage);
      setSuccess("");
      setShowRevokeModal(false);
      setPermissionToRevoke(null);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="space-y-8 p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
      <h4 className="text-3xl font-bold text-[#333333] border-b-2 border-[#40C4FF] pb-3 flex items-center">
        <IoShieldCheckmarkOutline className="mr-2 w-8 h-8 text-[#FF6F61]" />
        Phân công quyền check in
      </h4>

      <form
        onSubmit={handleGrantPermission}
        className="space-y-8 bg-white px-8 pt-8 pb-3 rounded-xl shadow-md border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="eventSelect"
              className="flex items-center text-sm font-semibold text-[#333333] mb-2"
            >
              <IoCalendarOutline className="mr-2 w-5 h-5 text-[#FF6F61]" />
              Sự kiện
            </label>
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-full px-4 py-3 text-[#333333] border-0 border-b-2 border-gray-200 rounded-lg shadow-sm bg-white cursor-pointer flex justify-between items-center"
                onClick={toggleEventDropdown}
              >
                <span
                  className={
                    selectedEventId ? "text-[#333333]" : "text-gray-500"
                  }
                >
                  {selectedEventName}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isEventDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {isEventDropdownOpen && (
                <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  <div
                    className="px-4 py-3 text-gray-500 bg-white hover:bg-[#E0F7FA] transition-colors duration-200 cursor-pointer"
                    onClick={() => handleEventSelect("", "Chọn sự kiện")}
                  >
                    Chọn sự kiện
                  </div>
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="px-4 py-3 text-[#333333] bg-white hover:bg-[#E0F7FA] transition-colors duration-200 cursor-pointer"
                      onClick={() =>
                        handleEventSelect(event.id, event.eventName)
                      }
                    >
                      {event.eventName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="min-h-6 mt-2">
              {eventError ? (
                <p className="text-sm text-red-600">{eventError}</p>
              ) : (
                <p className="text-sm text-transparent"></p>
              )}
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm font-semibold text-[#333333] mb-2">
              <IoPeopleOutline className="mr-2 w-5 h-5 text-[#FF6F61]" />
              Nhân viên
            </label>
            <div className="mt-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
              {users.length === 0 ? (
                <p className="text-[#333333] text-sm">
                  Không có nhân viên nào.
                </p>
              ) : (
                users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center space-x-3 py-3 px-3 border-b border-gray-100 last:border-b-0 hover:bg-[#E0F7FA] transition-all duration-200 rounded-md"
                  >
                    <input
                      type="checkbox"
                      value={user.id}
                      checked={selectedUserIds.includes(user.id.toString())}
                      onChange={(e) =>
                        handleUserSelect(e.target.value, e.target.checked)
                      }
                      className="h-5 w-5 text-[#FF6F61] border-gray-300 rounded focus:ring-[#40C4FF]"
                    />
                    <span className="text-sm text-[#333333] font-medium">
                      {user.fullName} ({user.username})
                    </span>
                  </label>
                ))
              )}
            </div>
            <div className="min-h-6 mt-2">
              {userError ? (
                <p className="text-sm text-red-600">{userError}</p>
              ) : (
                <p className="text-sm text-transparent">Placeholder</p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-[#FF6F61] text-white font-semibold rounded-lg hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-300 shadow-lg disabled:bg-[#FF6F61]/50 disabled:cursor-not-allowed cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Đang xử lý...
              </div>
            ) : (
              "Cấp quyền"
            )}
          </button>
        </div>
      </form>

      <div className="rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <h4 className="text-xl font-semibold text-[#333333] mb-4 border-b-2 border-[#40C4FF] pb-2 flex items-center px-6">
          <IoShieldCheckmarkOutline className="mr-2 w-6 h-6 text-[#FF6F61]" />
          Danh sách quyền đã phân công
        </h4>
        <div className="overflow-x-auto">
          <div className="bg-white">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-[#FFE0CC] to-[#C0EAF2] text-[#333333] text-[14px] font-semibold sticky top-0">
                  <th className="px-6 py-4 text-left text-sm font-semibold border-r border-gray-200 min-w-[200px]">
                    <div className="flex items-center">
                      <IoPeopleOutline className="mr-2 w-5 h-5 text-[#FF6F61]" />
                      Nhân viên
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold border-r border-gray-200 min-w-[200px]">
                    <div className="flex justify-center items-center">
                      <IoCalendarOutline className="mr-2 w-5 h-5 text-[#FF6F61]" />
                      Sự kiện
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold">
                    <div className="flex justify-center text-center">
                      <FaUserEdit className="mr-2 w-5 h-5 text-[#FF6F61]" />
                      Hành động
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-6 text-center text-[#333333] italic"
                    >
                      Chưa có quyền nào được phân công.
                    </td>
                  </tr>
                ) : (
                  permissions.map((permission, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-[#E0F7FA] transition-all duration-300"
                    >
                      <td className="pl-10 py-3 text-[#333333] font-medium border-r border-gray-100">
                        {permission.userName}
                      </td>
                      <td className="px-6 py-3 text-center text-[#333333] font-medium border-r border-gray-100">
                        {permission.eventName}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          className="p-2 text-[#FF6F61] hover:text-[#40C4FF] focus:outline-none cursor-pointer transition-all duration-200 transform hover:scale-110 relative group"
                          onClick={() =>
                            handleRevokePermission(
                              permission.eventId,
                              permission.userId
                            )
                          }
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
        </div>
      </div>

      {showRevokeModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold text-[#333333]">
                Xác nhận thu hồi quyền
              </h5>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => {
                  setShowRevokeModal(false);
                  setPermissionToRevoke(null);
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
              Bạn có chắc chắn muốn thu hồi quyền này không? Sau khi thu hồi sẽ
              không thể khôi phục.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setShowRevokeModal(false);
                  setPermissionToRevoke(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-[#FF6F61] text-white font-medium rounded-lg hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                onClick={confirmRevoke}
              >
                Thu hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            opacity: showSuccessPopup ? 1 : 0,
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeSuccessPopup();
          }}
          tabIndex={0}
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-[#C6FF00] animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xl text-[#333333] text-center font-semibold mb-6">
              {success}
            </p>
            <button
              className="w-full px-6 py-3 cursor-pointer bg-[#FF6F61] text-white font-semibold rounded-lg hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200 shadow-md"
              onClick={closeSuccessPopup}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignPermission;
