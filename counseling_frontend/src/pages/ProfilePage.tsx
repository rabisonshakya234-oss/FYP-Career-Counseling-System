// import React from 'react'

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";

/* ─────────────────────────────────────────
   Toast Notification System
───────────────────────────────────────── */
let toastCounter = 0;

type Toast = {
	id: number;
	title: string;
	message: string;
	type: "success" | "warning" | "error";
	exiting?: boolean;
};

function ToastContainer({
	toasts,
	onRemove,
}: {
	toasts: Toast[];
	onRemove: (id: number) => void;
}) {
	return (
		<div className="profile-page-toast-wrapper">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`profile-page-toast${toast.type === "error" ? " profile-page-toast-error" : ""}${toast.type === "warning" ? " profile-page-toast-warning" : ""}${toast.exiting ? " profile-page-toast-exit" : ""}`}
				>
					<div className="profile-page-toast-icon">
						<i className={
							toast.type === "success" ? "bx bx-check-circle"
								: toast.type === "warning" ? "bx bx-info-circle"
									: "bx bx-x-circle"
						} />
					</div>
					<div className="profile-page-toast-body">
						<p className="profile-page-toast-title">{toast.title}</p>
						<p className="profile-page-toast-msg">{toast.message}</p>
					</div>
					<button
						className="profile-page-toast-close"
						onClick={() => onRemove(toast.id)}
						aria-label="Dismiss"
					>
						<i className="bx bx-x" />
					</button>
					<div className="profile-page-toast-bar" />
				</div>
			))}
		</div>
	);
}

function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: number) => {
		setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
		setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
	}, []);

	const addToast = useCallback(
		(title: string, message: string, type: Toast["type"] = "success") => {
			const id = ++toastCounter;
			setToasts((prev) => [...prev, { id, title, message, type }]);
			setTimeout(() => removeToast(id), 3500);
		},
		[removeToast]
	);

	return { toasts, addToast, removeToast };
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */

type ProfileData = {
	name: string;
	bio: string;
	skills: string;
	education: any[];
	experience: any[];
	certifications: any[];
	github: string;
	linkedin: string;
	portfolioUrl: string;
	profilePictureUrl: string;
	cvURL: string;
	interest: string;
	careerGoals: string;
	level: string;
};

type ProfileFormData = Omit<ProfileData, "education" | "experience" | "certifications"> & {
	education: string;
	experience: string;
	certifications: string;
};

