import axios from "axios";
import moment from "moment";
const countries = require("iso-country-currency");
const prompt_api_url = "https://puddlapi.puddl.io/prompt";

const getOpenAIHeaders = (token) => {
	const headers = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return headers;
};

function getCostsOfUserTokens(usagePerDay) {
	const filterMap = {
		"gpt-4": "GPT-4",
		"gpt-3.5": "Chat models",
		davinci: "Instruct models",
		curie: "Instruct models",
		babbage: "Instruct models",
		ada: "Instruct models",
	};
	const modelPricing = {
		"gpt-4": {
			contextTokenCost: 0.03,
			generatedTokenCost: 0.06,
		},
		"gpt-3.5": {
			contextTokenCost: 0.002,
			generatedTokenCost: 0.002,
		},
		davinci: {
			contextTokenCost: 0.02,
			generatedTokenCost: 0.02,
		},
		curie: {
			contextTokenCost: 0.002,
			generatedTokenCost: 0.002,
		},
		babbage: {
			contextTokenCost: 0.0005,
			generatedTokenCost: 0.0005,
		},
		ada: {
			contextTokenCost: 0.0004,
			generatedTokenCost: 0.0004,
		},
	};
	const result = {};
	for (let key in usagePerDay) {
		const objKey = Object.keys(modelPricing).find((pricing) =>
			key.includes(pricing)
		);
		const modelPricingInfo = modelPricing.hasOwnProperty(objKey)
			? modelPricing[objKey]
			: null;

		let totalCost = 0;

		if (modelPricingInfo) {
			const contextTokenCost =
				(usagePerDay[key].n_context_tokens_total *
					modelPricingInfo.contextTokenCost) /
				1000;
			const generatedTokenCost =
				(usagePerDay[key].n_generated_tokens_total *
					modelPricingInfo.generatedTokenCost) /
				1000;
			totalCost += contextTokenCost + generatedTokenCost;
		}

		if (filterMap[objKey] in result) {
			result[filterMap[objKey]] += totalCost;
		} else {
			result[filterMap[objKey]] = totalCost;
		}
	}
	return result;
}

function calculatePerUserCosts(dispatch, state, usagePerUser, filters) {
	let { subscription_data } = state;
	let { conversion } = subscription_data;

	// console.log(usagePerUser);
	const perdayUsage = Object.keys(usagePerUser)
		.sort()
		.map((date) => {
			return [
				moment(date).format("DD MMM"),
				getCostsOfUserTokens(usagePerUser[date]),
			];
		});
	// console.log(perdayUsage);
	let bar_chart_data = [];
	let donut_chart_data = [];
	let donut_map = {};
	let exchangeRate = conversion ? conversion : 1;
	// console.log(filters);
	for (let i = 0; i < perdayUsage.length; i++) {
		let obj = {};
		let [day_month, line_items] = perdayUsage[i];
		obj["topic"] = day_month;
		for (let key in line_items) {
			if (filters.indexOf(key) > -1) {
				obj[key] = line_items[key] * exchangeRate;
				if (donut_map[key]) {
					donut_map[key] =
						donut_map[key] + line_items[key] * exchangeRate;
				} else {
					donut_map[key] = line_items[key] * exchangeRate;
				}
			}
		}
		bar_chart_data.push(obj);
	}

	let total_usage = 0;
	for (const [key, value] of Object.entries(donut_map)) {
		let obj = {};
		obj["topic"] = key;
		obj["cost"] = value;
		donut_chart_data.push(obj);
		total_usage = total_usage + value;
	}
	// console.log(bar_chart_data);
	// console.log(donut_chart_data);
	dispatch({
		type: "UPDATE_TOTAL_USAGE",
		fieldName: "total_usage",
		payload: total_usage.toFixed(2),
	});
	dispatch({
		type: "UPDATE_BAR_CHART_DATA",
		fieldName: "bar_chart_data",
		payload: bar_chart_data,
	});
	dispatch({
		type: "UPDATE_DONUT_CHART_DATA",
		fieldName: "donut_chart_data",
		payload: donut_chart_data,
	});
}

