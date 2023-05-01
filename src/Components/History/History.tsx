import React, { useState, useEffect } from "react";
import {
	Typography,
	Select,
	MenuItem,
	TextField,
	Container,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SelectChangeEvent } from "@mui/material";
import Box from "@mui/material/Box";
import { EditOutlined } from "@mui/icons-material";

function History() {
	const [templates, setTemplates] = useState([
		{
			value: "template1",
			label: "Template 1",
			columns: [
				{ field: "input1", headerName: "Input1", width: 200 },
				{ field: "input2", headerName: "Input2", width: 200 },
				{ field: "output", headerName: "Output", width: 200 },
				{
					field: "rating",
					headerName: "Rating",
					width: 200,
					renderCell: renderRatingCell,
				},
				{
					field: "correction",
					headerName: "Correction",
					width: 200,
					renderCell: renderCorrectionCell,
				},
			],
			rows: [
				{
					id: 1,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
				{
					id: 2,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "bad",
					correction: "something",
				},
				{
					id: 3,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "bad",
					correction: "something",
				},
				{
					id: 4,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
				{
					id: 5,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
			],
		},
		{
			value: "template2",
			label: "Template 2",
			columns: [
				{ field: "input1", headerName: "Input1", width: 200 },
				{ field: "input2", headerName: "Input2", width: 200 },
				{ field: "input3", headerName: "Input3", width: 200 },
				{ field: "output", headerName: "Output", width: 200 },
				{
					field: "rating",
					headerName: "Rating",
					width: 200,
					renderCell: renderRatingCell,
				},
				{
					field: "correction",
					headerName: "Correction",
					width: 200,
					renderCell: renderCorrectionCell,
				},
			],
			rows: [
				{
					id: 1,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					input3: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
				{
					id: 2,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					input3: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
				{
					id: 3,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					input3: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
				{
					id: 4,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					input3: "lorem ipsum",
					output: "lorem ipsum",
					rating: "bad",
					correction: "something",
				},
				{
					id: 5,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					input3: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
			],
		},
		{
			value: "template3",
			label: "Template 3",
			columns: [
				{ field: "input1", headerName: "Input1", width: 200 },
				{ field: "input2", headerName: "Input2", width: 200 },
				{ field: "output", headerName: "Output", width: 200 },
				{
					field: "rating",
					headerName: "Rating",
					width: 200,
					renderCell: renderRatingCell,
				},
				{
					field: "correction",
					headerName: "Correction",
					width: 200,
					renderCell: renderCorrectionCell,
				},
			],
			rows: [
				{
					id: 1,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "bad",
					correction: "something",
				},
				{
					id: 2,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
				{
					id: 3,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
				{
					id: 4,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "bad",
					correction: "something",
				},
				{
					id: 5,
					input1: "lorem ipsum",
					input2: "lorem ipsum",
					output: "lorem ipsum",
					rating: "good",
					correction: "",
				},
			],
		},
	]);
	const [template, setTemplate] = useState(templates[0]);

	useEffect(() => {
		setTemplate(templates[0]);
	}, [templates]);
	// const [template, setTemplate] = useState(templates[0]);

	// useEffect(() => {
	// 	console.log("change in templates: \n", templates);
	// 	const templateIdx = templates.findIndex(
	// 		(tmplt) => tmplt.value === template.value
	// 	);
	// 	setTemplate(templates[templateIdx]);
	// }, [templates]);

	// useEffect(() => {
	// 	console.log("change in selected template: \n", template);
	// }, [template]);

	function handleTemplateChange(event: SelectChangeEvent) {
		const selectedTemplate = templates.find(
			(tmp) => tmp.value === event.target.value
		);

		if (selectedTemplate) {
			setTemplate(selectedTemplate);
		}
	}

	function renderRatingCell(params: any) {
		const handleChange = (event: SelectChangeEvent) => {
			const selectedOption = event.target.value;
			let newArr = [];

			for (let tmp of templates) {
				if (tmp.value === template.value) {
					let Arr2 = [];
					for (let item of tmp.rows) {
						if (item.id === params.id) {
							Arr2.push({
								...item,
								rating: selectedOption,
							});
						} else {
							Arr2.push(item);
						}
					}
					newArr.push({ ...tmp, rows: Arr2 });
				} else {
					newArr.push(tmp);
				}
			}
			setTemplates(newArr);
		};

		return (
			<Select
				native
				value={params.value}
				onChange={handleChange}
				sx={{
					border: "none",
					bgcolor: params.value === "good" ? "green" : "red",
				}}
			>
				<option key={"good"} value={"good"}>
					{"Good"}
				</option>
				<option key={"bad"} value={"bad"}>
					{"Bad"}
				</option>
			</Select>
		);
	}

	function renderCorrectionCell(params: any) {
		// const handleChange = (event: SelectChangeEvent) => {
		// 	const selectedOption = event.target.value;
		// 	let newArr = [];

		// 	for (let tmp of templates) {
		// 		if (tmp.value === template.value) {
		// 			let Arr2 = [];
		// 			for (let item of tmp.rows) {
		// 				if (item.id === params.id) {
		// 					Arr2.push({
		// 						...item,
		// 						rating: selectedOption,
		// 					});
		// 				} else {
		// 					Arr2.push(item);
		// 				}
		// 			}
		// 			newArr.push({ ...tmp, rows: Arr2 });
		// 		} else {
		// 			newArr.push(tmp);
		// 		}
		// 	}
		// 	setTemplates(newArr);
		// };

		const row_item = template.rows.find((item) => item.id === params.id);

		if (row_item?.rating === "good") {
			return (
				<Typography
					variant="body1"
					align="center"
					sx={{ width: "100%" }}
				>
					-
				</Typography>
			);
		}
		if (row_item?.rating === "bad" && row_item?.correction !== "") {
			return (
				<Container sx={{mx: 'auto'}}>
					<Typography align="center" variant="body1">
						{row_item.correction}{" "}
						<EditOutlined
							fontSize="small"
							sx={{ paddingTop: "5px" }}
						/>
					</Typography>
				</Container>
			);
		} else {
			return (
				<TextField label="Enter your text here" variant="outlined" />
			);
		}
	}

	return (
		<React.Fragment>
			<Typography variant="h2">History</Typography>
			<div style={{ width: "80%", margin: "auto", marginBottom: "1vh" }}>
				<Typography variant="caption">Select a Template</Typography>
				<Select
					label="Template"
					value={template.value}
					onChange={handleTemplateChange}
					style={{ margin: "0 10px", backgroundColor: "white" }}
					sx={{ border: "none" }}
				>
					{templates.map((element) => (
						<MenuItem key={element.value} value={element.value}>
							{element.value}
						</MenuItem>
					))}
				</Select>
			</div>
			<Box
				sx={{
					width: "80%",
					mx: "auto",
					boxShadow: "2px 3px 5px gray",
					borderRadius: "10px",
				}}
				id="data-grid-1"
			>
				<DataGrid
					rows={template.rows}
					columns={template.columns}
					initialState={{
						pagination: { paginationModel: { pageSize: 5 } },
					}}
					pageSizeOptions={[5, 10, 15, 20]}
					sx={{
						bgcolor: "white",
					}}
				/>
			</Box>
		</React.Fragment>
	);
}

export default History;
