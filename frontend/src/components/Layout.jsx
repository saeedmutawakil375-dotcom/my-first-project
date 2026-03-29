import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="news-shell min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[96rem] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <footer className="border-t border-white/8 bg-[#06111d]">
        <div className="mx-auto flex max-w-[96rem] flex-col gap-4 px-3 py-8 text-[#d4dceb] sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.34em] text-[#66e0c2]">
              SAEED DAILY
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              A modern social publication where people discover stories, watch videos, publish
              posts, and share what matters.
            </p>
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/42">
            Ready for desktop and mobile deployment
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
