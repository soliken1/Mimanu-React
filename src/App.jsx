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
import MBTIScreen from "./screens/Forms/mbti.jsx";
import SelfFormScreen from "./screens/Forms/self.jsx";
import SuperiorFormScreen from "./screens/Forms/superior.jsx";
import PeerFormScreen from "./screens/Forms/peer.jsx";
import TrainorScreen from "./screens/Courses/Trainor/TrainorScreen.jsx";
import TrainorDashboard from "./screens/DashboardViews/TrainorDashboard.jsx";
import fetchUserRole from "./hooks/get/fetchUserRole.js";
import TCourseInfo from "./screens/Courses/Trainor/CourseInfoScreen.jsx";
import CourseUsers from "./screens/Courses/Trainor/CourseUsers.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import TCourseModules from "./screens/Courses/Trainor/CourseModulesScreen.jsx";
import TSubmoduleScreen from "./screens/Courses/Trainor/SubmoduleScreen.jsx";
import TTaskScreen from "./screens/Courses/Trainor/TaskScreen.jsx";
import SpecificTask from "./screens/Courses/Trainor/SpecificTask.jsx";
import TaskQuestions from "./screens/Courses/Trainor/TaskQuestions.jsx";
import SubmoduleScreen from "./screens/Courses/Employee/SubmoduleScreen.jsx";
import EmployeeSpecificTask from "./screens/Courses/Employee/SpecificTask.jsx";
import EmployeeTaskQuestions from "./screens/Courses/Employee/TaskQuestions.jsx";
import AdminScreen from "./screens/Courses/Admin/AdminScreen.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminCourseInfo from "./screens/Courses/Admin/AdminCourseInfo.jsx";
import AdminCourseUsers from "./screens/Courses/Admin/AdminCourseUsers.jsx";
import AdminCourseModules from "./screens/Courses/Admin/AdminCourseModulesScreen.jsx";
import AdminTask from "./screens/Courses/Admin/AdminTask.jsx";
import AdminTaskQuestions from "./screens/Courses/Admin/AdminTaskQuestions.jsx";
import AdminSubmodule from "./screens/Courses/Admin/AdminSubmodule.jsx";
import AdminSpecificTask from "./screens/Courses/Admin/AdminSpecificTask.jsx";
import Progress from "./screens/Courses/Employee/Progress.jsx";
import AdminProgressList from "./screens/Courses/Admin/AdminProgressList.jsx";
import AdminProgress from "./screens/Courses/Admin/AdminProgress.jsx";
import TrainorProgressList from "./screens/Courses/Trainor/TrainorProgressList.jsx";
import TrainorProgress from "./screens/Courses/Trainor/TrainorProgress.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [getUser, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const userRole = await fetchUserRole(user.uid);
          setRole(userRole);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const getDashboardRoute = (userRole) => {
    switch (userRole) {
      case "Admin":
        return "/admindashboard";
      case "Trainor":
        return "/tdashboard";
      case "Employee":
        return "/dashboard";
      default:
        return "/";
    }
  };

  return (
    <Router>
      <Routes>
        {/*Handling of Logins, Route User Role To Appropriate Routes*/}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to={getDashboardRoute(role)} /> : <Login />
          }
        />

        {/*Unprotected Routes but /forgotpassword route has a condition if user is logged in redirect to editprofile*/}
        <Route
          path="/forgotpassword"
          element={
            isLoggedIn ? <Navigate to="/editprofile" /> : <ForgotPassword />
          }
        />

        {/*Protected Routes*/}

        <Route
          path="/register"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <Register getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminScreen getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminCourseInfo getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId/users"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminCourseUsers getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId/modules"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminCourseModules getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId/tasks"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminTask getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId/tasks/:taskId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminSpecificTask getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId/modules/:moduleId/submodules/:submoduleId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminSubmodule getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId/progress"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminProgressList getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId/progress/:userID"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminProgress getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acourse/:courseId/tasks/:taskId/questions"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminTaskQuestions getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin"]}
              redirectTo={getDashboardRoute(role)}
            >
              <AdminDashboard getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tdashboard"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TrainorDashboard getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TrainorScreen getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TCourseInfo getUser={getUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId/users"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <CourseUsers getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId/modules"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TCourseModules getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId/tasks"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TTaskScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId/tasks/:taskId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <SpecificTask getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId/progress"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TrainorProgressList getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId/progress/:userID"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TrainorProgress getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId/tasks/:taskId/questions"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TaskQuestions getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tcourse/:courseId/modules/:moduleId/submodules/:submoduleId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Trainor"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TSubmoduleScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId/modules/:moduleId/submodules/:submoduleId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <SubmoduleScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <CourseInfo getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId/modules"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <CourseModules getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId/tasks"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <TaskScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId/progress"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <Progress getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <EmployeeScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId/tasks/:taskId"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <EmployeeSpecificTask getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId/tasks/:taskId/questions"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <EmployeeTaskQuestions
                getUser={getUser}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:uid"
          element={<Profile getUser={getUser} onLogout={handleLogout} />}
        />

        <Route
          path="/editprofile"
          element={<EditProfile getUser={getUser} onLogout={handleLogout} />}
        />

        {/* <Route path="*" element={<Navigate to={getDashboardRoute(role)} />} /> */}

        <Route
          path="/mbti-form/:uid"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin", "Trainor", "Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <MBTIScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/self-form/:uid"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin", "Trainor", "Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <SelfFormScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superior-form/:uid"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin", "Trainor", "Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <SuperiorFormScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/peer-form"
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={["Admin", "Trainor", "Employee"]}
              redirectTo={getDashboardRoute(role)}
            >
              <PeerFormScreen getUser={getUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
