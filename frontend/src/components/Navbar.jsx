import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createSectionPath, primarySections } from "../utils/newsSections";

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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(5,12,20,0.88)] text-white shadow-[0_26px_70px_rgba(0,0,0,0.28)] glass-panel">
      <div className="border-b border-white/8 bg-black/10">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-3 px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-white/68 sm:px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#66e0c2]" />
            <span>Stories, videos, and community feedback</span>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <span>SAEED DAILY DIGITAL MAGAZINE</span>
            <span>{today}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[96rem] flex-col gap-4 px-3 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-4">
          <Link to="/" className="group">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#66e0c2] to-[#4c8df6] text-lg font-extrabold tracking-[0.1em] text-[#041019] shadow-[0_14px_30px_rgba(76,141,246,0.28)] sm:h-14 sm:w-14 sm:text-xl">
                SD
              </div>
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-white/50 sm:text-[0.72rem] sm:tracking-[0.44em]">
                  Social News Platform
                </p>
                <p className="font-display text-[2rem] leading-none tracking-tight text-white transition group-hover:text-[#8debd4] sm:text-4xl">
                  SAEED DAILY
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] sm:text-sm sm:tracking-[0.18em]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#66e0c2] px-3 py-2 text-[#041019] sm:px-4"
                  : "rounded-full border border-white/15 px-3 py-2 text-white/78 transition hover:border-[#66e0c2]/50 hover:text-white sm:px-4"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/section/world"
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#66e0c2] px-3 py-2 text-[#041019] sm:px-4"
                  : "rounded-full border border-white/15 px-3 py-2 text-white/78 transition hover:border-[#66e0c2]/50 hover:text-white sm:px-4"
              }
            >
              Explore
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/studio"
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-full bg-[#4c8df6] px-3 py-2 text-white sm:px-4"
                      : "rounded-full border border-white/15 px-3 py-2 text-white/78 transition hover:border-[#66e0c2]/50 hover:text-white sm:px-4"
                  }
                >
                  Studio
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 px-3 py-2 text-white/80 transition hover:border-[#66e0c2]/50 hover:text-white sm:px-4"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-full bg-[#66e0c2] px-3 py-2 text-[#041019] sm:px-4"
                      : "rounded-full border border-white/15 px-3 py-2 text-white/78 transition hover:border-[#66e0c2]/50 hover:text-white sm:px-4"
                  }
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-[#4c8df6] px-4 py-2 text-white shadow-[0_16px_30px_rgba(76,141,246,0.28)] transition hover:bg-[#3c7add] sm:px-5"
                >
                  Join
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 bg-white/[0.04]">
        <div className="mx-auto max-w-[96rem] overflow-hidden px-3 py-3 sm:px-5 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="shrink-0 rounded-full bg-[#66e0c2] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[#041019] sm:text-[0.68rem] sm:tracking-[0.34em]">
              Sections
            </span>
            <div className="hidden flex-wrap gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/72 lg:flex">
              {primarySections.map((section) => (
                <NavLink
                  key={section}
                  to={createSectionPath(section)}
                  className={({ isActive }) =>
                    isActive ? "text-[#8debd4]" : "transition hover:text-white"
                  }
                >
                  {section}
                </NavLink>
              ))}
            </div>
            <div className="overflow-x-auto whitespace-nowrap text-[0.72rem] uppercase tracking-[0.18em] text-white/72 lg:hidden">
              World | Tech | Business | Finance | Sports | Entertainment
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
