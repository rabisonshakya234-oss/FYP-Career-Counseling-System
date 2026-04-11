// import React from 'react'
import { useContext, useState } from "react";
import Logo from "../assets/Images/logo.png";
import { AuthContext, type IAuthContext } from "../App";
import axios from "axios";
import { NavLink } from "react-router-dom";

/* ─────────────────────────────────────────
   TOAST TYPES
   Toast can be one of 3 types: success, error, info
───────────────────────────────────────── */
type ToastType = "success" | "error" | "info";

/* Each toast has an id, type, title and message */
interface Toast {
	id: number;
	type: ToastType;
	title: string;
	message: string;
}

/* ─────────────────────────────────────────
   TOAST PORTAL
   This is the container that holds all toasts
   It sits fixed on the top-right of the screen
───────────────────────────────────────── */
function ToastPortal({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
	return (
		<div className="login-form-toast-portal">
			{/* Loop through all toasts and render each one */}
			{toasts.map((t) => (
				<ToastItem key={t.id} toast={t} onRemove={onRemove} />
			))}
		</div>
	);
}

/* ─────────────────────────────────────────
   TOAST ITEM
   A single toast popup (success / error / info)
───────────────────────────────────────── */
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {

	/* Controls the exit (fade-out) animation */
	const [exiting, setExiting] = useState(false);

	/* When X is clicked: start exit animation, then remove after 280ms */
	const dismiss = () => {
		setExiting(true);
		setTimeout(() => onRemove(toast.id), 280);
	};

	/* Icon class based on toast type (uses Boxicons) */
	const iconMap: Record<ToastType, string> = {
		success: "bx bx-check-circle",  // green check
		error: "bx bx-error-circle",  // red error
		info: "bx bx-info-circle",   // blue info
	};

	return (
		<div className={`login-form-toast login-form-toast--${toast.type}${exiting ? " login-form-toast--exit" : ""}`}>

			{/* Left icon */}
			<i className={`login-form-toast-icon ${iconMap[toast.type]}`} />

			{/* Title and message */}
			<div className="login-form-toast-body">
				<p className="login-form-toast-title">{toast.title}</p>
				<p className="login-form-toast-msg">{toast.message}</p>
			</div>

			{/* Close (X) button */}
			<button className="login-form-toast-close" onClick={dismiss} aria-label="Dismiss">
				<i className="bx bx-x" />
			</button>

		</div>
	);
}

/* ─────────────────────────────────────────
   MAIN LOGIN FORM COMPONENT
───────────────────────────────────────── */
function LoginForm() {

	/* Form input states */
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [showPw, setShowPw] = useState(false);   // toggle password visibility
	const [loading, setLoading] = useState(false);   // show spinner while API calls
	const [toasts, setToasts] = useState<Toast[]>([]); // list of active toasts

	/* Get auth state from global context (App.tsx) */
	const { isAuth, setAuthState } = useContext<IAuthContext>(AuthContext);

	/* ── Add a new toast to the screen ── */
	const addToast = (type: ToastType, title: string, message: string) => {
		const id = Date.now(); // unique id using timestamp
		setToasts((prev) => [...prev, { id, type, title, message }]);
		setTimeout(() => removeToast(id), 4500); // auto-remove after 4.5 seconds
	};

	/* ── Remove a toast by its id ── */
	const removeToast = (id: number) =>
		setToasts((prev) => prev.filter((t) => t.id !== id));

	/* ── Update password state on input change ── */
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	/* ── Update email state on input change ── */
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	/* ── Handle form submission (Login API call) ── */
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // prevent page reload
		const finalData = { email, password };
		console.log("finalData =>", finalData);

		setLoading(true); // show spinner on button

		/* Send email & password to backend */
		axios
			.post("http://localhost:3000/users/login", finalData)
			.then((response) => {
				console.log("response =>", response);

				const token = response.data.accessToken;

				/* Save token and userId in localStorage for future requests */
				localStorage.setItem("accessToken", token);
				localStorage.setItem("userId", response.data.userId);
				localStorage.setItem("role", response.data.role); // save role for conditional rendering

				/* Update global auth state with role from server */
				setAuthState((prev) => ({
					...prev,
					isAuth: true,
					role: response.data.role,
				}));

				/* Show success toast */
				addToast("success", "Welcome back!", "You have been logged in successfully.");

				/* Redirect to home page after 1.2 seconds */
				setTimeout(() => { window.location.href = "/"; }, 1200);
			})
			.catch((error) => {
				console.log("error =>", error);

				/* Show error message from server or fallback message */
				const errors = error?.response?.data?.message || "An error occurred";
				addToast("error", "Login failed", errors);
			})
			.finally(() => setLoading(false)); // always hide spinner at the end
	};

	return (
		<>
			{/* Toast notifications — rendered at top-right of screen */}
			<ToastPortal toasts={toasts} onRemove={removeToast} />

			<div className="login-form">
				<div className="login-form-card">

					{/* ── Left: Brand panel ── */}
					<div className="login-form-brand">
						<div className="login-form-brand-inner">
							<div className="login-form-logo-wrap">
								<img src={Logo} alt="Logo" />
							</div>
							<h1 className="login-form-brand-title">Welcome to Career Counseling System</h1>
							<p className="login-form-brand-sub">
								Guiding you toward the future you deserve — one step at a time.
							</p>
							<span className="login-form-brand-badge">
								<i className="bx bx-shield-quarter" />
								Secure &amp; Trusted Platform
							</span>
						</div>
					</div>

					{/* ── Right: Form panel ── */}
					<div className="login-form-form-panel">
						<div className="login-form-form-header">
							<h2 className="login-form-form-title">Sign in to your <span>account</span></h2>
						</div>

						<form onSubmit={handleSubmit}>

							{/* Email input */}
							<div className="login-form-field">
								<label htmlFor="email" className="login-form-label">
									<i className="bx bx-envelope" /> Email address
								</label>
								<div className="login-form-input-wrap">
									<input
										type="email"
										id="email"
										placeholder="you@example.com"
										value={email}
										onChange={handleEmailChange}
										autoComplete="email"
										required
									/>
								</div>
							</div>

							{/* Password input with show/hide toggle */}
							<div className="login-form-field">
								<label htmlFor="password" className="login-form-label">
									<i className="bx bx-lock-alt" /> Password
								</label>
								<div className="login-form-input-wrap">
									<input
										type={showPw ? "text" : "password"} // toggle between text and password
										id="password"
										placeholder="Enter your password"
										value={password}
										onChange={handlePasswordChange}
										autoComplete="current-password"
										required
									/>
									{/* Eye icon to show/hide password */}
									<button
										type="button"
										className="login-form-pw-toggle"
										onClick={() => setShowPw((v) => !v)}
										aria-label={showPw ? "Hide password" : "Show password"}
									>
										<i className={`bx ${showPw ? "bx-hide" : "bx-show"}`} />
									</button>
								</div>
							</div>

							{/* Forgot password link */}
							<NavLink to="/forget-password" className="login-form-forgot">
								Forgot password?
							</NavLink>

							{/* Submit button — shows spinner when loading */}
							<button type="submit" className="login-form-btn-submit" disabled={loading}>
								{loading ? (
									<>
										<span className="login-form-spinner" />
										Signing in…
									</>
								) : (
									<>
										<i className="bx bx-log-in" />
										Sign In
									</>
								)}
							</button>

							{/* Divider line with "or" text */}
							<div className="login-form-divider"><span>or</span></div>

							{/* Link to signup page */}
							<p className="login-form-signup-row">
								Don't have an account?
								<NavLink to="/signup">Create one free</NavLink>
							</p>

						</form>
					</div>

				</div>
			</div>
		</>
	);
}

export default LoginForm;