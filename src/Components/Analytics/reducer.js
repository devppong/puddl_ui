export default function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_DATE_RANGE': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_FILTERS': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_CHART_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_TOTAL_USAGE': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_BAR_CHART_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_DONUT_CHART_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_REQUESTS_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_TOKENS_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_CONTEXT_TOKENS_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_GENERATED_TOKENS_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_SUBSCRIPTION_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_PERCENTAGE_TOTAL_USAGE_CHANGE': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case 'UPDATE_COMP_CHART_DATA': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        default:
            return state;
    }
  }