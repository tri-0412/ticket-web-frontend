/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const CheckinLogs = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [searchedEvents, setSearchedEvents] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/checkin/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Danh sách check-in ban đầu:", response.data);
        setEvents(response.data);
        setError("");
      } catch (err) {
        setError("Không thể tải danh sách check-in.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập mã vé để tìm kiếm.");
      setSearchedEvents(null);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/checkin/logs/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Kết quả tìm kiếm:", response.data);
      setSearchedEvents(response.data);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setError("Không tìm thấy check-in với mã vé: " + searchTerm);
      setSearchedEvents(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchedEvents(null);
    setError("");
    setCurrentPage(1);
  };

  const formatCheckinTime = (timeString) => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const eventsToDisplay = searchedEvents || events;
  const totalPages = Math.ceil(eventsToDisplay.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = eventsToDisplay.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl py-3 text-center font-bold text-[#333333]">
        Lịch sử check in
      </h3>
      <form className="flex items-center space-x-3" onSubmit={handleSearch}>
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2 text-[#333333] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Nhập mã vé..."
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
          className="px-4 py-2 cursor-pointer bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          onClick={handleReset}
        >
          Xóa tìm kiếm
        </button>
      </form>
      {error && (
        <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-[#333333]">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFE0CC] to-[#C0EAF2] text-[#333333] text-[14px] font-semibold sticky top-0">
                {" "}
                <th className="px-2 py-3 text-left align-middle">ID</th>
                <th className="px-4 py-3 text-center align-middle">Mã vé</th>
                <th className="px-4 py-3 text-left align-middle">
                  Tên sự kiện
                </th>
                <th className="py-3 text-left align-middle">Tên nhân viên</th>
                <th className="px-4 py-3 text-center align-middle">Loại vé</th>
                <th className="py-3 text-left align-middle">Tên khách hàng</th>
                <th className="px-2 py-3 text-center align-middle">
                  Trạng thái
                </th>
                <th className="py-3 text-center align-middle">
                  Thời gian check in
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr className="h-10">
                  <td
                    colSpan="8"
                    className="px-4 py-3 text-center text-[#333333] align-middle"
                  >
                    Không có dữ liệu check-in nào để hiển thị.
                  </td>
                </tr>
              ) : (
                currentItems.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-gray-200 hover:bg-[#E0F7FA] transition-all duration-150 h-15"
                  >
                    <td className="px-2 py-3 text-[#333333] align-middle">
                      {event.id}
                    </td>
                    <td className="px-4 py-3 text-[#333333] align-middle">
                      {event.ticketCode}
                    </td>
                    <td className="px-4 py-3 text-[#333333] align-middle">
                      {event.eventName}
                    </td>
                    <td className="py-3 text-[#333333] align-middle w-32">
                      {event.userName}
                    </td>
                    <td className="px-2 py-3 text-[#333333] align-middle text-center">
                      <span className="inline-block w-15 text-center px-3 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-sm">
                        {event.ticketType}
                      </span>
                    </td>
                    <td className="w-32 py-3 text-[#333333] align-middle text-center">
                      {event.customerName}
                    </td>
                    <td className="px-2 py-3">
                      <span className="inline-block w-16 text-center align-middle px-2.5 py-1.5 text-sm uppercase font-medium rounded-full bg-[#40C4FF] text-white">
                        {event.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[#333333] align-middle text-center">
                      {formatCheckinTime(event.checkinTime)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg font-medium cursor-pointer ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#FF6F61] text-white hover:bg-[#40C4FF]"
            }`}
          >
            <FaAngleLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
                  currentPage === page
                    ? "bg-[#FF6F61] text-white"
                    : "bg-gray-200 text-[#333333] hover:bg-[#E0F7FA]"
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg font-medium cursor-pointer ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#FF6F61] text-white hover:bg-[#40C4FF]"
            }`}
          >
            <FaAngleRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckinLogs;
