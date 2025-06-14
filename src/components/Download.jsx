import React from "react";

const Download = () => {
  // Đường dẫn tải xuống từ Dropbox
  const downloadLink =
    "https://www.dropbox.com/scl/fi/5s63scf8yzs6tpe66xjj5/TicketTools-Setup-1.0.0.exe?rlkey=7mtiytfwomwrmtc0a7jmxlkne&st=aw6zszxl&dl=1";

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-md">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Phần bên trái: Thông tin chính */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center mb-6">
              <img
                src="/logo.webp" // Thay bằng logo của bạn
                alt="App Logo"
                className="w-16 h-16 mr-4 rounded-lg shadow-md"
              />
              <h3 className="text-3xl font-bold text-gray-800">
                Quản lý Vé Sự kiện
              </h3>
            </div>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Ứng dụng chuyên nghiệp để quản lý vé sự kiện, hỗ trợ trên Windows.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a
                href={downloadLink}
                download
                className="flex items-center px-6 py-3 bg-[#d84c43] text-white font-semibold rounded-lg hover:bg-[#cd291e] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </a>
              <span className="text-sm text-gray-500">.exe (Windows)</span>
            </div>
          </div>

          {/* Phần bên phải: Thông tin bổ sung */}
          <div className="flex-1 flex flex-col">
            <img
              src="/AppScreenShot.png" // Thay bằng ảnh chụp màn hình ứng dụng
              alt="App Screenshot"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl shadow-lg my-4"
            />
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 shadow-md">
              <h4 className="text-base font-semibold text-gray-800 mb-3">
                Thông tin bổ sung
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-700">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
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
                  <p>
                    <strong>Phiên bản:</strong> 1.0.0
                  </p>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p>
                    <strong>Build:</strong> 243.26053.27
                  </p>
                </div>
                <div className="flex ">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>
                    <strong>Ngày phát hành:</strong> 01 Tháng 4, 2025
                  </p>
                </div>
                <div className="flex ">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p>
                    <strong>Yêu cầu hệ thống:</strong> Windows 10 trở lên
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
