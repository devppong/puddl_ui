import { useState, useEffect, useRef, useDeferredValue } from "react";
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
		selectedUser: "All Users",
		selectedUSD: false,
		user_level_data: [],
		user_level_costs_loaded: true,
	};

	const [state, dispatch] = useReducer(reducer, initialState);
	const [apiKeyStatus, setApiKeyStatus] = useState("error");
	const [apiKey, setApiKey] = useState("");
	const deferredKey = useDeferredValue(apiKey);
	const [OrgID, setOrgID] = useState("");
	const deferredOrgID = useDeferredValue(OrgID);
	const [selectedUser, setselectedUser] = useState("All Users");
	const [selectedUSD, setSelectedUSD] = useState("All Users");
	const orgIdRef = useRef();

	const handleUpdateFilters = (value) => {
		updateFilters(dispatch, state, value);
	};

	const handleUpdateDateRange = (value) => {
		updateDateRange(dispatch, state, value);
	};

	const handleSelectedUser = (value) => {
		updateSelectedUser(dispatch, state, value);
		setselectedUser(value);
	};

	// const onChangekey = async (e) => {
	// 	let key = e.target.value;
	// 	setApiKey(key);
	// 	console.log(key);
	// };

	// const onChangeOrgID = async (e) => {

	// };
	//animate-ping bg-red-50 opacity-75

	useEffect(() => {
		console.log("local storage");
		// This will be called after the component mounts
		let api_key = localStorage.getItem("openAiKey");
		let org_id = localStorage.getItem("openAiOrgID");
		if (api_key) {
			setApiKeyStatus("success");
			// updateApiKey(dispatch, state, api_key);
			setApiKey(api_key);
		}
		if (org_id) {
			// updateOrgID(dispatch, state, org_id);
			setOrgID(org_id);
		}
	}, []);

	useEffect(() => {
		console.log("deferred key:", deferredKey);
		const delay = 500;
		const timer = setTimeout(async () => {
			let isApiKeyValid = false;
			try {
				isApiKeyValid = await validateApiKey(deferredKey);
			} catch (e) {
				//console.log(e);
			}

			if (isApiKeyValid) {
				localStorage.setItem("openAiKey", deferredKey);
				console.log("valid key");
				setApiKeyStatus("success");
				updateApiKey(dispatch, state, deferredKey);
			} else {
				console.log("invalid key");
				setApiKeyStatus("error");
			}
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [deferredKey]);

	useEffect(() => {
		const delay = 500;
		const timer = setTimeout(async () => {
			localStorage.setItem("openAiOrgID", deferredOrgID);
			updateOrgID(dispatch, state, deferredOrgID);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [deferredOrgID]);

	return (
		<main className='bg-slate-50 p-6 sm:p-10 w-min-full'>
			<Flex
				style={{
					alignItems: "center",
					flexWrap: "wrap",
					justifyContent: "space-evenly",
				}}
				id='analytics-top'
			>
				<Metric>Analytics</Metric>
				{apiKeyStatus === "success" ? (
					<Badge
						className='max-w-sm '
						color={state.user_level_costs_loaded ? "green" : "red"}
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
								className='animate-ping bg-green-50 opacity-75'
								style={{ width: "10px" }}
							>
								<StatusOnlineIcon />
							</span>
							<span className='ml-2'>
								{state.user_level_costs_loaded
									? "Active"
									: "Some of OpenAI's Cost APIs are down"}
							</span>
						</span>
					</Badge>
				) : (
					<Badge
						className='max-w-sm '
						color='red'
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
								className='animate-ping bg-red-50 opacity-75'
								style={{ width: "10px" }}
							>
								<StatusOfflineIcon />
							</span>
							<span className='ml-2'>Inactive</span>
						</span>
					</Badge>
				)}
				<DateRangePicker
					style={{ margin: "10px", maxWidth: "350px" }}
					className='max-w-sm'
					enableDropdown={true}
					value={state.date_range}
					onValueChange={handleUpdateDateRange}
					options={state.datePickerOptions}
					dropdownPlaceholder='Timeline'
				/>
				<MultiSelectBox
					className='max-w-sm space-y-6 gap-6'
					onValueChange={handleUpdateFilters}
					value={state.filters}
					style={{ margin: "10px", width: "150px" }}
					placeholder='Model Types'
				>
					<MultiSelectBoxItem
						value='Instruct models'
						text='Instruct models'
					/>
					<MultiSelectBoxItem
						value='Chat models'
						text='Chat models'
					/>
					<MultiSelectBoxItem value='GPT-4' text='GPT-4' />
					<MultiSelectBoxItem
						value='Fine-tuned models'
						text='Fine-tuned models'
					/>
					<MultiSelectBoxItem
						value='Embedding models'
						text='Embedding models'
					/>
					<MultiSelectBoxItem
						value='Image models'
						text='Image models'
					/>
					<MultiSelectBoxItem
						value='Audio models'
						text='Audio models'
					/>
				</MultiSelectBox>
				<SelectBox
					className='max-w-sm space-y-6 gap-6'
					onValueChange={handleSelectedUser}
					value={selectedUser}
					style={{ margin: "10px", width: "150px" }}
					placeholder='Users'
				>
					<SelectBoxItem value='All Users' text='All Users' />
					{state.org_users.map((user) => (
						<SelectBoxItem
							value={user[0]}
							text={user[1]}
							key={user[0]}
						/>
					))}
				</SelectBox>
			</Flex>
			<Flex
				style={{
					justifyContent: "space-evenly",
					flexWrap: "wrap",
					alignItems: "baseline",
					margin: "1rem auto",
					gap: "2rem",
				}}
			>
				<Popover title='Your OpenAI key is stored locally'>
					<label>OpenAI Key: </label>
					<span>
						<Input.Password
							status={apiKeyStatus}
							className='max-w-sm'
							placeholder='OpenAI key(stored locally)'
							onChange={(e) => {
								setApiKey(e.target.value);
							}}
							value={apiKey}
							size='large'
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
								href='https://platform.openai.com/account/api-keys'
								style={{ color: "blue" }}
								target='_blank'
								rel='noreferrer'
							>
								here
							</a>{" "}
							for your OpenAI key
						</sub>
					</span>
				</Popover>
				<Popover title='Your OrgID is stored locally'>
					<label>OpenAI OrgID: </label>
					<span>
						<Input.Password
							className='max-w-sm'
							placeholder='OrgID(stored locally)'
							onChange={(e) => setOrgID(e.target.value)}
							value={OrgID}
							size='large'
							style={{ width: "320px" }}
							ref={orgIdRef}
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
								href='https://platform.openai.com/account/org-settings'
								style={{ color: "blue" }}
								target='_blank'
								rel='noreferrer'
							>
								here
							</a>{" "}
							for your OpenAI OrgID
						</sub>
					</span>
				</Popover>
				<Toggle
					defaultValue={false}
					onValueChange={(value) => {
						console.log(value);
						setSelectedUSD(value);
						updateSelectedCurrency(state, dispatch, value);
					}}
				>
					<ToggleItem value={true} text='USD' />
					<ToggleItem value={false} text='Local Currency' />
				</Toggle>
			</Flex>
			<Grid numColsLg={3} className='mt-6 gap-6 h-full'>
				<Col numColSpanLg={2}>
					{<Barchart state={state} dispatch={dispatch} />}
				</Col>
				<Col numColSpanLg={1}>
					<Linechart state={state} dispatch={dispatch} />
				</Col>
			</Grid>

			{/* {<Barchart state={state} dispatch={dispatch} />} */}
			<Grid numColsLg={3} className='mt-6 gap-6'>
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

			{selectedUser === "All Users" && state.org_users.length > 1 && (
				<>
					<Typography
						variant='h4'
						style={{ margin: "4rem auto 2rem 1rem" }}
					>
						User Level Breakdown
						{!OrgID && (
							<Typography
								variant='body1'
								onClick={() => {
									// let ele =
									// 	document.getElementById(
									// 		"analytics-top"
									// 	);
									// ele.scrollIntoView();
									orgIdRef.current.input.focus();
								}}
								sx={{
									color: "#da552f",
									cursor: "pointer",
								}}
							>
								(Input org id for user level details)
							</Typography>
						)}
					</Typography>

					<Grid numColsLg={3} className='mt-6 gap-6'>
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
			)}
		</main>
	);
}
