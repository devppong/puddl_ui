import React from "react";
import {
	Box,
	Container,
	Divider,
	Grid,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

function Playground() {
	return (
		<Grid container>
			<Grid item xs={9} sx={{ height: "100%", minHeight: "90vh" }}>
				<Typography variant="h6">
					Create a new prompt template
				</Typography>
				<Box
					component="form"
					sx={{
						width: "95%",
						border: "1px solid #c1c1c1",
						mx: "auto",
					}}
				>
					<TextField
						id="outlined-basic"
						variant="outlined"
						placeholder="Title"
						sx={{
							width: "100%",
							"& .MuiOutlinedInput-notchedOutline": {
								borderWidth: 0,
							},
						}}
					/>
					<TextField
						id="outlined-multiline-static"
						multiline
						rows={20}
						placeholder="Write a prompt...&#10;{input-name1} and {input-name2} are in the prompt."
						sx={{
							width: "100%",
							"& .MuiOutlinedInput-notchedOutline": {
								borderWidth: 0,
							},
						}}
					/>
					<Divider />
					<Typography variant="body1" sx={{ ml: "15px" }}>
						<b>Input Variables:</b>
					</Typography>
				</Box>
			</Grid>
			<Grid
				item
				xs={3}
				sx={{ bgcolor: "blue", height: "100%", minHeight: "90vh" }}
			></Grid>
		</Grid>
	);
}

export default Playground;
