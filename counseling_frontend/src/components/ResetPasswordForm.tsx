import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPasswordForm() {
	const { token } = useParams();
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		axios
			.post(`http://localhost:3000/users/reset-password/${token}`, {
				newPassword: password,
				confirmPassword:password
			})
			.then(() => {
				setMessage("Password reset successful");
				setError("");

				setTimeout(() => {
					navigate("/login");
				}, 2000);
			})
			.catch((error) => {
				const errMsg =
					error?.response?.data?.message || "An error occurred";
				setError(errMsg);
				setMessage("");
			});
	};

	return (
		<div className="login-form">
			<div className="row">
				<div className="col-sm-12 col-md-6 col-lg-6 col-12 my-5 py-5 bg-login-gradient text-white">
					<h1 className="text-capitalize">
						reset password
					</h1>

					<form onSubmit={handleSubmit}>
						<div className="login-form-container">
							<div className="mb-3 my-5 py-5">
								<label
									htmlFor="password"
									className="form-label fs-4 text-white"
								>
									New Password:
								</label>
								<input
									type="password"
									className="form-control"
									id="password"
									placeholder="Enter new password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>

							{message && (
								<p className="text-success fw-semibold fs-4 text-white">
									{message}
								</p>
							)}
							{error && (
								<p className="text-danger fw-semibold fs-4">
									{error}
								</p>
							)}

							<button
								type="submit"
								className="btn btn-primary btn-gradient fs-3 text-white my-2 fw-bold"
							>
								Reset Password
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default ResetPasswordForm;