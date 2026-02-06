import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  if (!token)  {
    return <Navigate to="/login"/>;
  }

  return children;
}
export default ProtectedRoute;