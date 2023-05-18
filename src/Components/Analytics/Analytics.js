import { useState, useEffect } from "react";
import {
	Col,
	Grid,
	Title,
	Flex,
	Metric,
	SelectBox,
	SelectBoxItem,
	Toggle,
	ToggleItem,
} from "@tremor/react";
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
	updateOrgID,
	updateSelectedCurrency,
	updateSelectedUser,
	validateApiKey,
} from "./actions";
import { StatusOfflineIcon, StatusOnlineIcon } from "@heroicons/react/solid";
import Linechart from "./charts/Linechart";
import { Input, Popover } from "antd";
import { Typography } from "@mui/material";
import UserLevelCost from "./charts/UserLevelCost";
import UserLevelRequests from "./charts/UserLevelRequests";
import UserLevelTokens from "./charts/UserLevelTokens";
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
		datePickerOptions: [
			{ value: "tdy", text: "Today", startDate: new Date() },
			{
				value: "w",
				text: "Last 7 days",
				startDate: new Date(
					new Date().setDate(new Date().getDate() - 7)
				),
				endDate: new Date(),
			},
			{
				value: "t",
				text: "Last 30 days",
				startDate: new Date(
					new Date().setDate(new Date().getDate() - 30)
				),
				endDate: new Date(),
			},
		],
		org_users: [],
		seletedUser: "All Users",
		selectedUSD: false,
	};

	const [state, dispatch] = useReducer(reducer, initialState);
	const [apiKeyStatus, setApiKeyStatus] = useState("error");
	const [apiKey, setApiKey] = useState("");
	const [OrgID, setOrgID] = useState("");
	const [seletedUser, setSeletedUser] = useState("All Users");
	const [selectedUSD, setSelectedUSD] = useState("All Users");

	const handleUpdateFilters = (value) => {
		updateFilters(dispatch, state, value);
	};

	const handleUpdateDateRange = (value) => {
		updateDateRange(dispatch, state, value);
	};

	const handleSelectedUser = (value) => {
		updateSelectedUser(dispatch, state, value);
		setSeletedUser(value);
	};

	const onChangekey = async (e) => {
		let key = e.target.value;
		let isApiKeyValid = false;
		try {
			isApiKeyValid = await validateApiKey(key);
		} catch (e) {
			//console.log(e);
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

	const onChangeOrgID = async (e) => {
		localStorage.setItem("openAiOrgID", e.target.value);
		setOrgID(e.target.value);
		updateOrgID(dispatch, state, e.target.value);
	};
	//animate-ping bg-red-50 opacity-75

	useEffect(() => {
		// This will be called after the component mounts
		let api_key = localStorage.getItem("openAiKey");
		let org_id = localStorage.getItem("openAiOrgID");
		if (api_key) {
			setApiKeyStatus("success");
			updateApiKey(dispatch, state, api_key);
			setApiKey(api_key);
		}
		if (org_id) {
			updateOrgID(dispatch, state, org_id);
			setOrgID(org_id);
		}
	}, []);

	return (
		<main className="bg-slate-50 p-6 sm:p-10 w-min-full">
			<Grid className='gap-6' numColsLg={12}>
				<Col numColSpanLg={2}>
					<Metric>Analytics</Metric>
				</Col>
				{apiKeyStatus === "success" ? (
					<Col numColSpanLg={2}>
						<Badge
							className="max-w-sm "
							color="green"
							style={{ margin: "10px" }}
						>
							<span
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
							</span>
						</Badge>
					</Col>
				) : (
					<Col numColSpanLg={2}>
						<Badge
							className="max-w-sm "
							color="red"
							style={{ margin: "10px" }}
						>
							<span
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
							</span>
						</Badge>
					</Col>
				)}
				<Col numColSpanLg={4}>
					<DateRangePicker
						style={{ margin: "10px", maxWidth: "350px" }}
						className="max-w-sm"
						enableDropdown={true}
						value={state.date_range}
						onValueChange={handleUpdateDateRange}
						options={state.datePickerOptions}
						dropdownPlaceholder="Timeline"
					/>
				</Col>
				<Col numColSpanLg={2}>
					<MultiSelectBox
						className="max-w-sm space-y-6 gap-6"
						onValueChange={handleUpdateFilters}
						value={state.filters}
						style={{ margin: "10px", width: "150px" }}
						placeholder="Model Types"
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
				</Col>
				<Col numColSpanLg={2}>
					<SelectBox
						className="max-w-sm space-y-6 gap-6"
						onValueChange={handleSelectedUser}
						value={seletedUser}
						style={{ margin: "10px", width: "150px" }}
						placeholder="Users"
					>
						<SelectBoxItem value="All Users" text="All Users" />
						{state.org_users.map((user) => (
							<SelectBoxItem
								value={user[0]}
								text={user[1]}
								key={user[0]}
							/>
						))}
					</SelectBox>
				</Col>
			</Grid>
			<Grid className='gap-6' numColsLg={12}>
				<Col numColSpanLg={5}>
					<Popover title="Your OpenAI key is stored locally">
						<label>OpenAI API Key: </label>
						<span>
							<Input.Password
								status={apiKeyStatus}
								className="max-w-sm"
								placeholder="OpenAI key(stored locally)"
								onChange={onChangekey}
								value={apiKey}
								size="large"
								style={{ width: "320px" }}
							/>
							<sub
								style={{
									display: "block",
									textAlign: "center",
									marginTop: "1em",
								}}
							>
								click{" "}
								<a
									href="https://platform.openai.com/account/api-keys"
									style={{ color: "blue" }}
									target="_blank"
									rel="noreferrer"
								>
									here
								</a>{" "}
								for your OpenAI key
							</sub>
						</span>
					</Popover>
				</Col>
				<Col numColSpanLg={5}>
					<Popover title="Your OrgID is stored locally">
						<label>OpenAI Org Key: </label>
						<span>
							<Input.Password
								className="max-w-sm"
								placeholder="OrgID(stored locally)"
								onChange={onChangeOrgID}
								value={OrgID}
								size="large"
								style={{ width: "320px" }}
							/>
							<sub
								style={{
									display: "block",
									textAlign: "center",
									marginTop: "1em",
								}}
							>
								click{" "}
								<a
									href="https://platform.openai.com/account/org-settings"
									style={{ color: "blue" }}
									target="_blank"
									rel="noreferrer"
								>
									here
								</a>{" "}
								for your OpenAI OrgID
							</sub>
						</span>
					</Popover>
				</Col>
				<Col numColSpanLg={2}>
					<Toggle
						defaultValue={false}
						onValueChange={(value) => {
							console.log(value)
							setSelectedUSD(value);
							updateSelectedCurrency(state, dispatch, value);
						}}
					>
						<ToggleItem value={true} text="USD" />
						<ToggleItem value={false} text="Local Currency" />
					</Toggle>
				</Col>
			</Grid>
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

			{
				seletedUser === "All Users" && (
					<>
						<Typography
							variant="h4"
							style={{ margin: "4rem auto 2rem 1rem" }}
						>
							User Level Breakdown
						</Typography>

						<Grid numColsLg={3} className="mt-6 gap-6">
							<Col numColSpanLg={1}>
								<UserLevelCost state={state} dispatch={dispatch} />
							</Col>
							<Col numColSpanLg={1}>
								<UserLevelRequests
									state={state}
									dispatch={dispatch}
								/>
							</Col>
							<Col numColSpanLg={1}>
								<UserLevelTokens
									state={state}
									dispatch={dispatch}
								/>
							</Col>
						</Grid>
					</>
				)
			}
		</main >
	);
}
