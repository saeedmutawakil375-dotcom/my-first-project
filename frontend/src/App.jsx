import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewsroomPage from "./pages/NewsroomPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/articles/:id" element={<ArticleDetailsPage />} />
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
