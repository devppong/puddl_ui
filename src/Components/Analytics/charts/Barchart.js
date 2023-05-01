import { Card, Title, BarChart, Metric,Flex,BadgeDelta } from "@tremor/react";
import React from 'react';
// import moment from "moment";


export default function Barchart({ state, dispatch }) {
    // get the data for bar chart from reducer
    let bar_chart_data = state.bar_chart_data?state.bar_chart_data:[];
    let filters = state.filters?state.filters:[];
    let total_usage = state.total_usage?state.total_usage:0;
    let subscription_data = state.subscription_data?state.subscription_data:{};
    let total_usage_percentage_change = state.total_usage_percentage_change?state.total_usage_percentage_change:0;

    let currency = "USD";
    let symbol = "$";
    if(subscription_data&&subscription_data.countryInfo){
        currency = subscription_data.countryInfo.currency;
        symbol = subscription_data.countryInfo.symbol;
    }
    const dataFormatter = (number) => {
        return symbol+ " " + Intl.NumberFormat("us").format(number).toString();
    };
    const getDeltaType = (total_usage_percentage_change)=>{
        if(total_usage_percentage_change>0){
            return "moderateIncrease";
        }else if(total_usage_percentage_change<0){
            return "moderateDecrease";
        }
        return "moderateIncrease";
        
    }
    return (
        <Card className="mt-6 gap-6">
            <Flex>
                <Title>Daily Usage {"("+currency+")"}</Title>
                <BadgeDelta deltaType={getDeltaType(total_usage_percentage_change)}>{total_usage_percentage_change}</BadgeDelta>
            </Flex>
            
            <Metric>{symbol} {total_usage}</Metric>
            <BarChart
                className="mt-6"
                data={bar_chart_data}
                index="topic"
                categories={filters}
                colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
                stack={true}
                showXAxis={true}
                showAnimation={true}
            />
        </Card>
    )
}