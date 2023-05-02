import axios from "axios";
import moment from "moment";
const countries = require('iso-country-currency');
const prompt_api_url = "https://puddlapi.puddl.io/prompt"

const getOpenAIHeaders = (token) => {
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return headers;
}

const getToken = (state) =>{
    return state.api_key;
}

const getPromptAPIHeaders = () => {
    const headers = {headers:{'Content-Type': 'application/json'}}
    return headers;
}

const axiosGet = async (url,headers) => {
    const response = await axios.get(url, headers);
    if(response.status === 200)
        return response.data;
    else
        return null;
}

export const updateApiKey = async(dispatch,state, key) => {
    await dispatch({
        type: 'UPDATE_API_KEY',
        fieldName: 'api_key',
        payload: key
    });
    state.api_key = key;
    getSubscriptionData(dispatch,state,key);
    updateDateRange(dispatch, state, state.date_range);
}

export const updateDateRange= async(dispatch,state, date_range) => {
    dispatch({
        type: 'UPDATE_DATE_RANGE',
        fieldName: 'date_range',
        payload: date_range
    });
    if(date_range&&date_range.length>0){
        getCostMetrics(dispatch,state,date_range);
        getKPIMetrics(dispatch,state,date_range);
    }
}
  
export const updateFilters = (dispatch,state, filters) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters ,fieldName: 'filters'});
    let {chart_data,comp_chart_data} = state;
    parseChartData(dispatch,chart_data,comp_chart_data,filters);
}

export const getCostMetrics = async(dispatch,state,date_range) => {
    let start_date = moment(date_range[0]).format("YYYY-MM-DD");
    let end_date = moment(date_range[0]).add('1','days').format("YYYY-MM-DD");
    if(date_range.length>1){
        end_date = moment(date_range[1]).format("YYYY-MM-DD");
    }
    let url = `https://api.openai.com/dashboard/billing/usage?start_date=${start_date}&end_date=${end_date}`;
    let token = getToken(state);
    let headers = getOpenAIHeaders(token?token:"");
    let chart_data = await axiosGet(url,headers);
    let comp_date_range = getCompDateRange(date_range);
    let comp_url = `https://api.openai.com/dashboard/billing/usage?start_date=${comp_date_range[0]}&end_date=${comp_date_range[1]}`;
    let comp_chart_data = await axiosGet(comp_url,headers);
    if(!chart_data) return;
    dispatch({ type: 'UPDATE_CHART_DATA', payload: chart_data ,fieldName: 'chart_data'});
    dispatch({ type: 'UPDATE_COMP_CHART_DATA', payload: comp_chart_data ,fieldName: 'comp_chart_data'});
    let {filters} = state;
    parseChartData(dispatch,chart_data,comp_chart_data,filters);
}

function getCompDateRange(date_range){
    let start_date = moment(date_range[0]).format("YYYY-MM-DD");
    let end_date = moment(date_range[0]).add('1','days').format("YYYY-MM-DD");
    if(date_range.length>1){
        end_date = moment(date_range[1]).format("YYYY-MM-DD");
    }
    let num_of_days = moment(end_date).diff(moment(start_date),'days');
    let comp_start_date = moment(start_date).subtract(num_of_days,'days').format("YYYY-MM-DD");
    let comp_end_date = moment(end_date).subtract(num_of_days,'days').format("YYYY-MM-DD");
    return [comp_start_date,comp_end_date];
}

function getAllDatesInRange(startDate, endDate) {
    const dates = [];
    let currDate = moment(startDate).startOf('day');
    const lastDate = moment(endDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(currDate.clone().format('YYYY-MM-DD'));
    }
    return dates;
}

export const getKPIMetrics = async(dispatch,state,date_range) => {
    let start_date = moment(date_range[0]).format("YYYY-MM-DD");
    let end_date = moment(date_range[0]).add('1','days').format("YYYY-MM-DD");
    if(date_range.length>1){
        end_date = moment(date_range[1]).format("YYYY-MM-DD");
    }
    const datesInRange = getAllDatesInRange(start_date, end_date);
    let promise_array = [];
    let token = getToken(state);
    let headers = getOpenAIHeaders(token?token:"");
    datesInRange.forEach(date => {
        let url = `https://api.openai.com/v1/usage?date=${date}`;
        promise_array.push(axiosGet(url,headers));
    });
    let kpi_data = await Promise.all(promise_array);
    if(!kpi_data) return;
    parseKPIData(dispatch,kpi_data);
}

