import { useState, useEffect } from "react";
import { Col, Grid, Title, Flex } from "@tremor/react";
import { Badge } from "@tremor/react";
import { MultiSelectBox, MultiSelectBoxItem } from "@tremor/react";
import { DateRangePicker } from "@tremor/react";
import Barchart from "./charts/Barchart";
import Donutchart from "./charts/Donutchart";
import CompUIReq from "./charts/Requests";
import CompUITok from "./charts/Tokens";
import React, { useReducer } from "react";
import reducer from "./reducer";
import {
	updateApiKey,
	updateDateRange,
	updateFilters,
	validateApiKey,
} from "./actions";
import { StatusOfflineIcon, StatusOnlineIcon } from "@heroicons/react/solid";
import Linechart from "./charts/Linechart";
import { Input } from "antd";
export default function Analytics() {
	const initialState = {
		data: {},
		filters: [
			"Instruct models",
			"Chat models",
			"GPT-4",
			"Fine-tuned models",
			"Embedding models",
			"Image models",
			"Audio models",
		],
		// default to last 30 days
		date_range: [
			new Date(new Date().setDate(new Date().getDate() - 30)),
			new Date(),
		],
	};

	const [state, dispatch] = useReducer(reducer, initialState);
	const [apiKeyStatus, setApiKeyStatus] = useState("error");
	const [apiKey, setApiKey] = useState("");

	const handleUpdateFilters = (value) => {
		updateFilters(dispatch, state, value);
	};

	const handleUpdateDateRange = (value) => {
		updateDateRange(dispatch, state, value);
	};

	const onChangekey = async (e) => {
		let key = e.target.value;
		let isApiKeyValid = false;
		try {
			isApiKeyValid = await validateApiKey(key);
		} catch (e) {
			console.log(e);
		}

		if (isApiKeyValid) {
			localStorage.setItem("openAiKey", key);
			console.log("valid key");
			setApiKeyStatus("success");
		} else {
			console.log("invalid key");
			setApiKeyStatus("error");
		}
		setApiKey(key);
		updateApiKey(dispatch, state, key);
	};
	//animate-ping bg-red-50 opacity-75

	useEffect(() => {
		// This will be called after the component mounts
		let api_key = localStorage.getItem("openAiKey");
		if (api_key) {
			setApiKeyStatus("success");
			updateApiKey(dispatch, state, api_key);
			setApiKey(api_key);
		}
	}, []);

	//let {filters} = state;
	return (
		<main className="bg-slate-50 p-6 sm:p-10">
			<Flex style={{ display: "flex", alignItems: "center" }}>
				<Title style={{ marginLeft: "10px" }}>Puddl Analytics</Title>
				{apiKeyStatus === "success" ? (
					<Badge
						className="max-w-sm "
						color="green"
						style={{ margin: "10px" }}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								padding: "2px",
							}}
						>
							<span
								className="animate-ping bg-green-50 opacity-75"
								style={{ width: "10px" }}
							>
								<StatusOnlineIcon />
							</span>
							<span className="ml-2">Active</span>
						</div>
					</Badge>
				) : (
					<Badge
						className="max-w-sm "
						color="red"
						style={{ margin: "10px" }}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								padding: "2px",
							}}
						>
							<span
								className="animate-ping bg-red-50 opacity-75"
								style={{ width: "10px" }}
							>
								<StatusOfflineIcon />
							</span>
							<span className="ml-2">Inactive</span>
						</div>
					</Badge>
				)}

				<DateRangePicker
					style={{ margin: "10px", width: "350px" }}
					className="max-w-sm"
					enableDropdown={true}
					value={state.date_range}
					onValueChange={handleUpdateDateRange}
					//  options={datePickerOptions}
				/>
				<MultiSelectBox
					className="max-w-sm space-y-6 gap-6"
					onValueChange={handleUpdateFilters}
					value={state.filters}
					style={{ margin: "10px", width: "230px" }}
				>
					<MultiSelectBoxItem
						value="Instruct models"
						text="Instruct models"
					/>
					<MultiSelectBoxItem
						value="Chat models"
						text="Chat models"
					/>
					<MultiSelectBoxItem value="GPT-4" text="GPT-4" />
					<MultiSelectBoxItem
						value="Fine-tuned models"
						text="Fine-tuned models"
					/>
					<MultiSelectBoxItem
						value="Embedding models"
						text="Embedding models"
					/>
					<MultiSelectBoxItem
						value="Image models"
						text="Image models"
					/>
					<MultiSelectBoxItem
						value="Audio models"
						text="Audio models"
					/>
				</MultiSelectBox>
				<Input.Password
					status={apiKeyStatus}
					className="max-w-sm"
					placeholder="OpenAI key"
					onChange={onChangekey}
					value={apiKey}
				/>
			</Flex>
			<Grid numColsLg={3} className="mt-6 gap-6 h-full">
				<Col numColSpanLg={2}>
					{<Barchart state={state} dispatch={dispatch} />}
				</Col>
				<Col numColSpanLg={1}>
					<Linechart state={state} dispatch={dispatch} />
				</Col>
			</Grid>
			{/* {<Barchart state={state} dispatch={dispatch} />} */}
			<Grid numColsLg={3} className="mt-6 gap-6">
				<Col numColSpanLg={1}>
					<Donutchart state={state} dispatch={dispatch} />
				</Col>
				<Col numColSpanLg={1}>
					<CompUIReq state={state} dispatch={dispatch} />
				</Col>
				<Col numColSpanLg={1}>
					<CompUITok state={state} dispatch={dispatch} />
				</Col>
			</Grid>
		</main>
	);
}
