export default function reducer(state, action) {
	switch (action.type) {
		case "UPDATE_DATE_RANGE": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_FILTERS": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_CHART_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_KPI_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_TOTAL_USAGE": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_BAR_CHART_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_DONUT_CHART_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_REQUESTS_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_TOKENS_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_CONTEXT_TOKENS_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_GENERATED_TOKENS_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_SUBSCRIPTION_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_PERCENTAGE_TOTAL_USAGE_CHANGE": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_COMP_CHART_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_HOURLY_REQUESTS_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "AVG_DAILY_REQUESTS": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_API_KEY": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_ORG_ID": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_ORG_USERS": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_USER_LEVEL_DATA": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_USER_REQUESTS": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_USER_TOKENS": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_USER_CONTEXT_TOKENS": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_USER_GENERATED_TOKENS": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		case "UPDATE_SELECTED_USER": {
			return {
				...state,
				[action.fieldName]: action.payload,
			};
		}
		default:
			return state;
	}
}
