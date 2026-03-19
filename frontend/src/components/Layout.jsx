import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="news-shell min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[94rem] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
};

export default Layout;
