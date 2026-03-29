import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageMeta from "../hooks/usePageMeta";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: "Create Account",
    description:
      "Join SAEED DAILY and start publishing articles, posts, videos, and feedback-driven stories."
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
        title: "Creating Account",
        message: "Setting up your SAEED DAILY profile.",
        type: "loading",
        duration: 1800
      });
      await register(formData);
      showToast({
        title: "Account Ready",
        message: "Your creator account is live.",
        type: "success"
      });
      navigate("/studio");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      showToast({
        title: "Registration Failed",
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
      <section className="animate-fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="h-full bg-[radial-gradient(circle_at_top,_rgba(76,141,246,0.12),_transparent_40%),linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] p-8 sm:p-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.4em] text-[#4c8df6]">
            Join the Platform
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
            Create your profile and start sharing content on SAEED DAILY.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Publish blogs, articles, social explainers, and video-backed posts for a modern audience.
          </p>
        </div>
      </section>

      <div className="space-y-6">
        <AuthForm
          title="Create Account"
          subtitle="Get your studio access and start publishing on SAEED DAILY."
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isRegister
          loading={loading}
          error={error}
        />
        <p className="text-center text-sm uppercase tracking-[0.18em] text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#4c8df6]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
