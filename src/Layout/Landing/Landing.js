import React from "react";
import { Button, Stack, Toolbar, Typography } from "@mui/material";

function Landing(props) {
	return (
		<div>
			<Toolbar>
				<Typography
					component="h1"
					variant="h6"
					color="#2149D9"
					noWrap
					sx={{ flexGrow: 1 }}
				>
					Puddl
				</Typography>
				<Stack direction="row" spacing={5}>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "#2149D9",
						}}
					>
						docs
					</Button>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "#2149D9",
						}}
					>
						pricing
					</Button>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "#2149D9",
						}}
					>
						about
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							props.setLogin(true);
						}}
					>
						Sign in
					</Button>
				</Stack>
			</Toolbar>
		</div>
	);
}

export default Landing;
