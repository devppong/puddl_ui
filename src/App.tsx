import React, { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Layout/Dashboard/Dashboard";
import Landing from "./Layout/Landing/Landing";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

// const MainContentWrapper = styled("div")(({ theme }) => ({
// 	flexGrow: 1,
// 	padding: theme.spacing(3),
// }));

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn")?true:false);

	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			console.log(tokenResponse);
			setIsLoggedIn(true);
			localStorage.setItem("isLoggedIn", 'true');
		},
	});

	const logout =() => {
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