export const validateApiKey = async(api_key) => {
    let headers = {
        headers: {
            Authorization: `Bearer ${api_key}`,
        },
    };

    let url = `https://api.openai.com/v1/engines`;
    let engines = await axiosGet(url,headers);
    if(!engines) return false;
    if(engines.error){
        return false;
    }
    return true;
}

export const getSubscriptionData = async(dispatch,state) => {
    let token = getToken(state);
    let headers = getOpenAIHeaders(token?token:"");
    let url = `https://api.openai.com/dashboard/billing/subscription`;
    let subscription_data = await axiosGet(url,headers);
    if(!subscription_data) return;
    parseSubscriptionData(dispatch,subscription_data);
}

export const parseSubscriptionData = async (dispatch,subscription_data) => {
    let {soft_limit_usd,hard_limit_usd,billing_address} = subscription_data;
    let countryName = 'US';
    if(billing_address&&billing_address.country){
        countryName = billing_address.country;
    }
    let countryInfo = countries.getAllInfoByISO(countryName);
    let {currency} = countryInfo;
    let url = prompt_api_url+`/currencyConversion/${currency}`
    let headers = getPromptAPIHeaders();
    try{
        let exchangeRate = await axiosGet(url,headers);
        let conversion = exchangeRate.conversion;
        soft_limit_usd = soft_limit_usd*conversion;
        hard_limit_usd = hard_limit_usd*conversion;
    }catch(e){
        console.log(e);
    }
    

    dispatch({
        type: 'UPDATE_SUBSCRIPTION_DATA',
        fieldName: 'subscription_data',
        payload: {
            soft_limit_usd,
            hard_limit_usd,
            countryInfo
           // countryCurrency
        }
    });

}
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
export const parseKPIData = (dispatch,kpi_data) => {
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
        if(i<10){
            i = '0'+i;
        }else{
            i = ''+i;
        }
        hourly_requests_map[i] = 0;
    }
    for (let i = 0; i < kpi_data.length; i++) {
        let data = kpi_data[i].data;
        for (let j = 0; j < data.length; j++) {
            let {snapshot_id,n_requests,n_context_tokens_total,n_generated_tokens_total,aggregation_timestamp} = data[j];

            total_requests += n_requests;
            if(requests_map[snapshot_id]){
                requests_map[snapshot_id] = requests_map[snapshot_id] + n_requests;
            }else{
                requests_map[snapshot_id] = n_requests;
            }
            let aggregation_hour = moment.unix(aggregation_timestamp).format("HH");
            if(hourly_requests_map[aggregation_hour]){
                hourly_requests_map[aggregation_hour] = hourly_requests_map[aggregation_hour] + n_requests;
            }else{
                hourly_requests_map[aggregation_hour] = n_requests;
            }
            total_tokens = total_tokens+ n_generated_tokens_total+ n_context_tokens_total;
            if(tokens_map[snapshot_id]){
                tokens_map[snapshot_id] = tokens_map[snapshot_id] + n_generated_tokens_total+n_context_tokens_total;
            }else{
                tokens_map[snapshot_id] = n_generated_tokens_total+n_context_tokens_total;
            }

            total_context_tokens = total_context_tokens+ n_context_tokens_total;
            if(context_tokens_map[snapshot_id]){
                context_tokens_map[snapshot_id] = context_tokens_map[snapshot_id] + n_context_tokens_total;
            }else{
                context_tokens_map[snapshot_id] = n_context_tokens_total;
            }

            total_generated_tokens = total_generated_tokens+ n_generated_tokens_total;
            if(generated_tokens_map[snapshot_id]){
                generated_tokens_map[snapshot_id] = generated_tokens_map[snapshot_id] + n_generated_tokens_total;
            }else{
                generated_tokens_map[snapshot_id] = n_generated_tokens_total;
            }

        }
    }

    let requests_data=[], tokens_data=[], context_tokens_data=[], generated_tokens_data = [],hourly_requests_data=[];
    for (const [key, value] of Object.entries(requests_map)) {
        requests_data.push({name:key,value:value});
    }
    for (const [key, value] of Object.entries(tokens_map)) {
        tokens_data.push({name:key,value:value});
    }
    for (const [key, value] of Object.entries(context_tokens_map)) {
        context_tokens_data.push({name:key,value:value});
    }
    for (const [key, value] of Object.entries(generated_tokens_map)) {
        generated_tokens_data.push({name:key,value:value});
    }
    for (const [key, value] of Object.entries(hourly_requests_map)) {
        hourly_requests_data.push({name:key,Requests:value});
    }
    let avg_daily_requests = kpi_data.length && kpi_data.length>0 ? (total_requests/kpi_data.length).toFixed(0):0;
    dispatch({
        type: 'UPDATE_REQUESTS_DATA',
        fieldName: 'requests_data',
        payload: {"total_requests":total_requests,"data":requests_data}
    });

    dispatch({
        type: 'UPDATE_TOKENS_DATA',
        fieldName: 'tokens_data',
        payload: {"total_tokens":total_tokens,"data":tokens_data}
    });

    dispatch({
        type: 'UPDATE_CONTEXT_TOKENS_DATA',
        fieldName: 'context_tokens_data',
        payload: {"total_tokens":total_context_tokens,"data":context_tokens_data}
    });

    dispatch({
        type: 'UPDATE_GENERATED_TOKENS_DATA',
        fieldName: 'generated_tokens_data',
        payload: {"total_tokens":total_generated_tokens,"data":generated_tokens_data}
    });

    dispatch({
        type: 'UPDATE_HOURLY_REQUESTS_DATA',
        fieldName: 'hourly_requests_data',
        payload: hourly_requests_data
    });

    dispatch({
        type: 'AVG_DAILY_REQUESTS',
        fieldName: 'avg_daily_requests',
        payload: avg_daily_requests
    });
}

