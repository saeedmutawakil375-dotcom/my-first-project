import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

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
      await login(formData);
      navigate("/newsroom");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
      <section className="border border-black/10 bg-black p-8 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
          Member Access
        </p>
        <h2 className="mt-5 font-display text-4xl leading-tight">
          Sign in to file stories and join the editorial desk.
        </h2>
        <p className="mt-5 text-lg leading-8 text-white/75">
          Returning contributors can publish fresh coverage, update developing pieces, and
          weigh in on reader perspectives from one place.
        </p>
      </section>

      <div className="space-y-6">
        <AuthForm
          title="Sign In"
          subtitle="Access the newsroom, publish articles, and take part in the community conversation."
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
        <p className="text-center text-sm uppercase tracking-[0.18em] text-black/55">
          Need an account?{" "}
          <Link to="/register" className="font-semibold text-[#b80018]">
            Join the desk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
