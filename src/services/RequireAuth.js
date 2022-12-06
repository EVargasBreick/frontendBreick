import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

function RequireAuth({ children }) {
  const authed = useAuth();

  if (authed) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
export default RequireAuth;
