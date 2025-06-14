import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const WelcomeSection = () => {
  const navigate = useNavigate();
  const { userProfile, stats } = useOutletContext();
  if (!userProfile || !stats) {
    return <div className="text-center text-[#333333]">Đang tải...</div>;
  }
  return (
    <div className="bg-gradient-to-r from-[#FFF3E0] to-[#E0F7FA] rounded-2xl shadow-lg p-6 animate-fade-in mt-1">
      <div className="flex items-center space-x-4">
        <svg
          className="w-12 h-12 text-[#FF6F61]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A7.978 7.978 0 0112 14a7.978 7.978 0 016.879 3.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 22a10 10 0 100-20 10 10 0 000 20z"
          />
        </svg>
        <div>
          <h3 className="text-2xl font-bold text-[#333333]">
            Chào mừng, {userProfile ? userProfile.fullName : "Người dùng"}!
          </h3>
          <p className="text-[#333333] mt-1">
            Quản lý công việc của bạn một cách dễ dàng và hiệu quả.
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-sm text-[#333333]">Ticket mới</p>
          <p className="text-lg font-semibold text-[#FF6F61]">
            {stats.tickets || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-sm text-[#333333]">Khách hàng</p>
          <p className="text-lg font-semibold text-[#FF6F61]">
            {stats.customers || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-sm text-[#333333]">Sự kiện</p>
          <p className="text-lg font-semibold text-[#FF6F61]">
            {stats.events || 0}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate("/dashboard/tickets")}
        className="mt-4 cursor-pointer px-4 py-2 bg-[#FF6F61] text-white font-medium rounded-md hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-200"
      >
        Xem tất cả ticket
      </button>
    </div>
  );
};

export default WelcomeSection;
