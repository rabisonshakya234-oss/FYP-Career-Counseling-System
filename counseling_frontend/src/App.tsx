// importing all the required modules
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";

import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import type React from "react";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProfilePage from "./pages/ProfilePage";
import CreateQuestionSetPage from "./pages/QuestionSet/CreateQuestionSetPage";
import ListQuestionSetPage from "./pages/QuestionSet/ListQuizSetPage";
import AttemptQuizPage from "./pages/QuestionSet/AttemptQuizPage";
import AnswerHistory from "./components/QuestionSet/AnswerHistroy";
import CounselorFeedbackForm from "./components/QuestionSet/CounselorFeedbackForm";
import RealtimeChatPage from "./pages/RealtimeChat/RealtimeChatPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DecisionFocusedCounseling from "./components/DecisionfocusCounseling";
import Footer from "./components/footer";

export interface IAuthState {
	isAuth: boolean;
	role: "admin" | "student" | "counselor" | "guest";
}

export interface IAuthContext extends IAuthState {
	setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>;
}

export interface JWTDecode {
	role: "admin" | "student" | "counselor";
	id: string;
}

export const AuthContext = createContext<IAuthContext>({
	isAuth: false,
	role: "guest",
	setAuthState: () => { },
});
function App() {
	const [authState, setAuthState] = useState<IAuthState>({
		isAuth: false,
		role: "guest",
	});
	const [isloading, setIsloading] = useState<boolean>(true);
	const [userId, setUserId] = useState<string>("");

	console.log("state => ", authState);

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		if (!accessToken) {
			setIsloading(false);
			return;
		}
		async function fetchData() {
			try {
				await axios.get("http://localhost:3000/api/verify/me", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				const { role, id }: JWTDecode = jwtDecode(accessToken as string);

				setAuthState((prev) => ({
					...prev,
					isAuth: true,
					role: role,
				}));
				setUserId(id);
			} catch (err) {
				localStorage.clear();
			} finally {
				setIsloading(false);
			}
		}
		fetchData(); // ✅ only once
	}, []);

	if (isloading) return <p>loading....</p>
	return (
		<AuthContext.Provider
			value={{
				isAuth: authState.isAuth,
				role: authState.role,
				setAuthState: setAuthState,
			}}
		>
			<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/about" element={<AboutPage />} />

				{/* Guest routes */}
				{authState?.role === "guest" && (
					<>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/signup" element={<SignUpPage />} />
						<Route path="/forget-password" element={<ForgetPasswordPage />} />
						<Route path="/reset-password/:token" element={<ResetPasswordPage/>} />
						
					</>
				)}

				{/* Authenticated Routes */}
				{authState.isAuth && (
					<>
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/profile/me" element={<ProfilePage />} />
						<Route path="/profile/:userId" element={<ProfilePage />} />
						<Route path="/chat" element={<RealtimeChatPage />} />
					</>
				)}

				{/* Authenticated Routes for students */}
				{authState.role === "student" && (
					<>
					<Route path="/questionset/list" element={<ListQuestionSetPage />} />
					<Route
						path="/questionset/:id/attempt"
						element={<AttemptQuizPage />}
						/>	
							<Route
							path="/student/attempt-history" element={<AnswerHistory role="student" userId={userId}/>}>
						</Route>

						{/* ✅ Add DecisionFocusedCounseling route for students */}
						<Route
							path="/student/decision"
							element={
								<DecisionFocusedCounseling
									decisionTitle="Choose Your Career"
									optionNames={["Software Engineer", "Data Scientist", "UI/UX Designer"]}
								/>
							}
						/>
					</>
				)}
			{/* Authenticated Routes for counselors*/}
				{authState.role === "counselor" && (
					<>
						<Route
							path="/counselor/questionset/create" element={<CreateQuestionSetPage />}>
						</Route>
						<Route
							path="/counselor/submissions" element={<AnswerHistory role="counselor" userId={userId}/>}>
						</Route>
						<Route
							path="/counselor/feedback" element={<CounselorFeedbackForm />}>
						</Route>
						{/* ✅ Add DecisionFocusedCounseling route for students */}
						<Route
							path="/counselor/decision"
							element={
								<DecisionFocusedCounseling
									decisionTitle="Choose Your Career"
									optionNames={["Full Stack Web Development", "Data Analyst", "UI/UX Designer", "Frontend Developer", "Backend Developer"]}
								/>
							}
						/>
					</>
				)}
			

				{/* Authenticated Routes for admin */}
			{/* {authState.role === "admin" && (
				<>
					<Route
						path="/admin/questionset/create" element={<CreateQuestionSetPage />}>
					</Route>
				</>
			)} */}
				
			<Route path="*" element={<p>Page Not Found</p>} />
			</Routes>
			<Footer/>
		</AuthContext.Provider >
	);
}

export default App;
