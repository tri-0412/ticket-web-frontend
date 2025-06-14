import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import logoWeb from "../assets/logo.png";

const Home = () => {
  const token = localStorage.getItem("token");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF3E0] to-[#E0F7FA]">
      <motion.div
        className="max-w-md w-full mx-auto px-6 py-12 bg-white rounded-2xl shadow-lg text-center hover:shadow-xl flex flex-col justify-between animate-scale-up min-h-[400px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Phần trên cùng: tiêu đề + ảnh */}
        <div className="flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-bold text-[#333333] mb-4">
            Chào mừng đến với Admin Quản Lý Vé Sự Kiện
          </h1>
          <motion.div
            className="relative w-40 h-40 flex items-center justify-center animate-scale-up"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div className="w-40 h-40 bg-white flex items-center justify-center shadow-md border border-gray-200 rounded-xl">
              <img
                src={logoWeb}
                alt="Welcome Illustration"
                className="w-36 h-36 object-contain rounded-lg shadow-md"
              />
            </div>
          </motion.div>
        </div>

        {/* Mô tả ở giữa */}
        <p className="text-sm text-[#333333] text-opacity-70 mt-4 mb-6">
          {token
            ? "Bạn đã đăng nhập! Chuyển đến trang quản lý để bắt đầu."
            : "Đăng nhập để tiếp tục hoặc đăng ký nếu bạn chưa có tài khoản."}
        </p>

        {/* Nút ở cuối */}
        <div className="flex justify-center gap-3">
          {token ? (
            <Link
              to="/dashboard"
              className="inline-block px-6 py-2 bg-[#FF6F61] text-white font-semibold rounded-full hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-300"
            >
              Đi đến Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-block px-6 py-2 bg-[#FF6F61] text-white font-semibold rounded-full hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-300"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-[#FF6F61] text-white font-semibold rounded-full hover:bg-[#40C4FF] focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 transition-all duration-300"
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
