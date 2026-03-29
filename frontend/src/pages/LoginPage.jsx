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
      "Sign in to SAEED DAILY to publish posts, watch videos, and join the community feed."
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
        message: "Checking your SAEED DAILY account.",
        type: "loading",
        duration: 1800
      });
      await login(formData);
      showToast({
        title: "Welcome Back",
        message: "You are signed in and ready to post.",
        type: "success"
      });
      navigate("/studio");
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
        <div className="h-full bg-[radial-gradient(circle_at_top,_rgba(102,224,194,0.22),_transparent_35%),linear-gradient(160deg,#07111f_0%,#0d223d_45%,#0d3b66_100%)] p-8 sm:p-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.4em] text-white/60">
            Member Access
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            Sign in to publish, search, share, and interact on SAEED DAILY.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">
            Returning members can publish stories, attach YouTube videos, respond to feedback, and manage their creator profile from one place.
          </p>
        </div>
      </section>

      <div className="space-y-6">
        <AuthForm
          title="Sign In"
          subtitle="Access SAEED DAILY, manage your studio, and keep your posts moving."
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
        <p className="text-center text-sm uppercase tracking-[0.18em] text-slate-500">
          Need an account?{" "}
          <Link to="/register" className="font-bold text-[#4c8df6]">
            Join SAEED DAILY
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
