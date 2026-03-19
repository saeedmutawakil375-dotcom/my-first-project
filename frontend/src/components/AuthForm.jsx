const AuthForm = ({
  title,
  subtitle,
  formData,
  onChange,
  onSubmit,
  isRegister = false,
  loading,
  error
}) => {
  return (
    <div className="paper-panel mx-auto max-w-xl overflow-hidden rounded-[1.6rem] border border-[#d9cfba] shadow-[0_24px_60px_rgba(24,33,45,0.08)] sm:rounded-[2rem]">
      <div className="border-b border-[#d9cfba] bg-gradient-to-r from-[#18212d] via-[#243646] to-[#184c53] px-6 py-7 text-white sm:px-10 sm:py-8">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-white/65 sm:text-[0.72rem] sm:tracking-[0.4em]">
          Atlas Wire
        </p>
        <h1 className="mt-4 font-display text-[2.4rem] leading-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">{subtitle}</p>
      </div>

      <div className="p-6 sm:p-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {isRegister && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-[#d9cfba] bg-[#fffaf1] px-4 py-3 outline-none transition focus:border-[#a12c2f] focus:bg-white"
                  placeholder="Jordan Bennett"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                >
                  Correspondent Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-[#d9cfba] bg-[#fffaf1] px-4 py-3 outline-none transition focus:border-[#a12c2f] focus:bg-white"
                  placeholder="Reporter covering world affairs, markets, sport, and modern culture."
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              className="w-full rounded-2xl border border-[#d9cfba] bg-[#fffaf1] px-4 py-3 outline-none transition focus:border-[#a12c2f] focus:bg-white"
              placeholder="reporter@atlaswire.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              className="w-full rounded-2xl border border-[#d9cfba] bg-[#fffaf1] px-4 py-3 outline-none transition focus:border-[#a12c2f] focus:bg-white"
              placeholder="At least 6 characters"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#a12c2f] px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_16px_30px_rgba(161,44,47,0.22)] transition hover:bg-[#8f262a] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait..." : title}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