export const parseChartData = (dispatch,chart_data,comp_chart_data,filters) => {
    let daily_costs = chart_data&& chart_data.daily_costs?chart_data.daily_costs:[];
    let total_usage = chart_data&&chart_data.total_usage?chart_data.total_usage:0;
    let bar_chart_data = [];
    let donut_chart_data = [];
    let donut_map = {};
    for (let i = 0; i < daily_costs.length; i++) {
        let obj = {};
        let {timestamp,line_items} = daily_costs[i];
        // convert epoch time to date 
        timestamp = moment.unix(timestamp).format("DD MMM");
        obj["topic"] = timestamp;
        for (let j = 0; j < line_items.length; j++) {
            let {name,cost} = line_items[j];
            if(filters.indexOf(name) > -1){
                obj[name] = cost;
                if(donut_map[name]){
                    donut_map[name] = donut_map[name] + cost;
                }else{
                    donut_map[name] = cost;
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

    if(!total_usage|| total_usage<=0) total_usage = 0;
    else total_usage = total_usage.toFixed(2);
    let comp_total_usage = comp_chart_data&&comp_chart_data.total_usage?comp_chart_data.total_usage:0;
    // check percentage change of total usage
    let percentage_change = 0;
    if(comp_total_usage && comp_total_usage>0){
        percentage_change = ((total_usage-comp_total_usage)/comp_total_usage)*100;
        percentage_change = percentage_change.toFixed(2);
    }

    dispatch({
        type: 'UPDATE_TOTAL_USAGE',
        fieldName: 'total_usage',
        payload: total_usage
    });
    dispatch({
        type: 'UPDATE_BAR_CHART_DATA',
        fieldName: 'bar_chart_data',
        payload: bar_chart_data
    });
    dispatch({
        type: 'UPDATE_DONUT_CHART_DATA',
        fieldName: 'donut_chart_data',
        payload: donut_chart_data
    });
    dispatch({
        type: 'UPDATE_PERCENTAGE_TOTAL_USAGE_CHANGE',
        fieldName: 'total_usage_percentage_change',
        payload: percentage_change
    });
}