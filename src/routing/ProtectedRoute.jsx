import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <h1>Unauthorized :(</h1>
        <span>
          <NavLink to="/login">Login</NavLink> to gain access
        </span>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
