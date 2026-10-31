import React, { useState } from "react";
import logo from "../assets/hero.png";
import { api, getApiError } from '../api/https'; // Correct Named Exports

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Loading and Notification states
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // API request using your Axios setup
            const response = await api.post('/login', { email, password });
            const resData = response.data; // Yeh aapka response object fetch karega

            if (resData.status === 'Success') {
                setSuccessMessage(resData.message || 'Login successful!');

                // 1. Data localStorage mein save karein (jaise interceptor ko chahiye)
                localStorage.setItem("token", resData.data.access_token);
                localStorage.setItem("user", JSON.stringify(resData.data.user));

                // 2. Role-based Redirection Logic
                const userRole = resData.data.user.role;

                setTimeout(() => {
                    if (userRole === "vendor") {
                        window.location.href = "/vendor/dashboard"; // Apne dashboard route ke mutabik change karein
                    } else if (userRole === "admin") {
                        window.location.href = "/admin/dashboard";
                    } else {
                        window.location.href = "/dashboard"; // Default route
                    }
                }, 1000); // 1.5 seconds ka buffer taaki user success message dekh sake
            } else {
                setErrorMessage(resData.message || 'Login failed. Please check your credentials.');
            }

        } catch (error) {
            // Aapka custom helper function exact backend error message nikalega
            const errorMsg = getApiError(error);
            setErrorMessage(errorMsg);
            console.error('Login Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-xl border border-[var(--border)] p-8">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
                </div>

                {/* Heading */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Welcome Back</h1>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Login to your account to continue</p>
                </div>

                {/* Dynamic Status Messages */}
                {errorMessage && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg text-center">
                        {successMessage}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]">
                            Email Address
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                            className="w-full h-12 px-4 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[var(--input-focus)] focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-[var(--text-primary)]">Password</label>
                            <a href="#" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]">
                                Forgot Password?
                            </a>
                        </div>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                            className="w-full h-12 px-4 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition focus:border-[var(--input-focus)] focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-lg bg-[var(--primary)] text-white font-semibold transition hover:bg-[var(--primary-hover)] active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                {/* Simple Tailwind Spinner */}
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : "Login"}
                    </button>

                </form>

                {/* Register Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-[var(--text-secondary)]">
                        Don't have an account?
                        <a href="#" className="ml-1 font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]">
                            Create Account
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;
