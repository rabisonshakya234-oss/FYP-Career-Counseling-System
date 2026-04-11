// import React from 'react'
import { useState } from "react";
import Logo from "../assets/Images/logo.png";
import axios from "axios";
import { NavLink } from "react-router-dom";


/* ── Toast Types ── */
type ToastType = "success" | "error" | "info";
interface Toast {
	id: number;
	type: ToastType;
	title: string;
	message: string;
}

/* ── Toast Portal — holds all toasts ── */
function ToastPortal({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
	return (
		<div className="su-toast-portal">
			{toasts.map((t) => (
				<ToastItem key={t.id} toast={t} onRemove={onRemove} />
			))}
		</div>
	);
}

/* ── Single Toast Item ── */
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
	const [exiting, setExiting] = useState(false);

	const dismiss = () => {
		setExiting(true);
		setTimeout(() => onRemove(toast.id), 280);
	};

	const iconMap: Record<ToastType, string> = {
		success: "bx bx-check-circle",
		error: "bx bx-error-circle",
		info: "bx bx-info-circle",
	};

	return (
		<div className={`su-toast su-toast--${toast.type}${exiting ? " su-toast--exit" : ""}`}>
			<i className={`su-toast-icon ${iconMap[toast.type]}`} />
			<div className="su-toast-body">
				<p className="su-toast-title">{toast.title}</p>
				<p className="su-toast-msg">{toast.message}</p>
			</div>
			<button className="su-toast-close" onClick={dismiss} aria-label="Dismiss">
				<i className="bx bx-x" />
			</button>
		</div>
	);
}

/* ── Main Component (your original code, untouched) ── */
function SignUpForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [toasts, setToasts] = useState<Toast[]>([]); // 👈 added

	/* ── Toast helpers ── */
	const addToast = (type: ToastType, title: string, message: string) => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, type, title, message }]);
		setTimeout(() => removeToast(id), 4500);
	};
	const removeToast = (id: number) =>
		setToasts((prev) => prev.filter((t) => t.id !== id));

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};
	const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// checking if password and confirmPassword matches before submitting
		if (password !== confirmPassword) {
			addToast("error", "Password Mismatch", "Password and Confirm Password do not match"); // 👈 replaced alert
			return;
		}

		const finalData = {
			name,
			email,
			password,
			confirmPassword,
			// ✅ ADDED: Sending role as student so backend can auto-assign a counselor on registration
			role: "student",
		};

		axios
			.post("http://localhost:3000/users/create", finalData)
			.then((response) => {
				addToast("success", "Registered!", "User registered successfully"); // 👈 replaced alert
			})
			.catch((error) => {
				console.log("error =>", error);
				const errors = error?.response?.data?.message || "An error occurred";
				addToast("error", "Sign Up Failed", errors); // 👈 replaced alert
			});
	};

	return (
		<div className="sign-up-form my-5 m-auto d-flex align-items-center justify-content-center min-vh-100">

			{/* Toast notifications */}
			<ToastPortal toasts={toasts} onRemove={removeToast} /> {/* 👈 added */}

			<div className="row">

				{/* ── Left: Brand panel ── */}
				<div className="col-sm-12 col-md-6 col-lg-6 col-12 my-5 py-5 bg-signup-gradient text-white">
					<h1 className="text-capitalize">
						welcome to career counseling system
					</h1>
					<div className="logo-placeholder">
						<img
							src={Logo}
							alt="Logo"
							className="img-fluid img-thumbnail rounded-circle w-75 my-5"
						/>
					</div>
				</div>

				{/* ── Right: Form panel ── */}
				<div className="col-sm-12 col-md-6 col-lg-6 col-12 my-5 py-5 bg-signup-gradient text-white">
					<h1 className="text-capitalize">welcome to sign up page</h1>
					<form onSubmit={handleSubmit}>
						<div className="signup-form-container">

							{/* Name */}
							<div className="mb-3 my-5 py-5">
								<label htmlFor="Name" className="form-label text-white fs-4">
									<i className="bx bx-user" /> Name: {/* 👈 boxicon added */}
								</label>
								<input
									type="text"
									className="form-control"
									id="name"
									placeholder="Enter your name"
									value={name}
									onChange={handleNameChange}
								/>
							</div>

							{/* Email */}
							<div className="mb-3">
								<label htmlFor="Email" className="form-label text-white fs-4">
									<i className="bx bx-envelope" /> Email: {/* 👈 boxicon added */}
								</label>
								<input
									type="Email"
									className="form-control"
									id="email"
									placeholder="Enter your email"
									value={email}
									onChange={handleEmailChange}
								/>
							</div>

							{/* Password */}
							<div className="mb-3 my-5">
								<label htmlFor="Password" className="form-label text-white fs-4">
									<i className="bx bx-lock-alt" /> Password: {/* 👈 boxicon added */}
								</label>
								<input
									type="Password"
									className="form-control"
									id="password"
									placeholder="Enter your password"
									value={password}
									onChange={handlePasswordChange}
								/>
							</div>

							{/* confrim password input field to verify confirm password matches with password before login*/}
							<div className="mb-3 my-5">
								<label htmlFor="confirmPassword" className="form-label text-white fs-4">
									<i className="bx bx-lock-open-alt" /> Confirm Password: {/* 👈 boxicon added */}
								</label>
								<input
									type="Password"
									className="form-control"
									id="confirmPassword"
									placeholder="Confirm your password"
									value={confirmPassword}
									onChange={handleConfirmPasswordChange}
								/>
							</div>

							<button type="submit" className="btn btn-primary fs-3 fw-bold my-2">
								<i className="bx bx-user-plus" /> Sign Up {/* 👈 boxicon added */}
							</button>

						</div>

						{/* login link */}
						<p className="text-center mt-6 pt-2 fw-semibold text-capitalize fs-5">
							already have an account?{""}
						</p>
						<NavLink
							to="/login"
							className="fw-semibold text-capitalize text-black fs-5"
						>
							Sign in here
						</NavLink>
					</form>
				</div>

			</div>
		</div>
	);
}

export default SignUpForm;