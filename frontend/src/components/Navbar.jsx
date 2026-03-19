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
    <header className="sticky top-0 z-40 border-b border-[#d7ccb5] bg-[rgba(24,33,45,0.92)] text-white shadow-[0_20px_60px_rgba(24,33,45,0.22)] glass-panel">
      <div className="border-b border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-[94rem] items-center justify-between gap-3 px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-white/70 sm:px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ba8d3f]" />
            <span>Live Global Coverage</span>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <span>Atlas Wire World Service</span>
            <span>{today}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[94rem] flex-col gap-4 px-3 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-4">
          <Link to="/" className="group">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-sm bg-[#a12c2f] text-lg font-extrabold tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(161,44,47,0.28)] sm:h-14 sm:w-14 sm:text-xl">
                AW
              </div>
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-white/55 sm:text-[0.72rem] sm:tracking-[0.44em]">
                  Global News Network
                </p>
                <p className="font-display text-[2rem] leading-none tracking-tight text-white transition group-hover:text-[#f2dec2] sm:text-4xl">
                  Atlas Wire
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="hidden flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/70 sm:flex">
            <span className="rounded-full border border-white/15 px-3 py-1">Breaking</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Markets</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Sport</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Culture</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] sm:text-sm sm:tracking-[0.18em]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#f6f0e4] px-3 py-2 text-[#18212d] sm:px-4"
                  : "rounded-full border border-white/15 px-3 py-2 text-white/78 transition hover:border-[#f2dec2]/70 hover:text-white sm:px-4"
              }
            >
              Home
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/newsroom"
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-full bg-[#a12c2f] px-3 py-2 text-white sm:px-4"
                      : "rounded-full border border-white/15 px-3 py-2 text-white/78 transition hover:border-[#f2dec2]/70 hover:text-white sm:px-4"
                  }
                >
                  Newsroom
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 px-3 py-2 text-white/80 transition hover:border-[#f2dec2]/70 hover:text-white sm:px-4"
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
                      ? "rounded-full bg-[#f6f0e4] px-3 py-2 text-[#18212d] sm:px-4"
                      : "rounded-full border border-white/15 px-3 py-2 text-white/78 transition hover:border-[#f2dec2]/70 hover:text-white sm:px-4"
                  }
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-[#a12c2f] px-4 py-2 text-white shadow-[0_16px_30px_rgba(161,44,47,0.28)] transition hover:bg-[#8e2428] sm:px-5"
                >
                  Join Network
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/[0.04]">
        <div className="mx-auto max-w-[94rem] overflow-hidden px-3 py-3 sm:px-5 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="shrink-0 rounded-full bg-[#ba8d3f] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[#18212d] sm:text-[0.68rem] sm:tracking-[0.34em]">
              Sections
            </span>
            <div className="hidden lg:flex flex-wrap gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/72">
              {primarySections.map((section) => (
                <NavLink
                  key={section}
                  to={createSectionPath(section)}
                  className={({ isActive }) =>
                    isActive ? "text-[#f2dec2]" : "transition hover:text-white"
                  }
                >
                  {section}
                </NavLink>
              ))}
            </div>
            <div className="overflow-x-auto whitespace-nowrap text-[0.72rem] uppercase tracking-[0.18em] text-white/72 lg:hidden">
              World | Tech | Business | Finance | Sport | Entertainment
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
