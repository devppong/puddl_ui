import { useState, useEffect, useRef, useDeferredValue } from "react";
import "./Analytics.css";
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
	Card,
	Text,
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
let shownTimer;
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
		api_eta: 0,
	};

	const [state, dispatch] = useReducer(reducer, initialState);
	const [apiKeyStatus, setApiKeyStatus] = useState("error");
	const [apiKey, setApiKey] = useState("");
	const deferredKey = useDeferredValue(apiKey);
	const [OrgID, setOrgID] = useState("");
	const deferredOrgID = useDeferredValue(OrgID);
	const [selectedUser, setselectedUser] = useState("All Users");
	const [selectedUSD, setSelectedUSD] = useState("All Users");
	const [eta_timer, setETA_Timer] = useState("00:00");
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
		// console.log("local storage");
		// This will be called after the component mounts
		let api_key = localStorage.getItem("openAiKey");
		let org_id = localStorage.getItem("openAiOrgID");
		if (api_key) {
			// console.log("api_key:", api_key);
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
		updateETA_Timer();
	}, [state.api_eta]);

	const updateETA_Timer = async () => {
		if (shownTimer) {
			clearInterval(shownTimer);
		}
		shownTimer = setInterval(() => {
			if (state.api_eta < 0) {
				clearInterval(shownTimer);
			} else {
				showTime(state.api_eta);
				dispatch({
					type: "DEL_API_ETA",
					payload: 1,
					fieldName: "api_eta",
				});
			}
		}, 1000);
	};

	const showTime = (value) => {
		if (!value) {
			setETA_Timer("00:00");
			return;
		}
		var minutes = Math.floor(value / 60);
		var seconds = value % 60;
		if (seconds < 10 && minutes < 10)
			setETA_Timer(`0${minutes}:0${seconds}`);
		else if (seconds < 10 || minutes > 9)
			setETA_Timer(`${minutes}:0${seconds}`);
		else setETA_Timer(`${minutes}:${seconds}`);
	};

	// const updateTimerShown = (value) => {
	// 	console.log("timer_value:", value);
	// 	console.log("shownTimer:", shownTimer);
	// 	if (shownTimer) {
	// 		console.log("timer running already...");
	// 		clearInterval(shownTimer);
	// 	}

	// 	const diffDays = Math.ceil(
	// 		(value[1] - value[0]) / (1000 * 60 * 60 * 24)
	// 	);
	// 	let reqs_time = diffDays * 12;

	// 	shownTimer = setInterval(() => {
	// 		if (!reqs_time) {
	// 			clearInterval(shownTimer);
	// 		} else {
	// 			showTime(reqs_time);
	// 			reqs_time--;
	// 		}
	// 	}, 1000);

	// 	console.log("shownTimer:", shownTimer);
	// };

	useEffect(() => {
		// console.log("deferredkey:", deferredKey);
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
				// setTimeout(() => {
				// 	console.log(new Date().toString());
				// 	console.log(state);
				// 	// updateETA_Timer();
				// }, 2000);
				// setTimeout(() => {
				// 	console.log(new Date().toString());
				// 	console.log(state);
				// 	// updateETA_Timer();
				// }, 12000);
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
					justifyContent: "center",
					marginBottom: "20px",
					flexDirection: "column",
				}}
			>
				<div className='timer_card'>ETA: {eta_timer}</div>
				<div className='timer_card_text'>
					The Open AI API allows just 5 requests per minute.
					<br /> You're welcome to leave this tab open and return at a
					later time.
				</div>
			</Flex>
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
				<Popover title='Your OpenAI Session Id is stored locally'>
					<label>OpenAI SessionId: </label>
					<span>
						<Input.Password
							status={apiKeyStatus}
							className='max-w-sm'
							placeholder='OpenAI Session ID(stored locally)'
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
								href='https://able-newt-c08.notion.site/Puddl-io-Get-OpenAI-Session-ID-14cc3ebb8f304d68840f065ba679aa17'
								style={{ color: "blue" }}
								target='_blank'
								rel='noreferrer'
							>
								here
							</a>{" "}
							for your Session ID
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
				<Col numColSpanLg={2} className='loading-spinner-container'>
					<div
						className='loading-spinner'
						id='bar_chart_analytics'
					></div>
					{<Barchart state={state} dispatch={dispatch} />}
				</Col>
				<Col numColSpanLg={1} className='loading-spinner-container'>
					<div className='loading-spinner'></div>
					<Linechart state={state} dispatch={dispatch} />
				</Col>
			</Grid>

			{/* {<Barchart state={state} dispatch={dispatch} />} */}
			<Grid numColsLg={3} className='mt-6 gap-6'>
				<Col numColSpanLg={1} className='loading-spinner-container'>
					<div
						className='loading-spinner'
						id='donut_chart_analytics'
					></div>
					<Donutchart state={state} dispatch={dispatch} />
				</Col>
				<Col numColSpanLg={1} className='loading-spinner-container'>
					<div className='loading-spinner'></div>
					<CompUIReq state={state} dispatch={dispatch} />
				</Col>
				<Col numColSpanLg={1} className='loading-spinner-container'>
					<div className='loading-spinner'></div>
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
