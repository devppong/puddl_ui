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
});

function Dashboard(props) {
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
				<AppBar position="absolute" open={open}>
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
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							component="h1"
							variant="h6"
							color="#2149D9"
							noWrap
							sx={{ flexGrow: 1 }}
						>
							Puddl
						</Typography>
						<IconButton color="inherit">
							<Badge badgeContent={4} color="secondary">
								<NotificationsIcon sx={{ color: "#2149D9" }} />
							</Badge>
						</IconButton>
						<IconButton
							sx={{ ml: "20px" }}
							aria-controls={openMenu ? "basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={openMenu ? "true" : undefined}
							onClick={handleUserMenuClick}
						>
							<Badge color="primary">
								<Person sx={{ color: "#2149D9" }} />
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
							<MenuItem onClick={handleUserMenuClose}>
								Profile
							</MenuItem>
							<MenuItem onClick={handleUserMenuClose}>
								My account
							</MenuItem>
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
				<Drawer variant="permanent" open={open}>
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
					<Sidebar selectedComponent={setSelectedComponent} />
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
						{selectedComponent === "playground" ? (
							<Playground />
						) : selectedComponent === "promt-registry" ? (
							<PromptRegistry />
						) : selectedComponent === "analytics" ? (
							<Analytics />
						) : selectedComponent === "history" ? (
							<History />
						) : selectedComponent === "settings" ? (
							<Settings />
						) : null}
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default Dashboard;
