import * as React from "react";
import { useEffect, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
	CssBaseline,
	Drawer as MuiDrawer,
	Box,
	AppBar as MuiAppBar,
	Toolbar,
	Typography,
	IconButton,
	Badge,
	Container,
	Divider,
	Menu,
	MenuItem,
	Stack,
	Button,
} from "@mui/material";
import {
	Menu as MenuIcon,
	ChevronLeft as ChevronLeftIcon,
	Notifications as NotificationsIcon,
	Person,
} from "@mui/icons-material";
import Sidebar from "../../Components/Sidebar/Sidebar";
import History from "../../Components/History/History";
import Playground from "../../Components/Playground/Playground";
import Settings from "../../Components/Settings/Settings";
import Analytics from "../../Components/Analytics/Analytics";
import PromptRegistry from "../../Components/PromptRegistry/PromptRegistry";
import logo from "./../../assets/puddl-logo.png";
import Coffee from "./../../assets/buymeacoffee.svg";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	"& .MuiDrawer-paper": {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: "border-box",
		...(!open && {
			overflowX: "hidden",
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

const mdTheme = createTheme({
	palette: {
		primary: {
			main: "#ffffff",
		},
	},
	typography: {
		button: {
			textTransform: "none",
		},
	},
});

function Dashboard(props) {
	const [matchesXs, setMatchesXs] = useState(true);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 992px)");
		setMatchesXs(mediaQuery.matches);

		const handleChange = (event) => {
			setMatchesXs(event.matches);
		};
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	useEffect(() => {
		console.log(matchesXs);
	}, [matchesXs]);

	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	const [selectedComponent, setSelectedComponent] = useState(
		sessionStorage.getItem("selected-nav-item")
			? sessionStorage.getItem("selected-nav-item")
			: "analytics"
	);

	useEffect(() => {
		console.log(selectedComponent);
		sessionStorage.setItem("selected-nav-item", selectedComponent);
	}, [selectedComponent]);

	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = Boolean(anchorEl);
	const handleUserMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleUserMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<ThemeProvider theme={mdTheme}>
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar position="absolute" open={open && !matchesXs}>
					<Toolbar
						sx={{
							pr: "24px", // keep right padding when drawer closed
						}}
					>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							sx={{
								marginRight: "36px",
								...(open && { display: "none" }),
								display: { xs: "none", md: "inline-block" },
							}}
						>
							<MenuIcon />
						</IconButton>
						<Stack
							direction={"row"}
							sx={{ flexGrow: 1 }}
							alignItems={"center"}
						>
							<img
								src={logo}
								alt="logo"
								style={{ height: "2rem", display: "inline" }}
							/>
							<Typography
								variant="h5"
								color="#1d4ed8"
								noWrap
								fontSize={{sm:"1.5rem",xs:"1.2rem"}}
								fontWeight={"bold"}
								marginX={"0.75rem"}
							>
								Puddl
							</Typography>
						</Stack>

						<a
							href="https://www.buymeacoffee.com/Puddl"
							target="_blank"
							rel="noreferrer"
							style={{ borderRadius: "50%" }}
						>
							<Button
								variant="contained"
								sx={{
									backgroundColor: "#1d4ed8",
									":hover": {
										bgcolor: "#1d3ecc",
									},
								}}
							>
								<img
									src={Coffee}
									style={{ height: "1.8rem" }}
									alt=""
								/>
								<Typography
									px={{sm:"0.5rem",xs:"0.35rem"}}
									sx={{
										color: "white",
										fontFamily:
											"'Cookie', cursive !important",
										fontWeight: "normal",
										fontSize: {
											xs: "0.8rem",
											sm: "1.2rem",
										},
									}}
								>
									Buy me a coffee
								</Typography>
							</Button>
						</a>
						{/* <IconButton color="inherit">
							<Badge badgeContent={4} color="secondary">
								<NotificationsIcon sx={{ color:"#1d4ed8" }} />
							</Badge>
						</IconButton> */}
						<IconButton
							sx={{ ml: "20px" }}
							aria-controls={openMenu ? "basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={openMenu ? "true" : undefined}
							onClick={handleUserMenuClick}
						>
							<Badge color="primary">
								<Person sx={{ color: "#1d4ed8" }} />
							</Badge>
						</IconButton>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={openMenu}
							onClose={handleUserMenuClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
						>
							{/* <MenuItem onClick={handleUserMenuClose} sx={{cursor:"no-drop"}}>
								Profile
							</MenuItem>
							<MenuItem onClick={handleUserMenuClose} sx={{cursor:"no-drop"}}>
								My account
							</MenuItem> */}
							<MenuItem
								onClick={() => {
									props.setLogout();
								}}
							>
								Logout
							</MenuItem>
						</Menu>
					</Toolbar>
				</AppBar>
				<Drawer variant="permanent" open={open && !matchesXs}>
					<Toolbar
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
							px: [1],
						}}
					>
						<IconButton onClick={toggleDrawer}>
							<ChevronLeftIcon />
						</IconButton>
					</Toolbar>
					<Divider />
					<Sidebar
						setSelectedComponent={setSelectedComponent}
						selectedComponent={selectedComponent}
					/>
				</Drawer>
				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: "100vh",
						overflow: "auto",
					}}
				>
					<Toolbar />
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
						{/* {selectedComponent === "playground" ? (
							<Playground />
						) : selectedComponent === "promt-registry" ? (
							<PromptRegistry />
						) : selectedComponent === "analytics" ? (
							<Analytics />
						) : selectedComponent === "history" ? (
							<History />
						) : selectedComponent === "settings" ? (
							<Settings />
						) : null} */}
						<Analytics />
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default Dashboard;
