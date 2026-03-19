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
    <div className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-[#07111f] via-[#0d223d] to-[#0d3b66] px-8 py-8 text-white sm:px-10">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.4em] text-white/65">
          Current Chronicle
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-white/72">{subtitle}</p>
      </div>

      <div className="p-8 sm:p-10">
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#b80018] focus:bg-white"
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#b80018] focus:bg-white"
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
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#b80018] focus:bg-white"
              placeholder="reporter@currentchronicle.com"
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
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#b80018] focus:bg-white"
              placeholder="At least 6 characters"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#b80018] px-4 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white shadow-[0_16px_30px_rgba(184,0,24,0.22)] transition hover:bg-[#d4112b] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait..." : title}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
