import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function RoleRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getCurrentUser();
      console.log("DEBUG RoleRoute - User data received:", data);
      console.log("DEBUG RoleRoute - allowedRole:", allowedRole);
      console.log("DEBUG RoleRoute - user.role:", data?.role);
      console.log("DEBUG RoleRoute - Role match:", data?.role === allowedRole);
      setUser(data);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    console.log("DEBUG RoleRoute - No user found, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (user.role !== allowedRole) {
    console.log("DEBUG RoleRoute - Role mismatch. Expected:", allowedRole, "Got:", user.role);
    return <Navigate to="/login" />;
  }

  console.log("DEBUG RoleRoute - Access granted for role:", user.role);
  return children;
}

export default RoleRoute;