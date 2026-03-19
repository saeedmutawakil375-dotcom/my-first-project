import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f8f4ed]/95 backdrop-blur">
      <div className="border-b border-black/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-black/55">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Global Edition</span>
          <span>{today}</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link to="/" className="inline-block">
            <div className="border-l-8 border-[#b80018] pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#b80018]">
                Daily Briefing
              </p>
              <p className="font-display text-4xl font-bold tracking-tight text-black sm:text-5xl">
                Current Chronicle
              </p>
            </div>
          </Link>
          <p className="mt-3 max-w-2xl text-sm text-black/65">
            A fast-moving editorial front page powered by your publishing platform.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-black/60">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-[#b80018]" : "transition hover:text-black"
            }
          >
            Front Page
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/newsroom"
                className={({ isActive }) =>
                  isActive ? "text-[#b80018]" : "transition hover:text-black"
                }
              >
                Newsroom
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="border border-black/15 bg-black px-4 py-2 text-white transition hover:bg-[#b80018]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-[#b80018]" : "transition hover:text-black"
                }
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className="border border-[#b80018] bg-[#b80018] px-4 py-2 text-white transition hover:bg-[#8f0012]"
              >
                Join Desk
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
