import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import AssignmentIcon from "@mui/icons-material/Assignment";
import { Analytics, Dashboard, History, Settings } from "@mui/icons-material";

// const secondaryListItems = (
// 	<React.Fragment>
// 		<ListSubheader component="div" inset>
// 			Saved reports
// 		</ListSubheader>
// 		<ListItemButton>
// 			<ListItemIcon>
// 				<AssignmentIcon />
// 			</ListItemIcon>
// 			<ListItemText primary="Current month" />
// 		</ListItemButton>
// 		<ListItemButton>
// 			<ListItemIcon>
// 				<AssignmentIcon />
// 			</ListItemIcon>
// 			<ListItemText primary="Last quarter" />
// 		</ListItemButton>
// 		<ListItemButton>
// 			<ListItemIcon>
// 				<AssignmentIcon />
// 			</ListItemIcon>
// 			<ListItemText primary="Year-end sale" />
// 		</ListItemButton>
// 	</React.Fragment>
// );

export default function Sidebar(props: any) {
	return (
		<>
			<List component="nav">
				<React.Fragment>
					<ListItemButton
						onClick={() => {
							props.selectedComponent("playground");
						}}
					>
						<ListItemIcon>
							<Dashboard />
						</ListItemIcon>
						<ListItemText primary="Playground" />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							props.selectedComponent("promt-registry");
						}}
					>
						<ListItemIcon>
							<Analytics />
						</ListItemIcon>
						<ListItemText primary="Prompt Registry" />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							props.selectedComponent("analytics");
						}}
					>
						<ListItemIcon>
							<Analytics />
						</ListItemIcon>
						<ListItemText primary="Analytics" />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							props.selectedComponent("history");
						}}
					>
						<ListItemIcon>
							<History />
						</ListItemIcon>
						<ListItemText primary="History" />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							props.selectedComponent("settings");
						}}
					>
						<ListItemIcon>
							<Settings />
						</ListItemIcon>
						<ListItemText primary="Settings" />
					</ListItemButton>
				</React.Fragment>
				<Divider sx={{ my: 1 }} />
				{/* {secondaryListItems} */}
			</List>
		</>
	);
}
