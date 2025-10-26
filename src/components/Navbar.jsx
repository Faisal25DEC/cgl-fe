import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/CGL.png";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="CGL" className="h-10 w-10 rounded-full" />
          <span className="text-lg font-semibold">Cosmic Game Logic</span>
        </div>
        <div className="flex gap-2 items-center">
          <p>{user.firstName}</p>

          <button onClick={logout} className="rounded-md bg-blue-500 text-white px-3 py-1.5 text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
