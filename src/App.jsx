import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./config/firebaseConfigs.js";
import Login from "./screens/AuthViews/LoginScreen.jsx";
import Register from "./screens/AuthViews/RegisterScreen.jsx";
import EmployeeDashboard from "./screens/DashboardViews/EmployeeDashboardScreen.jsx";
import AdminDashboard from "./screens/DashboardViews/AdminDashboard.jsx";
import ForgotPassword from "./screens/AuthViews/ForgotPasswordScreen.jsx";
import Profile from "./screens/AuthViews/ProfileScreen.jsx";
import EditProfile from "./screens/AuthViews/EditProfileScreen.jsx";
import CourseInfo from "./screens/Courses/Employee/CourseInfoScreen.jsx";
import EmployeeScreen from "./screens/Courses/Employee/EmployeeScreen.jsx";
import CourseModules from "./screens/Courses/Employee/CourseModulesScreen.jsx";
import TaskScreen from "./screens/Courses/Employee/TaskScreen.jsx";
import ResultScreen from "./screens/Courses/Employee/ResultScreen.jsx";
import MBTIScreen from "./screens/Forms/mbti.jsx";
import SelfFormScreen from "./screens/Forms/self.jsx";
import SuperiorFormScreen from "./screens/Forms/superior.jsx";
import PeerFormScreen from "./screens/Forms/peer.jsx";
import TrainorScreen from "./screens/Courses/Trainor/TrainorScreen.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [getUser, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/forgotpassword"
          element={
            isLoggedIn ? (
              <Navigate to="/editprofile" />
            ) : (
              <ForgotPassword onLogin={handleLogin} />
            )
          }
        />
        <Route path="/mbti-form" element={<MBTIScreen />} />
        <Route path="/self-form" element={<SelfFormScreen />} />
        <Route path="/superior-form" element={<SuperiorFormScreen />} />
        <Route path="/peer-form" element={<PeerFormScreen />} />
        {isLoggedIn ? (
          <>
            <Route
              path="/register"
              element={<Register getUser={getUser} onLogout={handleLogout} />}
            />
            <Route
              path="/profile"
              element={<Profile getUser={getUser} onLogout={handleLogout} />}
            />
            <Route
              path="/editprofile"
              element={
                <EditProfile getUser={getUser} onLogout={handleLogout} />
              }
            />
            <Route
              path="/dashboard"
              element={
                <EmployeeDashboard getUser={getUser} onLogout={handleLogout} />
              }
            />
            <Route
              path="/course"
              element={
                <EmployeeScreen getUser={getUser} onLogout={handleLogout} />
              }
            />
            <Route
              path="/tcourse"
              element={
                <TrainorScreen getUser={getUser} onLogout={handleLogout} />
              }
            />
            <Route
              path="/course/home/:courseId"
              element={<CourseInfo getUser={getUser} onLogout={handleLogout} />}
            />
            <Route
              path="/course/modules/:courseId"
              element={
                <CourseModules getUser={getUser} onLogout={handleLogout} />
              }
            />
            <Route
              path="/course/tasks/:courseId"
              element={<TaskScreen getUser={getUser} onLogout={handleLogout} />}
            />
            <Route
              path="/course/results/:courseId"
              element={
                <ResultScreen getUser={getUser} onLogout={handleLogout} />
              }
            />
            <Route
              path="/admindashboard"
              element={
                <AdminDashboard getUser={getUser} onLogout={handleLogout} />
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}
