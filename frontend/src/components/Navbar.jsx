import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const primarySections = [
  "World",
  "Technology",
  "Business",
  "Finance",
  "Sports",
  "Entertainment",
  "Health",
  "Science"
];

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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/92 text-white shadow-[0_20px_60px_rgba(7,17,31,0.28)] glass-panel">
      <div className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-white/70 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ff465f]" />
            <span>Live Global Coverage</span>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <span>Current Chronicle World Service</span>
            <span>{today}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[92rem] flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-4">
          <Link to="/" className="group">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-sm bg-[#b80018] text-xl font-extrabold tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(184,0,24,0.35)]">
                CC
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.44em] text-white/55">
                  Global News Network
                </p>
                <p className="font-display text-3xl tracking-tight text-white transition group-hover:text-[#ffd9de] sm:text-4xl">
                  Current Chronicle
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            <span className="rounded-full border border-white/15 px-3 py-1">Trending now</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Markets</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Sport</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Entertainment</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-white px-4 py-2 text-[#07111f]"
                  : "rounded-full border border-white/15 px-4 py-2 text-white/78 transition hover:border-white/35 hover:text-white"
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
                      ? "rounded-full bg-[#b80018] px-4 py-2 text-white"
                      : "rounded-full border border-white/15 px-4 py-2 text-white/78 transition hover:border-white/35 hover:text-white"
                  }
                >
                  Newsroom
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:border-[#ff8d9b] hover:text-white"
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
                      ? "rounded-full bg-white px-4 py-2 text-[#07111f]"
                      : "rounded-full border border-white/15 px-4 py-2 text-white/78 transition hover:border-white/35 hover:text-white"
                  }
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-[#b80018] px-5 py-2 text-white shadow-[0_16px_30px_rgba(184,0,24,0.32)] transition hover:bg-[#d4112b]"
                >
                  Join Network
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/[0.04]">
        <div className="mx-auto max-w-[92rem] overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="shrink-0 rounded-full bg-[#d8aa48] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.34em] text-[#07111f]">
              Sections
            </span>
            <div className="hidden lg:flex flex-wrap gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/72">
              {primarySections.map((section) => (
                <span key={section} className="transition hover:text-white">
                  {section}
                </span>
              ))}
            </div>
            <div className="lg:hidden text-sm uppercase tracking-[0.2em] text-white/72">
              World • Tech • Finance • Sport • Entertainment
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
