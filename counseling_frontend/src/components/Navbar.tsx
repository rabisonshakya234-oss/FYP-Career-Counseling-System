// importing all the required modules
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext, type IAuthContext } from "../App";
import axios from "axios";
import { socket } from "../Socket/Socket";

function Navbar() {
	const { isAuth, role, setAuthState } = useContext<IAuthContext>(AuthContext);
	const [showSearch, setShowSearch] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const logoutHandler = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("userId");
		localStorage.removeItem("role");

		socket.disconnect(); // disconnect from socket on logout
		window.location.reload();
	};

	const toggleSearchBar = () => {
		setShowSearch(!showSearch); // toggle search bar visibility
	};

	// ✅ ADDED SEARCH FUNCTION
	const handleSearch = async (value: string) => {
		setSearchQuery(value);

		if (!value) {
			setSearchResults([]);
			return;
		}

		try {
			const res = await axios.get(
				`http://localhost:3000/api/search?q=${value}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				}
			);

			setSearchResults(res.data);

			const q = value.toLowerCase();

			// General pages
			if (q.includes("home")) window.location.href = "/";
			if (q.includes("about")) window.location.href = "/about";
			if (q.includes("chat")) window.location.href = "/chat";
			if (q.includes("profile")) window.location.href = "/profile";

			// Counselor routes
			if (role === "counselor") {
				if (q.includes("create"))
					window.location.href = "/counselor/questionset/create";
				if (q.includes("attempt"))
					window.location.href = "/counselor/submissions";
				if (q.includes("feedback"))
					window.location.href = "/counselor/feedback";
				if (q.includes("decision"))
					window.location.href = "/counselor/decision";
			}

			// Student routes
			if (role === "student") {
				if (q.includes("question"))
					window.location.href = "/questionset/list";
				if (q.includes("attempt"))
					window.location.href = "/student/attempt-history";
				if (q.includes("decision"))
					window.location.href = "/student/decision";
			}
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div>
			<nav className="navbar navbar-expand-lg navbar-light bg-primary bg-gradient text-white fixed-top">
				<div className="container-fluid">
					<NavLink
						className="navbar-brand text-capitalize text-white fs-4 fw-medium"
						to="/"
					>
						<i className="bx bxs-graduation me-2"></i>
						career counseling system
					</NavLink>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav mx-auto mb-2 mb-lg-0">
							<li className="nav-item px-2">
								<NavLink
									className="nav-link active text-white fs-4 fw-medium"
									aria-current="page"
									to="/"
								>
									<i className="bx bx-home-alt me-1"></i>
									Home
								</NavLink>
							</li>
							<li className="nav-item px-2">
								<NavLink
									className="nav-link text-capitalize text-white fs-4 fw-medium"
									to="/about"
								>
									<i className="bx bx-info-circle me-1"></i>
									about
								</NavLink>
							</li>
							{isAuth ? (
								<>
									{/* <li className="nav-item dropdown px-3">
										<NavLink
											className="nav-link dropdown-toggle text-capitalize text-white fs-4 fw-medium"
											to="#"
											id="navbarDropdown"
											role="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											counselors
										</NavLink>
										<ul
											className="dropdown-menu"
											aria-labelledby="navbarDropdown"
										>
											<li>
												<a className="dropdown-item" href="#">
													Action
												</a>
											</li>
											<li>
												<a className="dropdown-item" href="#">
													Another action
												</a>
											</li>
											<li>
												<hr className="dropdown-divider" />
											</li>
											<li>
												<a className="dropdown-item" href="#">
													Something else here
												</a>
											</li>
										</ul>
									</li> */}
									<li className="nav-item px-2">
										<NavLink
											className="nav-link text-capitalize text-white fs-4 fw-medium"
											to="/profile"
										>
											<i className="bx bx-user me-1"></i>
											profile
										</NavLink>
									</li>
									<li className="nav-item px-2">
										<NavLink
											className="nav-link text-capitalize text-white fs-4 fw-medium"
											to="/chat"
										>
											<i className="bx bx-chat me-1"></i>
											chat
										</NavLink>
									</li>

									{/* {isAuth && role === "admin" && (
										<li className="nav-item px-3">
											<NavLink
												className="nav-link text-capitalize text-white fs-4 fw-medium"
												to="/admin/questionset/create"
											>
												create question set
											</NavLink>
										</li>
									)} */}
									{isAuth && role === "counselor" && (
										<>
											<li className="nav-item px-2">
												<NavLink
													className="nav-link text-capitalize text-white fs-4 fw-medium"
													to="/counselor/questionset/create"
												>
													<i className="bx bx-plus-circle me-1"></i>
													create question set
												</NavLink>
											</li>
											<li className="nav-item px-2">
												<NavLink
													className="nav-link text-capitalize text-white fs-4 fw-medium"
													to="/counselor/submissions"
												>
													<i className="bx bx-history me-1"></i>
													view attempt history
												</NavLink>
											</li>
											{/* <li className="nav-item px-2">
												<NavLink
													className="nav-link text-capitalize text-white fs-4 fw-medium"
													to="/counselor/feedback"
												>
													<i className="bx bx-message-square-dots me-1"></i>
													feedback
												</NavLink>
											</li> */}
											<li className="nav-item px-2">
												<NavLink
													className="nav-link text-capitalize text-white fs-4 fw-medium"
													to="/counselor/decision"
												>
													<i className="bx bx-message-square-dots me-1 text-capitalize">
														decision
													</i>
												</NavLink>
											</li>
										</>
									)}
									{isAuth && role === "student" && (
										<>
											<li className="nav-item px-2">
												<NavLink
													className="nav-link text-capitalize text-white fs-4 fw-medium"
													to="/questionset/list"
												>
													<i className="bx bx-list-ul me-1"></i>
													question set
												</NavLink>
											</li>
											<li className="nav-item px-2">
												<NavLink
													className="nav-link text-capitalize text-white fs-4 fw-medium"
													to="/student/attempt-history"
												>
													<i className="bx bx-history me-1"></i>
													view attempt history
												</NavLink>
											</li>
											<li className="nav-item px-2">
												<NavLink
													className="nav-link text-capitalize text-white fs-4 fw-medium"
													to="/student/decision"
												>
													<i className="bx bx-history me-1 text-capitalize">
														decision
													</i>
												</NavLink>
											</li>
										</>
									)}
									<li className="nav-item px-2">
										<button
											className="btn btn-primary text-white fs-4 fw-medium"
											onClick={logoutHandler}
										>
											<i className='bx bx-door-open fs-5'>

											</i>

										</button>
									</li>
								</>
							) : (
								<>
									<li className="nav-item px-3">
										<NavLink
											className="nav-link text-capitalize text-white fs-4 fw-medium"
											to="/login"
										>
											<i className="bx bx-log-in fs-5">
												Login
											</i>

										</NavLink>
									</li>
									<li className="nav-item px-3">
										<NavLink
											className="nav-link text-capitalize text-white fs-4 fw-medium"
											to="/signup"
										>
											<i className="bx bx-user-plus fs-5 text-capitalize">
												sign up
											</i>
										</NavLink>
									</li>
								</>
							)}
						</ul>
						<div className="d-flex align-items-center position-relative">
							{showSearch && (
								<input
									className="form-control me-2"
									type="search"
									placeholder="Search"
									aria-label="Search"
									value={searchQuery}
									onChange={(e) => handleSearch(e.target.value)}
								/>
							)}
							<i
								className="bx bx-search fs-4 ms-2"
								onClick={toggleSearchBar} // ✅ MODIFIED: toggle on click
								style={{ cursor: "pointer" }}
							></i>
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
}

export default Navbar;