function calculateOpenAICost(usageArray) {
	const modelPricing = {
		"gpt-4": {
			contextTokenCost: 0.03,
			generatedTokenCost: 0.06,
		},
		"gpt-3.5": {
			contextTokenCost: 0.002,
			generatedTokenCost: 0.002,
		},
		davinci: {
			contextTokenCost: 0.02,
			generatedTokenCost: 0.02,
		},
		curie: {
			contextTokenCost: 0.002,
			generatedTokenCost: 0.002,
		},
		babbage: {
			contextTokenCost: 0.0005,
			generatedTokenCost: 0.0005,
		},
		ada: {
			contextTokenCost: 0.0004,
			generatedTokenCost: 0.0004,
		},
	};

	let totalCost = 0;

	for (const usage of usageArray) {
		const contextTokens = usage.n_context_tokens_total / 1000;
		const generatedTokens = usage.n_generated_tokens_total / 1000;

		// Find the matching model pricing based on the entire key of usage.snapshot_id

		const objKey = Object.keys(modelPricing).find((pricing) =>
			usage.snapshot_id.includes(pricing)
		);
		const modelPricingInfo = modelPricing.hasOwnProperty(objKey)
			? modelPricing[objKey]
			: null;

		if (modelPricingInfo) {
			const contextTokenCost =
				contextTokens * modelPricingInfo.contextTokenCost;
			const generatedTokenCost =
				generatedTokens * modelPricingInfo.generatedTokenCost;
			totalCost += contextTokenCost + generatedTokenCost;
		}
	}

	// console.log(totalCost);

	return totalCost;
}

const getToken = (state) => {
	return state.api_key;
};

const getOrgID = (state) => {
	return state.org_id;
};

const getPromptAPIHeaders = () => {
	const headers = { headers: { "Content-Type": "application/json" } };
	return headers;
};

const axiosGet = async (url, headers) => {
	try {
		const response = await axios.get(url, headers);
		if (response.status === 200) return response.data;
		else return null;
	} catch (error) {
		return null;
	}
};

export const updateApiKey = async (dispatch, state, key) => {
	await dispatch({
		type: "UPDATE_API_KEY",
		fieldName: "api_key",
		payload: key,
	});
	state.api_key = key;
	await getSubscriptionData(dispatch, state);
	await updateDateRange(dispatch, state, state.date_range);
};

export const updateOrgID = async (dispatch, state, key) => {
	await dispatch({
		type: "UPDATE_ORG_ID",
		fieldName: "org_id",
		payload: key,
	});
	state.org_id = key;
	await updateDateRange(dispatch, state, state.date_range);
};

export const updateDateRange = async (dispatch, state, date_range) => {
	dispatch({
		type: "UPDATE_DATE_RANGE",
		fieldName: "date_range",
		payload: date_range,
	});
	let { selectedUser } = state;
	if (date_range && date_range.length > 0) {
		if (selectedUser === "All Users") {
			getCostMetrics(dispatch, state, date_range);
			getKPIMetrics(dispatch, state, date_range);
			getUserLevelMetrics(dispatch, state, date_range, selectedUser);
		} else {
			// parseUserLevelData(dispatch, state, user_level_data, selectedUser, date_range);
			getUserLevelMetrics(dispatch, state, date_range, selectedUser);
		}
	}
};

export const updateFilters = async (dispatch, state, filters) => {
	dispatch({
		type: "UPDATE_FILTERS",
		payload: filters,
		fieldName: "filters",
	});
	let { selectedUser } = state;
	if (selectedUser === "All Users") {
		let { chart_data, comp_chart_data, subscription_data } = state;
		let { conversion } = subscription_data;
		// console.log(filters);
		parseChartData(
			dispatch,
			chart_data,
			comp_chart_data,
			filters,
			conversion
		);
		let { kpi_data } = state;
		parseKPIData(dispatch, kpi_data);
	} else {
		let { user_level_data } = state;
		parseUserLevelData(
			dispatch,
			state,
			user_level_data,
			selectedUser,
			filters
		);
	}
};

export const updateSelectedUser = async (dispatch, state, selectedUser) => {
	dispatch({
		type: "UPDATE_SELECTED_USER",
		payload: selectedUser,
		fieldName: "selectedUser",
	});
	let {
		chart_data,
		comp_chart_data,
		filters,
		subscription_data,
		date_range,
	} = state;
	let { conversion } = subscription_data;
	if (selectedUser === "All Users") {
		parseChartData(
			dispatch,
			chart_data,
			comp_chart_data,
			filters,
			conversion
		);
		let { kpi_data } = state;
		parseKPIData(dispatch, kpi_data);
	} else {
		console.log("Hello");
		let { user_level_data } = state;
		console.log("user_level_data: ", user_level_data);

		// getUserLevelMetrics(dispatch,state)

		parseUserLevelData(
			dispatch,
			state,
			user_level_data,
			selectedUser,
			filters
		);
	}
};

