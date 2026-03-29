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
    <div className="daily-card mx-auto max-w-xl overflow-hidden rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] shadow-[0_30px_70px_rgba(3,10,18,0.2)] sm:rounded-[2rem]">
      <div className="border-b border-white/10 bg-gradient-to-r from-[#07131f] via-[#0c2131] to-[#12324a] px-6 py-7 text-white sm:px-10 sm:py-8">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#8fe8d4] sm:text-[0.72rem] sm:tracking-[0.4em]">
          SAEED DAILY
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
                  className="w-full rounded-2xl border border-[rgba(5,18,28,0.1)] bg-white/80 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                  placeholder="Saeed Amankwah"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                >
                  Creator Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-[rgba(5,18,28,0.1)] bg-white/80 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                  placeholder="Creator sharing stories, explainers, videos, and grounded commentary."
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
              className="w-full rounded-2xl border border-[rgba(5,18,28,0.1)] bg-white/80 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
              placeholder="creator@saeeddaily.com"
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
              className="w-full rounded-2xl border border-[rgba(5,18,28,0.1)] bg-white/80 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
              placeholder="At least 6 characters"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-[#4c8df6] to-[#66e0c2] px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#041019] shadow-[0_16px_30px_rgba(76,141,246,0.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait..." : title}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
