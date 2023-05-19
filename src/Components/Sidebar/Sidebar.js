import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import {
	AttractionsOutlined,
	Close,
	ClosedCaption,
	History,
	InsertChartOutlined,
	LightbulbOutlined,
	ListAltOutlined,
	Settings,
} from "@mui/icons-material";
import {
	Button,
	IconButton,
	Snackbar,
	Popover,
	Typography,
} from "@mui/material";

export default function Sidebar(props) {
	// const [open, setOpen] = React.useState(false);

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<>
			<List component='nav'>
				<React.Fragment>
					<ListItemButton
						// onClick={() => {
						// 	props.selectedComponent("playground");
						// }}
						sx={{
							cursor: "no-drop",
						}}
						aria-owns={open ? "mouse-over-popover" : undefined}
						aria-haspopup='true'
						onMouseEnter={handlePopoverOpen}
						onMouseLeave={handlePopoverClose}
					>
						<ListItemIcon>
							<AttractionsOutlined />
						</ListItemIcon>
						<ListItemText primary='Playground' />
					</ListItemButton>
					<ListItemButton
						// onClick={() => {
						// 	props.selectedComponent("promt-registry");
						// }}
						sx={{
							cursor: "no-drop",
						}}
						aria-owns={open ? "mouse-over-popover" : undefined}
						aria-haspopup='true'
						onMouseEnter={handlePopoverOpen}
						onMouseLeave={handlePopoverClose}
					>
						<ListItemIcon>
							<ListAltOutlined />
						</ListItemIcon>
						<ListItemText primary='Prompt Registry' />
					</ListItemButton>
					<ListItemButton
						// onClick={() => {
						// 	props.selectedComponent("history");
						// }}
						sx={{
							cursor: "no-drop",
						}}
						aria-owns={open ? "mouse-over-popover" : undefined}
						aria-haspopup='true'
						onMouseEnter={handlePopoverOpen}
						onMouseLeave={handlePopoverClose}
					>
						<ListItemIcon>
							<History />
						</ListItemIcon>
						<ListItemText primary='History' />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							props.setSelectedComponent("analytics");
						}}
						sx={{
							color:
								props.selectedComponent === "analytics"
									? "#1d4ed8"
									: "none",
						}}
					>
						<ListItemIcon>
							<InsertChartOutlined
								sx={{
									color:
										props.selectedComponent === "analytics"
											? "#1d4ed8"
											: "none",
								}}
							/>
						</ListItemIcon>
						<ListItemText primary='Analytics' />
					</ListItemButton>
					<ListItemButton
						onClick={() =>
							window.open(
								"https://puddl.canny.io/feature-requests"
							)
						}
					>
						<ListItemIcon>
							<LightbulbOutlined />
						</ListItemIcon>
						<ListItemText primary='Feature Requests' />
					</ListItemButton>
					{/* <ListItemButton
						// onClick={() => {
						// 	props.selectedComponent("settings");
						// }}
						onClick={handleClick}
						sx={{
							cursor: "no-drop",
						}}
					>
						<ListItemIcon>
							<Settings />
						</ListItemIcon>
						<ListItemText primary="Settings" />
					</ListItemButton> */}
				</React.Fragment>
				<Divider sx={{ my: 1 }} />
				<Popover
					id='mouse-over-popover'
					sx={{
						pointerEvents: "none",
					}}
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: "center",
						horizontal: "right",
					}}
					transformOrigin={{
						vertical: "center",
						horizontal: "left",
					}}
					onClose={handlePopoverClose}
					disableRestoreFocus
				>
					<Typography sx={{ p: 1, color: "#1d4ed8" }}>
						Coming Soon!
					</Typography>
				</Popover>
				{/* <Snackbar
					open={open}
					autoHideDuration={3000}
					onClose={handleClose}
					message="Coming Soon!"
					action={action}
				/> */}
				{/* {secondaryListItems} */}
			</List>
		</>
	);
}
