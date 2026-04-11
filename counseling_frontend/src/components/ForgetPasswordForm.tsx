// import React from 'react'
import { useState, useCallback } from "react";
// import Logo from "../assets/Images/logo.png";
import axios from "axios";
import { NavLink } from "react-router-dom";

/* ─────────────────────────────────────────
   Toast Notification System
───────────────────────────────────────── */

interface Toast {
	id: number;
	title: string;
	message: string;
	type: "success" | "error";
	exiting?: boolean;
}

interface ToastContainerProps {
	toasts: Toast[];
	onRemove: (id: number) => void;
}

let toastCounter = 0;

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
	return (
		<div className="login-form-toast-wrapper">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`login-form-toast${toast.type === "error" ? " login-form-toast-error" : ""}${toast.exiting ? " login-form-toast-exit" : ""}`}
				>
					<div className="login-form-toast-icon">
						<i
							className={
								toast.type === "success"
									? "bx bx-check-circle"
									: "bx bx-x-circle"
							}
						/>
					</div>
					<div className="login-form-toast-body">
						<p className="login-form-toast-title">{toast.title}</p>
						<p className="login-form-toast-msg">{toast.message}</p>
					</div>
					<button
						className="login-form-toast-close"
						onClick={() => onRemove(toast.id)}
						aria-label="Dismiss"
					>
						<i className="bx bx-x" />
					</button>
					<div className="login-form-toast-bar" />
				</div>
			))}
		</div>
	);
}

function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: number) => {
		setToasts((prev) =>
			prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
		);
		setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
	}, []);

	const addToast = useCallback(
		(title: string, message: string, type: "success" | "error" = "success") => {
			const id = ++toastCounter;
			setToasts((prev) => [...prev, { id, title, message, type }]);
			setTimeout(() => removeToast(id), 3200);
		},
		[removeToast]
	);

	return { toasts, addToast, removeToast };
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
function ForgetPasswordForm() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const { toasts, addToast, removeToast } = useToast();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		axios
			.post("http://localhost:3000/users/forgot-password", { email })

			.then(() => {
				// const token = response.data.accessToken;
				// localStorage.setItem("accessToken", token);
				setMessage("Reset link sent to your email");
				setError("");
				addToast("Email Sent", "Reset link sent to your email.", "success");
			})
			.catch((error) => {
				console.log("error =>", error);
				const errMsg = error?.response?.data?.message || "An error occurred";
				setError(errMsg);
				setMessage("");
				addToast("Request Failed", errMsg, "error");
			});
	};

	return (
		<>
			<ToastContainer toasts={toasts} onRemove={removeToast} />

			<div className="forgot-password my-5 m-auto d-flex align-items-center justify-content-center min-vh-100">
				<div className="row">
					{/* ── Left Panel ── */}
					<div className="col-sm-12 col-md-6 col-lg-6 col-12 my-5 py-5 bg-forgot-password-gradient text-white">
						{/* Brand badge */}
						<div className="forgot-password-brand">
							<div className="forgot-password-brand-dot">C</div>
							<span>Career Counseling</span>
						</div>

						<h1 className="text-capitalize">
							welcome to career counseling system
						</h1>
						{/* <div className="logo-placeholder">
              <img
                src={Logo}
                alt="Logo"
                className="img-fluid img-thumbnail rounded-circle w-75 my-5"
              />
            </div> */}

						{/* Decorative feature list */}
						<ul className="forgot-password-features">
							<li>
								<i className="bx bx-shield-quarter" />
								Secure password recovery
							</li>
							<li>
								<i className="bx bx-envelope" />
								Instant email delivery
							</li>
							<li>
								<i className="bx bx-lock-open-alt" />
								Regain access in minutes
							</li>
						</ul>
					</div>

					{/* ── Right Panel ── */}
					<div className="col-sm-12 col-md-6 col-lg-6 col-12 my-5 py-5 bg-forgot-password-gradient text-white">
						<div className="forgot-password-form-card">
							{/* Card header */}
							<div className="forgot-password-form-card-header">
								<div className="forgot-password-form-eyebrow">
									<i className="bx bx-lock-alt" />
									Account Recovery
								</div>
								<h1 className="text-capitalize">forget password</h1>
								<p className="forgot-password-form-card-desc">
									Enter your registered email and we'll send you a link to reset
									your password.
								</p>
							</div>

							<form onSubmit={handleSubmit}>
								<div className="forgot-password-form-container">
									<div className="forgot-password-form-field mb-3 my-5 py-5">
										<label
											htmlFor="Email"
											className="form-label fs-4 text-white"
										>
											Email address:
										</label>
										<div className="forgot-password-form-input-wrap">
											<i className="bx bx-envelope" />
											<input
												type="email"
												className="form-control"
												id="email"
												placeholder="Enter your registered Email"
												value={email}
												onChange={handleEmailChange}
												required
											/>
										</div>
									</div>

									{/* showing feedback message instead of alert */}
									{message && (
										<p className="forgot-password-form-message-success text-success fw-semibold fs-4 text-black">
											<i className="bx bx-check-circle" />
											{message}
										</p>
									)}
									{error && (
										<p className="forgot-password-form-message-error text-danger fw-semibold fs-4">
											<i className="bx bx-error-circle" />
											{error}
										</p>
									)}

									<button
										type="submit"
										className="forgot-password-form-submit-btn btn btn-primary btn-gradient fs-3 text-white my-2 fw-bold"
									>
										<i className="bx bx-send" />
										Send Reset Link
									</button>
								</div>

								<div className="forgot-password-form-divider">
									<span>or</span>
								</div>

								<div className="forgot-password-form-back-link">
									<p className="text-center mt-6 pt-2 fw-semibold fs-5">
										Remember your password?{""}
									</p>
									<NavLink
										to="/login"
										className="forgot-password-form-navlink fw-semibold text-capitalize text-white fs-5"
									>
										<i className="bx bx-arrow-back" />
										login here
									</NavLink>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ForgetPasswordForm;