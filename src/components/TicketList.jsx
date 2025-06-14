import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [searchedTickets, setSearchedTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Danh sách vé ban đầu:", response.data);
        setTickets(response.data);
        setError("");
        response.data.forEach((ticket) => {
          if (ticket.qrCode) {
            const img = new Image();
            img.src = ticket.qrCode;
          }
        });
      } catch (err) {
        setError("Không thể tải danh sách vé.");
        console.error("Lỗi khi lấy danh sách vé:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập mã vé để tìm kiếm.");
      setSearchedTickets([]);
      setCurrentPage(1);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/tickets/search?ticketCode=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Kết quả tìm kiếm:", response.data);
      setSearchedTickets(response.data);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setError("Không tìm thấy vé với mã: " + searchTerm);
      setSearchedTickets([]);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchedTickets([]);
    setError("");
    setCurrentPage(1);
  };

  const ticketsToDisplay =
    searchedTickets.length > 0 ? searchedTickets : tickets;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return ticketsToDisplay.slice(indexOfFirstItem, indexOfLastItem);
  }, [ticketsToDisplay, indexOfFirstItem, indexOfLastItem]);
  const totalPages = Math.ceil(ticketsToDisplay.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-3">
      <h3 className="text-2xl py-3 text-center font-bold text-[#333333]">
        Danh sách vé
      </h3>

      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2 text-[#333333] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Nhập mã vé để tìm kiếm..."
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
          className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
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
        <div ref={tableContainerRef} className="overflow-y-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFE0CC] to-[#C0EAF2] text-[#333333] text-[14px] font-semibold sticky top-0">
                {" "}
                <th className="px-2 py-4 text-center w-16">ID</th>
                <th className="px-2 py-4 text-left w-34">Mã vé</th>
                <th className="px-2 py-4 text-left w-38">Tên sự kiện</th>
                <th className="px-1 py-4 text-center w-20">Loại vé</th>
                <th className="px-1 py-4 text-center w-40">Tên khách hàng</th>
                <th className="px-2 py-4 text-center w-28">Trạng thái</th>
                <th className="px-2 py-4 text-center w-36">Ngày tạo</th>
                <th className="px-2 py-4 text-center w-32">QR Code</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-2 text-center text-[#333333] text-sm"
                  >
                    Không có vé nào để hiển thị.
                  </td>
                </tr>
              ) : (
                currentItems.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-200 hover:bg-[#E0F7FA] transition-all duration-150"
                  >
                    <td className="px-2 py-2 text-[#333333] text-sm w-16">
                      {ticket.id}
                    </td>
                    <td className="px-2 py-2 text-[#333333] text-sm w-48">
                      {ticket.ticketCode}
                    </td>
                    <td className="px-2 py-2 text-[#333333] text-sm w-48">
                      {ticket.eventName}
                    </td>
                    <td className="px-1 py-2 text-[#333333] text-sm w-36">
                      <span className="inline-block w-18 text-center px-3 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-sm">
                        {ticket.ticketType}
                      </span>
                    </td>
                    <td className="px-1 py-2 text-[#333333] text-sm text-center w-40">
                      {ticket.customerName}
                    </td>
                    <td className="px-2 py-2 w-20 text-center">
                      <span className="inline-block w-20 text-center px-2.5 py-1.5 text-sm uppercase font-medium rounded-full bg-[#40C4FF] text-white">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-[#333333] text-sm w-24">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </td>
                    <td className="px-2 py-2 w-35 qr-code-cell text-center">
                      {ticket.qrCode && (
                        <img
                          src={ticket.qrCode}
                          alt="QR Code"
                          className="w-20 h-20 object-contain"
                          style={{ aspectRatio: "1 / 1" }}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-[#FF6F61] text-white font-medium rounded-lg hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FaAngleLeft className="w-5 h-5" />
          </button>

          {(() => {
            const maxPagesToShow = 5;
            const pages = [];
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            if (endPage - startPage + 1 < maxPagesToShow) {
              if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
              } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
              }
            }

            if (startPage > 1) {
              pages.push(
                <button
                  key={1}
                  onClick={() => paginate(1)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    currentPage === 1
                      ? "bg-[#FF6F61] text-white"
                      : "bg-gray-200 text-[#333333] hover:bg-[#E0F7FA]"
                  }`}
                >
                  1
                </button>
              );
              if (startPage > 2) {
                pages.push(
                  <span
                    key="start-ellipsis"
                    className="px-3 py-1 text-[#333333] flex items-center justify-center"
                  >
                    ...
                  </span>
                );
              }
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => paginate(i)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    currentPage === i
                      ? "bg-[#FF6F61] text-white"
                      : "bg-gray-200 text-[#333333] hover:bg-[#E0F7FA]"
                  }`}
                >
                  {i}
                </button>
              );
            }

            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push(
                  <span
                    key="end-ellipsis"
                    className="px-3 py-1 text-[#333333] flex items-center justify-center"
                  >
                    ...
                  </span>
                );
              }
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => paginate(totalPages)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    currentPage === totalPages
                      ? "bg-[#FF6F61] text-white"
                      : "bg-gray-200 text-[#333333] hover:bg-[#E0F7FA]"
                  }`}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-[#FF6F61] text-white font-medium rounded-lg hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FaAngleRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(TicketList);
