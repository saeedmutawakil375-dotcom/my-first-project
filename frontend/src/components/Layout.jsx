import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="news-shell min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[92rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;
