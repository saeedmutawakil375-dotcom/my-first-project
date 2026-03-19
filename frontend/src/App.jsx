import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewsroomPage from "./pages/NewsroomPage";
import RegisterPage from "./pages/RegisterPage";
import SectionPage from "./pages/SectionPage";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/section/:sectionSlug" element={<SectionPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/articles/:slugOrId" element={<ArticleDetailsPage />} />
        <Route
          path="/newsroom"
          element={
            <ProtectedRoute>
              <NewsroomPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
