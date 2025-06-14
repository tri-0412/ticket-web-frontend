/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [searchedEvents, setSearchedEvents] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Danh sách sự kiện ban đầu:", response.data);
        setEvents(response.data);
        setError("");
      } catch (err) {
        setError("Không thể tải danh sách sự kiện.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập tên sự kiện để tìm kiếm.");
      setSearchedEvents(null);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/events/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Kết quả tìm kiếm:", response.data);
      setSearchedEvents(response.data);
      setError("");
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setError("Không tìm thấy sự kiện với từ khóa: " + searchTerm);
      setSearchedEvents(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchedEvents(null);
    setError("");
  };

  const eventsToDisplay = searchedEvents || events;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl py-3 text-center font-bold text-[#333333]">
        Danh sách sự kiện
      </h3>

      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2 text-[#333333] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Nhập tên sự kiện..."
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

      {isLoading && (
        <div className="text-center text-[#333333]">Đang tải...</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#FFE0CC] to-[#C0EAF2] text-[#333333] text-[14px] font-semibold sticky top-0">
              {" "}
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-center">Tên sự kiện</th>
              <th className="px-4 py-3 text-center">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {eventsToDisplay.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-4 text-center text-[#333333]"
                >
                  Không có sự kiện nào để hiển thị.
                </td>
              </tr>
            ) : (
              eventsToDisplay.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-200 hover:bg-[#E0F7FA] transition-all duration-150"
                >
                  <td className="px-4 py-3 text-[#333333]">{event.id}</td>
                  <td className="px-4 py-3 text-[#333333] text-center">
                    {event.eventName}
                  </td>
                  <td className="px-4 py-3 text-[#333333] text-center">
                    {new Date(event.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
