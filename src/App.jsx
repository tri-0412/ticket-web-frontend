import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import TicketList from "./components/TicketList";
import CustomerList from "./components/CustomerList";
import EventList from "./components/EventList";
import UserList from "./components/UserList";
import Download from "./components/Download";
import WelcomeSection from "./components/WelcomeSection";
import CheckinLogs from "./components/CheckinLogs";
import AssignPermission from "./components/AssignPermission";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Trang chủ */}
        <Route path="/login" element={<Login />} /> {/* Trang đăng nhập */}
        <Route path="/register" element={<Register />} /> {/* Trang đăng ký */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<WelcomeSection />} />
          <Route path="tickets" element={<TicketList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="events" element={<EventList />} />
          <Route path="checkinLog" element={<CheckinLogs />} />
          <Route path="AssignPermission" element={<AssignPermission />} />
          <Route path="users" element={<UserList />} />
          <Route path="download" element={<Download />} />
          {/* Thay thế nội dung mặc định */}{" "}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
