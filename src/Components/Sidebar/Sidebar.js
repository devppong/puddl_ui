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
	ListAltOutlined,
	Settings,
} from "@mui/icons-material";
import { Button, IconButton, Snackbar } from "@mui/material";

export default function Sidebar(props) {
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const action = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<Close fontSize="small" />
			</IconButton>
		</React.Fragment>
	);
	return (
		<>
			<List component="nav">
				<React.Fragment>
					<ListItemButton
						// onClick={() => {
						// 	props.selectedComponent("playground");
						// }}
						onClick={handleClick}
						sx={{
							cursor: "no-drop",
						}}
					>
						<ListItemIcon>
							<AttractionsOutlined />
						</ListItemIcon>
						<ListItemText primary="Playground" />
					</ListItemButton>
					<ListItemButton
						// onClick={() => {
						// 	props.selectedComponent("promt-registry");
						// }}
						onClick={handleClick}
						sx={{
							cursor: "no-drop",
						}}
					>
						<ListItemIcon>
							<ListAltOutlined />
						</ListItemIcon>
						<ListItemText primary="Prompt Registry" />
					</ListItemButton>
					<ListItemButton
						// onClick={() => {
						// 	props.selectedComponent("history");
						// }}
						onClick={handleClick}
						sx={{
							cursor: "no-drop",
						}}
					>
						<ListItemIcon>
							<History />
						</ListItemIcon>
						<ListItemText primary="History" />
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
						<ListItemText primary="Analytics" />
					</ListItemButton>
					<ListItemButton
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
					</ListItemButton>
				</React.Fragment>
				<Divider sx={{ my: 1 }} />
				<Snackbar
					open={open}
					autoHideDuration={3000}
					onClose={handleClose}
					message="Coming Soon!"
					action={action}
				/>
				{/* {secondaryListItems} */}
			</List>
		</>
	);
}
