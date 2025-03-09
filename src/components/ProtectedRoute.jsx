import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role, allowedRoles, redirectTo }) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

export default ProtectedRoute;
