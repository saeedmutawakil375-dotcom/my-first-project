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
    <div className="mx-auto max-w-lg border border-black/10 bg-[#fbf8f2] p-8 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b80018]">
        Current Chronicle
      </p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-black">{title}</h1>
      <p className="mt-3 text-lg leading-7 text-black/65">{subtitle}</p>

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {isRegister && (
          <>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={onChange}
                className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
                placeholder="Jordan Bennett"
                required
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
              >
                Author Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={onChange}
                className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
                placeholder="Independent reporter covering technology, media, and digital culture."
              />
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
            placeholder="reporter@chronicle.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
            placeholder="At least 6 characters"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-[#b80018] bg-[#b80018] px-4 py-3 font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8f0012] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Please wait..." : title}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
