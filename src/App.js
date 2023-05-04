import React, { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Layout/Dashboard/Dashboard";
import Landing from "./Layout/Landing/Landing";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

import axios from "axios";

// const MainContentWrapper = styled("div")(({ theme }) => ({
// 	flexGrow: 1,
// 	padding: theme.spacing(3),
// }));

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("isLoggedIn") ? true : false
	);
	const [accessToken, setAccessToken] = useState(
		sessionStorage.getItem("access_token")
	);

	async function fetchUserInfo(token) {
		const response = await fetch(
			"https://www.googleapis.com/oauth2/v2/userinfo",
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		return await response.json();
	}
	useEffect(() => {
		// const email_url = "https://www.googleapis.com/auth/userinfo.email";

		if (accessToken) {
			// console.log(accessToken);
			async function fetchEmail() {
				const user = await fetchUserInfo(accessToken);
				return user["email"];
			}
			fetchEmail().then((res) => {
				try {
					fetch("http://puddlapi.puddl.io/prompt/saveEmail", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({"email":res}),
					});
				} catch (error) {
					console.log(error);
				}
			});
		}
	}, [accessToken]);

	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			// console.log(tokenResponse);
			setAccessToken(tokenResponse["access_token"]);
			setIsLoggedIn(true);
			localStorage.setItem("isLoggedIn", "true");
		},
	});

	const logout = () => {
		googleLogout();
		setIsLoggedIn(false);
		localStorage.removeItem("isLoggedIn");
	};

	return isLoggedIn ? (
		<Dashboard setLogout={logout} />
	) : (
		<Landing setLogin={login} />
	);
}

export default App;