export const updateSelectedCurrency = async (state, dispatch, value) => {
	dispatch({
		type: "UPDATE_USD",
		payload: value,
		fieldName: "selectedUSD",
	});

	await getSubscriptionData(dispatch, state, value);

	let {
		chart_data,
		comp_chart_data,
		subscription_data,
		filters,
		user_level_data,
		selectedUser,
	} = state;
	while (!chart_data) {
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	let { conversion } = subscription_data;

	// console.log("conversion:", conversion);

	if (selectedUser === "All Users") {
		parseChartData(
			dispatch,
			chart_data,
			comp_chart_data,
			filters,
			value ? 1 : conversion
		);
	}
	parseUserLevelData(dispatch, state, user_level_data, selectedUser, filters);
};

export const getCostMetrics = async (dispatch, state, date_range) => {
	console.log("getCostMetrics");
	let start_date = moment(date_range[0]).format("YYYY-MM-DD");
	let end_date = moment(date_range[0]).add("1", "days").format("YYYY-MM-DD");
	if (date_range[1]) {
		end_date = moment(date_range[1]).format("YYYY-MM-DD");
		if (start_date == end_date) {
			end_date = moment(date_range[1])
				.add("1", "days")
				.format("YYYY-MM-DD");
		}
	}
	let url = `https://api.openai.com/dashboard/billing/usage?start_date=${start_date}&end_date=${end_date}`;
	let token = getToken(state);
	let headers = getOpenAIHeaders(token ? token : "");
	let chart_data = await axiosGet(url, headers);
	let comp_date_range = getCompDateRange(date_range);
	let comp_url = `https://api.openai.com/dashboard/billing/usage?start_date=${comp_date_range[0]}&end_date=${comp_date_range[1]}`;
	let comp_chart_data = await axiosGet(comp_url, headers);
	if (!chart_data) return;
	dispatch({
		type: "UPDATE_CHART_DATA",
		payload: chart_data,
		fieldName: "chart_data",
	});
	dispatch({
		type: "UPDATE_COMP_CHART_DATA",
		payload: comp_chart_data,
		fieldName: "comp_chart_data",
	});
	let { filters, subscription_data } = state;
	let { conversion } = subscription_data;
	parseChartData(dispatch, chart_data, comp_chart_data, filters, conversion);
};

function getCompDateRange(date_range) {
	let start_date = moment(date_range[0]).format("YYYY-MM-DD");
	let end_date = moment(date_range[0]).add("1", "days").format("YYYY-MM-DD");
	if (date_range[1]) {
		end_date = moment(date_range[1]).format("YYYY-MM-DD");
		if (start_date == end_date) {
			end_date = moment(date_range[1])
				.add("1", "days")
				.format("YYYY-MM-DD");
		}
	}
	let num_of_days = moment(end_date).diff(moment(start_date), "days");
	let comp_start_date = moment(start_date)
		.subtract(num_of_days, "days")
		.format("YYYY-MM-DD");
	let comp_end_date = moment(end_date)
		.subtract(num_of_days, "days")
		.format("YYYY-MM-DD");
	return [comp_start_date, comp_end_date];
}

function getAllDatesInRange(startDate, endDate) {
	const dates = [];
	let currDate = moment(startDate).startOf("day");
	const lastDate = moment(endDate).startOf("day");
	while (currDate.diff(lastDate) < 0) {
		dates.push(currDate.clone().format("YYYY-MM-DD"));
		currDate.add(1, "days");
	}
	return dates;
}

export const getUserLevelMetrics = async (
	dispatch,
	state,
	date_range,
	selectedUser
) => {
	console.log("getUserLevelMetrics");
	let org_id = getOrgID(state);

	if (!org_id) return;

	let start_date = moment(date_range[0]).format("YYYY-MM-DD");
	let end_date = moment(date_range[0]).add("1", "days").format("YYYY-MM-DD");
	if (date_range[1]) {
		end_date = moment(date_range[1]).format("YYYY-MM-DD");
		if (start_date === end_date) {
			end_date = moment(date_range[1])
				.add("1", "days")
				.format("YYYY-MM-DD");
		}
	}

	const datesInRange = getAllDatesInRange(start_date, end_date);

	let token = getToken(state);
	let headers = getOpenAIHeaders(token ? token : "");

	let org_users_url = `https://api.openai.com/v1/organizations/${org_id}/users`;

	let org_users = await axiosGet(org_users_url, headers);

	if (!org_users) return;

	org_users = org_users.members.data.map((user) => [
		user.user.id,
		user.user.name,
	]);

	dispatch({
		type: "UPDATE_ORG_USERS",
		payload: org_users,
		fieldName: "org_users",
	});

	let users = [];

	for (const user of org_users) {
		let promise_array = [];

		for (const date of datesInRange) {
			let url = `https://api.openai.com/v1/usage?date=${date}&user_public_id=${user[0]}`;
			promise_array.push(axiosGet(url, headers));
		}

		const resp = await Promise.all(promise_array);
		users.push([user[0] + "|" + user[1], resp]);
	}

	let user_level_data = users;
	if (!user_level_data) return;
	dispatch({
		type: "UPDATE_USER_LEVEL_DATA",
		payload: user_level_data,
		fieldName: "user_level_data",
	});
	let { filters } = state;
	console.log("metrics:", selectedUser);
	parseUserLevelData(dispatch, state, user_level_data, selectedUser, filters);
};

export const getKPIMetrics = async (dispatch, state, date_range) => {
	let start_date = moment(date_range[0]).format("YYYY-MM-DD");
	let end_date = moment(date_range[0]).add("1", "days").format("YYYY-MM-DD");
	if (date_range[1]) {
		end_date = moment(date_range[1]).format("YYYY-MM-DD");
		if (start_date == end_date) {
			end_date = moment(date_range[1])
				.add("1", "days")
				.format("YYYY-MM-DD");
		}
	}
	const datesInRange = getAllDatesInRange(start_date, end_date);
	let promise_array = [];
	let token = getToken(state);
	let headers = getOpenAIHeaders(token ? token : "");
	datesInRange.forEach((date) => {
		let url = `https://api.openai.com/v1/usage?date=${date}`;
		promise_array.push(axiosGet(url, headers));
	});
	let kpi_data = await Promise.all(promise_array);
	if (!kpi_data) return;
	dispatch({
		type: "UPDATE_KPI_DATA",
		payload: kpi_data,
		fieldName: "kpi_data",
	});
	parseKPIData(dispatch, kpi_data);
};

export const validateApiKey = async (api_key) => {
	let headers = {
		headers: {
			Authorization: `Bearer ${api_key}`,
		},
	};

	let url = `https://api.openai.com/v1/engines`;
	let engines = await axiosGet(url, headers);
	if (!engines) return false;
	if (engines.error) {
		return false;
	}
	return true;
};

export const getSubscriptionData = async (dispatch, state, selectedUSD) => {
	let token = getToken(state);
	let headers = getOpenAIHeaders(token ? token : "");
	let url = `https://api.openai.com/dashboard/billing/subscription`;
	let subscription_data = await axiosGet(url, headers);
	if (!subscription_data) return;
	await parseSubscriptionData(
		dispatch,
		state,
		subscription_data,
		selectedUSD
	);
};

export const parseSubscriptionData = async (
	dispatch,
	state,
	subscription_data,
	selectedUSD = false
) => {
	let { soft_limit_usd, hard_limit_usd, billing_address } = subscription_data;
	let countryName = "US";
	let conversion = 1;
	if (billing_address && billing_address.country) {
		countryName = billing_address.country;
	}
	let countryInfo = countries.getAllInfoByISO(countryName);
	let { currency } = countryInfo;
	let url = prompt_api_url + `/currencyConversion/${currency}`;
	let headers = getPromptAPIHeaders();
	try {
		if (selectedUSD) {
			conversion = 1;
		} else {
			let exchangeRate = await axiosGet(url, headers);
			conversion = exchangeRate.conversion;
		}
		soft_limit_usd = soft_limit_usd * conversion;
		hard_limit_usd = hard_limit_usd * conversion;
	} catch (e) {
		console.log(e);
	}
	let updated_subscription_data = {
		soft_limit_usd,
		hard_limit_usd,
		countryInfo,
		conversion,
	};
	state.subscription_data = updated_subscription_data;
	await dispatch({
		type: "UPDATE_SUBSCRIPTION_DATA",
		fieldName: "subscription_data",
		payload: updated_subscription_data,
	});
};

export const parseUserLevelData = (
	dispatch,
	state,
	user_level_data,
	selectedUser = "All Users",
	filters
) => {
	console.log("parseUserLevelData");
	console.log("selectedUser", state.selectedUser);
	let requests_map = {};
	let total_requests = 0;
	let indi_requests_map = {};
	let indi_total_requests = 0;

	let tokens_map = {};
	let total_tokens = 0;
	let indi_tokens_map = {};
	let indi_total_tokens = 0;

	let context_tokens_map = {};
	let total_context_tokens = 0;
	let indi_context_tokens_map = {};
	let indi_total_context_tokens = 0;

	let generated_tokens_map = {};
	let total_generated_tokens = 0;
	let indi_generated_tokens_map = {};
	let indi_total_generated_tokens = 0;

	let hourly_requests_map = {};
	// for 00 to 23 hours of the day initialize the map with 0
	for (let i = 0; i < 24; i++) {
		if (i < 10) {
			i = "0" + i;
		} else {
			i = "" + i;
		}
		hourly_requests_map[i] = 0;
	}

	let usageArray = {};
	let usagePerUser = {};

	for (let i = 0; i < user_level_data.length; i++) {
		let indi_user = user_level_data[i];
		usageArray[indi_user[0]] = [];
		for (let j = 0; j < indi_user[1].length; j++) {
			for (let k = 0; k < indi_user[1][j].data.length; k++) {
				let {
					n_requests,
					n_context_tokens_total,
					n_generated_tokens_total,
					aggregation_timestamp,
					snapshot_id,
				} = indi_user[1][j].data[k];

				usageArray[indi_user[0]].push({
					n_context_tokens_total: n_context_tokens_total,
					n_generated_tokens_total: n_generated_tokens_total,
					snapshot_id: snapshot_id,
				});

				if (selectedUser === indi_user[0].split("|")[0]) {
					const date = moment
						.unix(aggregation_timestamp)
						.format("YYYY-MM-DD");
					if (date in usagePerUser) {
						if (snapshot_id in usagePerUser[date]) {
							usagePerUser[date][snapshot_id] = {
								n_context_tokens_total:
									usagePerUser[date][snapshot_id][
										"n_context_tokens_total"
									] + n_context_tokens_total,
								n_generated_tokens_total:
									usagePerUser[date][snapshot_id][
										"n_generated_tokens_total"
									] + n_generated_tokens_total,
							};
						} else {
							usagePerUser[date][snapshot_id] = {
								n_context_tokens_total: n_context_tokens_total,
								n_generated_tokens_total:
									n_generated_tokens_total,
							};
						}
					} else {
						usagePerUser[date] = {};
						usagePerUser[date][snapshot_id] = {
							n_context_tokens_total: n_context_tokens_total,
							n_generated_tokens_total: n_generated_tokens_total,
						};
					}

					total_requests += n_requests;
					if (requests_map[snapshot_id]) {
						requests_map[snapshot_id] =
							requests_map[snapshot_id] + n_requests;
					} else {
						requests_map[snapshot_id] = n_requests;
					}
					let aggregation_hour = moment
						.unix(aggregation_timestamp)
						.format("HH");
					if (hourly_requests_map[aggregation_hour]) {
						hourly_requests_map[aggregation_hour] =
							hourly_requests_map[aggregation_hour] + n_requests;
					} else {
						hourly_requests_map[aggregation_hour] = n_requests;
					}
					total_tokens =
						total_tokens +
						n_generated_tokens_total +
						n_context_tokens_total;
					if (tokens_map[snapshot_id]) {
						tokens_map[snapshot_id] =
							tokens_map[snapshot_id] +
							n_generated_tokens_total +
							n_context_tokens_total;
					} else {
						tokens_map[snapshot_id] =
							n_generated_tokens_total + n_context_tokens_total;
					}

					total_context_tokens =
						total_context_tokens + n_context_tokens_total;
					if (context_tokens_map[snapshot_id]) {
						context_tokens_map[snapshot_id] =
							context_tokens_map[snapshot_id] +
							n_context_tokens_total;
					} else {
						context_tokens_map[snapshot_id] =
							n_context_tokens_total;
					}

					total_generated_tokens =
						total_generated_tokens + n_generated_tokens_total;
					if (generated_tokens_map[snapshot_id]) {
						generated_tokens_map[snapshot_id] =
							generated_tokens_map[snapshot_id] +
							n_generated_tokens_total;
					} else {
						generated_tokens_map[snapshot_id] =
							n_generated_tokens_total;
					}
				}

				if (selectedUser === "All Users") {
					indi_total_requests += n_requests;

					if (indi_requests_map[indi_user[0].split("|")[1]]) {
						indi_requests_map[indi_user[0].split("|")[1]] +=
							n_requests;
					} else {
						indi_requests_map[indi_user[0].split("|")[1]] =
							n_requests;
					}

					indi_total_tokens +=
						n_context_tokens_total + n_generated_tokens_total;
					if (indi_tokens_map[indi_user[0].split("|")[1]]) {
						indi_tokens_map[indi_user[0].split("|")[1]] =
							indi_tokens_map[indi_user[0].split("|")[1]] +
							n_generated_tokens_total +
							n_context_tokens_total;
					} else {
						indi_tokens_map[indi_user[0].split("|")[1]] =
							n_generated_tokens_total + n_context_tokens_total;
					}

					indi_total_context_tokens += n_context_tokens_total;
					if (indi_context_tokens_map[indi_user[0].split("|")[1]]) {
						indi_context_tokens_map[indi_user[0].split("|")[1]] +=
							n_context_tokens_total;
					} else {
						indi_context_tokens_map[indi_user[0].split("|")[1]] =
							n_context_tokens_total;
					}

					indi_total_generated_tokens += n_generated_tokens_total;
					if (indi_generated_tokens_map[indi_user[0].split("|")[1]]) {
						indi_generated_tokens_map[indi_user[0].split("|")[1]] +=
							n_generated_tokens_total;
					} else {
						indi_generated_tokens_map[indi_user[0].split("|")[1]] =
							n_generated_tokens_total;
					}
				}
			}
		}

		let indi_requests_data = [],
			indi_tokens_data = [],
			indi_context_tokens_data = [],
			indi_generated_tokens_data = [],
			requests_data = [],
			tokens_data = [],
			context_tokens_data = [],
			generated_tokens_data = [],
			hourly_requests_data = [];

		for (const [key, value] of Object.entries(indi_requests_map)) {
			indi_requests_data.push({ name: key, value: value });
		}
		indi_requests_data.sort((a, b) => {
			return b.value - a.value;
		});
		for (const [key, value] of Object.entries(indi_tokens_map)) {
			indi_tokens_data.push({ name: key, value: value });
		}
		indi_tokens_data.sort((a, b) => {
			return b.value - a.value;
		});
		for (const [key, value] of Object.entries(indi_context_tokens_map)) {
			indi_context_tokens_data.push({ name: key, value: value });
		}
		indi_context_tokens_data.sort((a, b) => {
			return b.value - a.value;
		});
		for (const [key, value] of Object.entries(indi_generated_tokens_map)) {
			indi_generated_tokens_data.push({ name: key, value: value });
		}
		indi_generated_tokens_data.sort((a, b) => {
			return b.value - a.value;
		});
		if (selectedUser === indi_user[0].split("|")[0]) {
			calculatePerUserCosts(dispatch, state, usagePerUser, filters);
			// console.log(calculateOpenAICost(usageArray));
			for (const [key, value] of Object.entries(requests_map)) {
				requests_data.push({ name: key, value: value });
			}
			for (const [key, value] of Object.entries(tokens_map)) {
				tokens_data.push({ name: key, value: value });
			}
			for (const [key, value] of Object.entries(context_tokens_map)) {
				context_tokens_data.push({ name: key, value: value });
			}
			for (const [key, value] of Object.entries(generated_tokens_map)) {
				generated_tokens_data.push({ name: key, value: value });
			}
			for (const [key, value] of Object.entries(hourly_requests_map)) {
				hourly_requests_data.push({
					name: parseInt(key),
					Requests: value,
				});
			}
			let avg_daily_requests =
				indi_user[1].length && indi_user[1].length > 0
					? (total_requests / indi_user[1].length).toFixed(0)
					: 0;
			dispatch({
				type: "UPDATE_REQUESTS_DATA",
				fieldName: "requests_data",
				payload: {
					total_requests: total_requests,
					data: requests_data,
				},
			});

			dispatch({
				type: "UPDATE_TOKENS_DATA",
				fieldName: "tokens_data",
				payload: { total_tokens: total_tokens, data: tokens_data },
			});

			dispatch({
				type: "UPDATE_CONTEXT_TOKENS_DATA",
				fieldName: "context_tokens_data",
				payload: {
					total_tokens: total_context_tokens,
					data: context_tokens_data,
				},
			});

			dispatch({
				type: "UPDATE_GENERATED_TOKENS_DATA",
				fieldName: "generated_tokens_data",
				payload: {
					total_tokens: total_generated_tokens,
					data: generated_tokens_data,
				},
			});

			dispatch({
				type: "UPDATE_HOURLY_REQUESTS_DATA",
				fieldName: "hourly_requests_data",
				payload: hourly_requests_data,
			});

			dispatch({
				type: "AVG_DAILY_REQUESTS",
				fieldName: "avg_daily_requests",
				payload: avg_daily_requests,
			});
		}

		if (selectedUser === "All Users") {
			dispatch({
				type: "UPDATE_USER_REQUESTS",
				fieldName: "user_level_reqs",
				payload: {
					total_requests: indi_total_requests,
					data: indi_requests_data,
				},
			});

			dispatch({
				type: "UPDATE_USER_TOKENS",
				fieldName: "user_tokens_data",
				payload: {
					total_tokens: indi_total_tokens,
					data: indi_tokens_data,
				},
			});

			dispatch({
				type: "UPDATE_USER_CONTEXT_TOKENS",
				fieldName: "user_context_tokens_data",
				payload: {
					total_tokens: indi_total_context_tokens,
					data: indi_context_tokens_data,
				},
			});

			dispatch({
				type: "UPDATE_USER_GENERATED_TOKENS",
				fieldName: "user_generated_tokens_data",
				payload: {
					total_tokens: indi_total_generated_tokens,
					data: indi_generated_tokens_data,
				},
			});
		}
	}

	const user_level_costs = [];
	const { conversion } = state.subscription_data;
	for (let userUsage in usageArray) {
		user_level_costs.push({
			name: userUsage.split("|")[1],
			cost: calculateOpenAICost(usageArray[userUsage]) * conversion,
		});
	}
	// console.log(user_level_costs);
	dispatch({
		type: "UPDATE_USER_LEVEL_COSTS",
		payload: user_level_costs,
		fieldName: "user_level_costs",
	});
};
// data looks like this
// "data": [
// {
//     "aggregation_timestamp": 1680459900,
//     "n_requests": 2,
//     "operation": "completion",
//     "snapshot_id": "text-davinci:003",
//     "n_context": 2,
//     "n_context_tokens_total": 376,
//     "n_generated": 2,
//     "n_generated_tokens_total": 18
//   }
// ]
// we need to parse this data and create a map of snapshot_id and n_requests
export const parseKPIData = (dispatch, kpi_data) => {
	let requests_map = {};
	let total_requests = 0;

	let tokens_map = {};
	let total_tokens = 0;

	let context_tokens_map = {};
	let total_context_tokens = 0;

	let generated_tokens_map = {};
	let total_generated_tokens = 0;

	let hourly_requests_map = {};
	// for 00 to 23 hours of the day initialize the map with 0
	for (let i = 0; i < 24; i++) {
		if (i < 10) {
			i = "0" + i;
		} else {
			i = "" + i;
		}
		hourly_requests_map[i] = 0;
	}
	for (let i = 0; i < kpi_data.length; i++) {
		let data = kpi_data[i].data;
		for (let j = 0; j < data.length; j++) {
			let {
				snapshot_id,
				n_requests,
				n_context_tokens_total,
				n_generated_tokens_total,
				aggregation_timestamp,
			} = data[j];

			total_requests += n_requests;
			if (requests_map[snapshot_id]) {
				requests_map[snapshot_id] =
					requests_map[snapshot_id] + n_requests;
			} else {
				requests_map[snapshot_id] = n_requests;
			}
			let aggregation_hour = moment
				.unix(aggregation_timestamp)
				.format("HH");
			if (hourly_requests_map[aggregation_hour]) {
				hourly_requests_map[aggregation_hour] =
					hourly_requests_map[aggregation_hour] + n_requests;
			} else {
				hourly_requests_map[aggregation_hour] = n_requests;
			}
			total_tokens =
				total_tokens +
				n_generated_tokens_total +
				n_context_tokens_total;
			if (tokens_map[snapshot_id]) {
				tokens_map[snapshot_id] =
					tokens_map[snapshot_id] +
					n_generated_tokens_total +
					n_context_tokens_total;
			} else {
				tokens_map[snapshot_id] =
					n_generated_tokens_total + n_context_tokens_total;
			}

			total_context_tokens =
				total_context_tokens + n_context_tokens_total;
			if (context_tokens_map[snapshot_id]) {
				context_tokens_map[snapshot_id] =
					context_tokens_map[snapshot_id] + n_context_tokens_total;
			} else {
				context_tokens_map[snapshot_id] = n_context_tokens_total;
			}

			total_generated_tokens =
				total_generated_tokens + n_generated_tokens_total;
			if (generated_tokens_map[snapshot_id]) {
				generated_tokens_map[snapshot_id] =
					generated_tokens_map[snapshot_id] +
					n_generated_tokens_total;
			} else {
				generated_tokens_map[snapshot_id] = n_generated_tokens_total;
			}
		}
	}

	let requests_data = [],
		tokens_data = [],
		context_tokens_data = [],
		generated_tokens_data = [],
		hourly_requests_data = [];
	for (const [key, value] of Object.entries(requests_map)) {
		requests_data.push({ name: key, value: value });
	}
	for (const [key, value] of Object.entries(tokens_map)) {
		tokens_data.push({ name: key, value: value });
	}
	for (const [key, value] of Object.entries(context_tokens_map)) {
		context_tokens_data.push({ name: key, value: value });
	}
	for (const [key, value] of Object.entries(generated_tokens_map)) {
		generated_tokens_data.push({ name: key, value: value });
	}
	for (const [key, value] of Object.entries(hourly_requests_map)) {
		hourly_requests_data.push({ name: parseInt(key), Requests: value });
	}
	let avg_daily_requests =
		kpi_data.length && kpi_data.length > 0
			? (total_requests / kpi_data.length).toFixed(0)
			: 0;
	dispatch({
		type: "UPDATE_REQUESTS_DATA",
		fieldName: "requests_data",
		payload: { total_requests: total_requests, data: requests_data },
	});

	dispatch({
		type: "UPDATE_TOKENS_DATA",
		fieldName: "tokens_data",
		payload: { total_tokens: total_tokens, data: tokens_data },
	});

	dispatch({
		type: "UPDATE_CONTEXT_TOKENS_DATA",
		fieldName: "context_tokens_data",
		payload: {
			total_tokens: total_context_tokens,
			data: context_tokens_data,
		},
	});

	dispatch({
		type: "UPDATE_GENERATED_TOKENS_DATA",
		fieldName: "generated_tokens_data",
		payload: {
			total_tokens: total_generated_tokens,
			data: generated_tokens_data,
		},
	});

	dispatch({
		type: "UPDATE_HOURLY_REQUESTS_DATA",
		fieldName: "hourly_requests_data",
		payload: hourly_requests_data,
	});

	dispatch({
		type: "AVG_DAILY_REQUESTS",
		fieldName: "avg_daily_requests",
		payload: avg_daily_requests,
	});
};

export const parseChartData = (
	dispatch,
	chart_data,
	comp_chart_data,
	filters,
	conversion
) => {
	let daily_costs =
		chart_data && chart_data.daily_costs ? chart_data.daily_costs : [];
	// let total_usage =
	// 	chart_data && chart_data.total_usage ? chart_data.total_usage : 0;
	let total_usage = 0;
	let bar_chart_data = [];
	let donut_chart_data = [];
	let donut_map = {};
	let exchangeRate = conversion ? conversion : 1;
	for (let i = 0; i < daily_costs.length; i++) {
		let obj = {};
		let { timestamp, line_items } = daily_costs[i];
		// convert epoch time to date
		timestamp = moment.unix(timestamp).format("DD MMM");
		obj["topic"] = timestamp;
		for (let j = 0; j < line_items.length; j++) {
			let { name, cost } = line_items[j];

			if (filters.indexOf(name) > -1) {
				obj[name] = (cost / 100) * exchangeRate;
				total_usage += obj[name];
				if (donut_map[name]) {
					donut_map[name] =
						donut_map[name] + (cost / 100) * exchangeRate;
				} else {
					donut_map[name] = (cost / 100) * exchangeRate;
				}
			}
		}
		bar_chart_data.push(obj);
	}

	for (const [key, value] of Object.entries(donut_map)) {
		let obj = {};
		obj["topic"] = key;
		obj["cost"] = value;
		donut_chart_data.push(obj);
	}
	// console.log(total_usage);
	total_usage = total_usage.toFixed(2);
	// if (!total_usage || total_usage <= 0) total_usage = 0;
	// else total_usage = ((total_usage / 100) * exchangeRate).toFixed(2);
	let comp_total_usage =
		comp_chart_data && comp_chart_data.total_usage
			? comp_chart_data.total_usage
			: 0;

	comp_total_usage = ((comp_total_usage / 100) * exchangeRate).toFixed(2);
	// check percentage change of total usage
	let percentage_change = 0;
	if (comp_total_usage && comp_total_usage > 0) {
		percentage_change =
			((total_usage - comp_total_usage) / comp_total_usage) * 100;
		percentage_change = percentage_change.toFixed(2);
	}

	dispatch({
		type: "UPDATE_TOTAL_USAGE",
		fieldName: "total_usage",
		payload: total_usage,
	});
	dispatch({
		type: "UPDATE_BAR_CHART_DATA",
		fieldName: "bar_chart_data",
		payload: bar_chart_data,
	});
	dispatch({
		type: "UPDATE_DONUT_CHART_DATA",
		fieldName: "donut_chart_data",
		payload: donut_chart_data,
	});
	dispatch({
		type: "UPDATE_PERCENTAGE_TOTAL_USAGE_CHANGE",
		fieldName: "total_usage_percentage_change",
		payload: percentage_change,
	});
};