function ProfilePage() {
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const [editing, setediting] = useState(false);
	const [formData, setformData] = useState<ProfileFormData>({
		name: "",
		bio: "",
		skills: "",
		education: "",
		experience: "",
		certifications: "",
		github: "",
		linkedin: "",
		portfolioUrl: "",
		profilePictureUrl: "",
		cvURL: "",
		interest: "",
		careerGoals: "",
		level: "Beginner",
	});
	const { toasts, addToast, removeToast } = useToast();

	// fetching profile data
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const token = localStorage.getItem("accessToken");

				const response = await fetch("http://localhost:3000/api/profile/me", {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await response.json();

				if (data?.profile) {
					const profile = data.profile;
					const formattedProfile = {
						name: profile.name || "",
						bio: profile.bio || "",
						skills: profile.skills ? profile.skills.map((s) => s.name).join(",") : "",
						education: profile.education || [],
						experience: profile.experience || [],
						certifications: profile.certifications || [],
						github: profile.github || "",
						linkedin: profile.linkedin || "",
						portfolioUrl: profile.portfolioUrl || "",
						profilePictureUrl: profile.profilePictureUrl || "",
						cvURL: profile.cvURL || "",
						interest: profile.interest ? profile.interest.join(",") : "",
						careerGoals: profile.careerGoals || "",
						level: profile.skills?.[0]?.level || "Beginner",
					};
					const formattedFormData: ProfileFormData = {
						...formattedProfile,
						education: profile.education ? profile.education.join(",") : "",
						experience: profile.experience ? profile.experience.join(",") : "",
						certifications: profile.certifications ? profile.certifications.join(",") : "",
					};
					setProfileData(formattedProfile);
					setformData(formattedFormData);
				}
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};
		fetchProfile();
	}, []);

	// Handle form changes
	function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setformData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	// Updating Profile Data
	async function updateProfileData(formData: ProfileFormData) {
		try {
			const token = localStorage.getItem("accessToken");

			const skillsArray = (formData.skills).split(",").map((skill) => ({
				name: skill.trim(),
				level: formData.level || "Beginner",
			}));

			await axios.put(
				"http://localhost:3000/api/profile/me",
				{
					name: formData.name,
					bio: formData.bio,
					skills: skillsArray,
					interest: (formData.interest).split(",").map((interest) => interest.trim()),
					education: [],
					experience: [],
					certifications: [],
					github: formData.github,
					linkedin: formData.linkedin,
					portfolioUrl: formData.portfolioUrl,
					profilePictureUrl: formData.profilePictureUrl,
					cvURL: formData.cvURL,
					careerGoals: formData.careerGoals,
					level: formData.level,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setProfileData((prev) => prev ? {
				...prev,
				name: formData.name,
				bio: formData.bio,
				skills: formData.skills,
				github: formData.github,
				linkedin: formData.linkedin,
				portfolioUrl: formData.portfolioUrl,
				profilePictureUrl: formData.profilePictureUrl,
				cvURL: formData.cvURL,
				interest: formData.interest,
				careerGoals: formData.careerGoals,
				level: formData.level,
			} : null);
			setediting(false);
			addToast("Profile Updated", "Your profile has been saved successfully.", "success");
		} catch (error) {
			console.error("Error updating profile:", error);
			addToast("Update Failed", "Something went wrong. Please try again.", "error");
		}
	}

	//  Submitting Profile Details
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		updateProfileData(formData);
	}

	return (
		<>
			<ToastContainer toasts={toasts} onRemove={removeToast} />

			<div className="profile-page bg-light min-vh-100 py-5">
				<div className="page-header">
					<h1 className="my-5 text-capitalize display-4 fw-bold mb-3 text-white">welcome to career Profile Dashboard</h1>
					<p className=" text-capitalize text-white my-4 fs-5 fw-semibold">
						manage your professional information about you, your interest and your career goals
					</p>
					<div className="container">
						{!editing && profileData && (
							<>
								<div className="stats-cards">
									<div className="stat-card">
										<div className="stat-label">Skill Level</div>
										<div className="stat-value">{profileData.level || "Beginner"}</div>
									</div>
									<div className="stat-card">
										<div className="stat-label">Skills</div>
										<div className="stat-value">
											{typeof profileData.skills === "string" ? profileData.skills.split(",").filter((s) => s.trim()).length : 0}
										</div>
									</div>
									<div className="stat-card">
										<div className="stat-label">Interests</div>
										<div className="stat-value">
											{typeof profileData.interest === "string"
												? profileData.interest.split(",").filter((i) => i.trim()).length
												: 0}
										</div>
									</div>
								</div>

								<div className="profile-card">
									<div style={{ textAlign: "center", marginBottom: "24px" }}>
										<h2 style={{ fontSize: "1.75rem", fontWeight: "600", margin: "0 0 8px 0", color: "black" }} className="my-5">{profileData.name}</h2>

										{profileData.bio && <p style={{ fontSize: "1rem", color: "black", margin: 0, fontWeight: "600" }} className="text-black">{profileData.bio}</p>}
									</div>
									<div className="section">
										<div className="section-header">
											<div className="section-icon icon-green">✓</div>
											<h3 className="section-title">Skills & Expertise</h3>
										</div>
										<div className="skills-grid">
											{typeof profileData.skills === "string" &&
												profileData.skills.split(",").map(
													(skill, i) =>
														skill.trim() && (
															<span key={i} className="skill-badge">
																{skill.trim()}
															</span>
														)
												)}
										</div>
									</div>

									<div className="section">
										<div className="section-header">
											<div className="section-icon icon-blue">ℹ</div>
											<h3 className="section-title">Personal Information</h3>
										</div>
										<div className="info-grid">
											{profileData.interest && (
												<div className="info-card">
													<div className="info-icon">💡</div>
													<div className="info-content">
														<div className="info-label fs-6">Interests</div>
														<div className="info-value fs-6">{profileData.interest}</div>
													</div>
												</div>
											)}
											{profileData.careerGoals && (
												<div className="info-card">
													<div className="info-icon">🎯</div>
													<div className="info-content">
														<div className="info-label fs-6">Career Goals</div>
														<div className="info-value fs-6">{profileData.careerGoals}</div>
													</div>
												</div>
											)}
										</div>
									</div>

									<div className="section">
										<div className="section-header">
											<div className="section-icon icon-purple">🔗</div>
											<h3 className="section-title">Professional Links</h3>
										</div>
										<div className="links-grid">
											{profileData.github && (
												<div className="link-card">
													<div className="link-icon-wrapper github-bg">G</div>
													<NavLink
														to="https://github.com/RabisonRajShakya/Animated-Professional-Portfolio-Website"
														target="_blank"
													>
														<span className="link-text">{profileData.github}</span>
													</NavLink>
												</div>
											)}
											{profileData.linkedin && (
												<div className="link-card">
													<div className="link-icon-wrapper linkedin-bg">in</div>
													<NavLink to="https://www.linkedin.com/in/rabison-raj-shakya-7521a7370/" target="_blank">
														<span className="link-text">{profileData.linkedin}</span>
													</NavLink>
												</div>
											)}
											{profileData.portfolioUrl && (
												<div className="link-card">
													<div className="link-icon-wrapper portfolio-bg">P</div>
													<NavLink to="https://www.rabisonrajshakya.com.np/" target="_blank">
														<span className="link-text">{profileData.portfolioUrl}</span>
													</NavLink>
												</div>
											)}
										</div>
									</div>

									<div className="section">
										<button onClick={() => setediting(true)} className="edit-btn">
											✏️ Edit Profile
										</button>
									</div>
								</div>
							</>
						)}
						<div>
							<>
								{editing && (
									<div className="form-container">
										<h2>Edit Profile</h2>
										<div>
											<div className="form-group">
												<label>Full Name</label>
												<input
													name="name"
													value={formData.name}
													onChange={handleFormChange}
													placeholder="Name"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>Bio</label>
												<textarea
													name="bio"
													value={formData.bio}
													onChange={handleFormChange}
													placeholder="Bio"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>Skills (comma separated)</label>
												<input
													name="skills"
													value={formData.skills}
													onChange={handleFormChange}
													placeholder="Skills (comma separated)"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>Skill Level</label>
												<select name="level" value={formData.level} onChange={handleFormChange} className="form-control">
													<option value="Beginner">Beginner</option>
													<option value="Intermediate">Intermediate</option>
													<option value="Advanced">Advanced</option>
												</select>
											</div>

											<div className="form-group">
												<label>Education</label>
												<input
													name="education"
													value={formData.education}
													onChange={handleFormChange}
													placeholder="Education"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>Experience</label>
												<input
													name="experience"
													value={formData.experience}
													onChange={handleFormChange}
													placeholder="Experience"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>Certifications</label>
												<input
													name="certifications"
													value={formData.certifications}
													onChange={handleFormChange}
													placeholder="Certifications"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>GitHub URL</label>
												<input
													name="github"
													value={formData.github}
													onChange={handleFormChange}
													placeholder="GitHub URL"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>LinkedIn URL</label>
												<input
													name="linkedin"
													value={formData.linkedin}
													onChange={handleFormChange}
													placeholder="LinkedIn URL"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>Portfolio URL</label>
												<input
													name="portfolioUrl"
													value={formData.portfolioUrl}
													onChange={handleFormChange}
													placeholder="Portfolio URL"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>CV URL</label>
												<input
													name="cvURL"
													value={formData.cvURL}
													onChange={handleFormChange}
													placeholder="CV URL"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>Interests (comma separated)</label>
												<input
													name="interest"
													value={formData.interest}
													onChange={handleFormChange}
													placeholder="Interests (comma separated)"
													className="form-control"
												/>
											</div>

											<div className="form-group">
												<label>Career Goals</label>
												<textarea
													name="careerGoals"
													value={formData.careerGoals}
													onChange={handleFormChange}
													placeholder="Career Goals"
													className="form-control"
												/>
											</div>

											<div className="form-actions">
												<button type="button" onClick={handleSubmit} className="btn btn-primary">
													Save Changes
												</button>
												<button type="button" onClick={() => setediting(false)} className="btn btn-secondary">
													Cancel
												</button>
											</div>
										</div>
									</div>
								)}
							</>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ProfilePage;