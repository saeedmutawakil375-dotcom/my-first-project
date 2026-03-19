import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageMeta from "../hooks/usePageMeta";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: "Sign In",
    description:
      "Sign in to Atlas Wire to manage newsroom publishing, update stories, and follow live global coverage."
  });

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      showToast({
        title: "Signing In",
        message: "Checking your newsroom credentials.",
        type: "loading",
        duration: 1800
      });
      await login(formData);
      showToast({
        title: "Welcome Back",
        message: "You are signed in and ready to publish.",
        type: "success"
      });
      navigate("/newsroom");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      showToast({
        title: "Sign In Failed",
        message,
        type: "error",
        duration: 4500
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr] xl:items-stretch">
      <section className="animate-fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-[#07111f] text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
        <div className="h-full bg-[radial-gradient(circle_at_top,_rgba(216,170,72,0.22),_transparent_35%),linear-gradient(160deg,#07111f_0%,#0d223d_45%,#0d3b66_100%)] p-8 sm:p-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.4em] text-white/60">
            Member Access
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            Sign in to file stories, follow breaking desks, and manage live coverage.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">
            Returning contributors can publish updates, revise fast-moving reports, and keep
            pace with world, finance, sport, entertainment, and science from one desk.
          </p>
        </div>
      </section>

      <div className="space-y-6">
        <AuthForm
          title="Sign In"
          subtitle="Access the newsroom, publish professional coverage, and shape the global front page."
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
        <p className="text-center text-sm uppercase tracking-[0.18em] text-slate-500">
          Need an account?{" "}
          <Link to="/register" className="font-bold text-[#b80018]">
            Join the network
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
