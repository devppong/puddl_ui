import { Card, Title, BarChart, Metric,Flex,BadgeDelta,Callout } from "@tremor/react";
import React from 'react';
import { ExclamationIcon } from "@heroicons/react/solid";


export default function Barchart({ state, dispatch }) {
    // get the data for bar chart from reducer
    let bar_chart_data = state.bar_chart_data?state.bar_chart_data:[];
    let filters = state.filters?state.filters:[];
    let total_usage = state.total_usage?state.total_usage:0;
    let subscription_data = state.subscription_data?state.subscription_data:{};
    let total_usage_percentage_change = state.total_usage_percentage_change?state.total_usage_percentage_change:0;

    let currency = "USD";
    let symbol = "$";
    let soft_limit = 0;
    if(subscription_data&&subscription_data.countryInfo){
        currency = subscription_data.countryInfo.currency;
        symbol = subscription_data.countryInfo.symbol;
        soft_limit = subscription_data.countryInfo.soft_limit_usd;
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
        <Card className="h-full">
            <Title>Usage {"("+currency+")"}</Title>
            <Flex className="max-w-sm">
                <Metric>{symbol} {total_usage}</Metric>
                <BadgeDelta deltaType={getDeltaType(total_usage_percentage_change)}>{(total_usage_percentage_change?total_usage_percentage_change:0)+"%"}</BadgeDelta>
            </Flex>
            {
                (total_usage>soft_limit)&&(
                    <Callout
                        className="h-12 mt-4"
                        title="Critical Alerts"
                        icon={ExclamationIcon}
                        color="rose"
                    >
                        Turbine reached critical speed. Immediately reduce turbine speed.
                    </Callout>
                )
            }
            
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