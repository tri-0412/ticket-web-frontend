/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [searchedCustomers, setSearchedCustomers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Danh sách khách hàng ban đầu:", response.data);
        setCustomers(response.data);
        setError("");
      } catch (err) {
        setError("Không thể tải danh sách khách hàng.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập tên hoặc email để tìm kiếm.");
      setSearchedCustomers(null);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/customers/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Kết quả tìm kiếm:", response.data);
      setSearchedCustomers(response.data);
      setError("");
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setError("Không tìm thấy khách hàng với từ khóa: " + searchTerm);
      setSearchedCustomers(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchedCustomers(null);
    setError("");
  };

  const customersToDisplay = searchedCustomers || customers;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl py-3 text-center font-bold text-[#333333]">
        Danh sách khách hàng
      </h3>

      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2 text-[#333333] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40C4FF] focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Nhập tên hoặc email khách hàng..."
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
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#FFE0CC] to-[#C0EAF2] text-[#333333] text-[14px] font-semibold sticky top-0">
              {" "}
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Tên khách hàng</th>
              <th className="px-4 py-3 text-left">Tuổi</th>
              <th className="px-4 py-3 text-left">Số điện thoại</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Tên đăng nhập</th>
              <th className="px-4 py-3 text-center">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {customersToDisplay.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-4 text-center text-[#333333]"
                >
                  Không có khách hàng nào để hiển thị.
                </td>
              </tr>
            ) : (
              customersToDisplay.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-200 hover:bg-[#E0F7FA] transition-all duration-150"
                >
                  <td className="px-4 py-3 text-[#333333]">{customer.id}</td>
                  <td className="px-4 py-3 text-[#333333]">
                    {customer.customerName}
                  </td>
                  <td className="px-4 py-3 text-[#333333]">{customer.age}</td>
                  <td className="px-4 py-3 text-[#333333]">
                    {customer.phoneNumber}
                  </td>
                  <td className="px-4 py-3 text-[#333333]">{customer.email}</td>
                  <td className="px-4 py-3 text-[#333333] text-center">
                    {customer.username}
                  </td>
                  <td className="px-4 py-3 text-[#333333]">
                    {new Date(customer.createdAt).toLocaleString()}
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

export default CustomerList;
