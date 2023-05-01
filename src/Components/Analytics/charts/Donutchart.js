import { Card, Title, DonutChart, Metric } from "@tremor/react";
import { Flex, Text,CategoryBar } from "@tremor/react";

const getUsageData = (subscription_data,total_usage)=>{
    let {soft_limit_usd,hard_limit_usd} = subscription_data;
    let soft_limit = soft_limit_usd?soft_limit_usd:0;
    let hard_limit = hard_limit_usd?hard_limit_usd:100;
    let soft_percentage = parseInt(((soft_limit/hard_limit)*100).toFixed(0));
    let percentage_array = [0,soft_percentage,100-soft_percentage];
    let percent_value = ((total_usage/hard_limit_usd)*100).toFixed(2);
    return {percentage_array,percent_value,hard_limit};
}

export default function Donutchart({ state, dispatch }) {
    let { donut_chart_data, filters,total_usage,subscription_data} = state;
    let symbol = "$";
    if(subscription_data&&subscription_data.countryInfo){
        symbol = subscription_data.countryInfo.symbol;
    }
    const valueFormatter = (number) =>
    `${symbol} ${Intl.NumberFormat("us").format(number).toString()}`;
    let {percentage_array,percent_value,hard_limit} = getUsageData(subscription_data?subscription_data:{},total_usage);
    return (
        <Card className="max-w-lg h-full">
            <Title>Cost</Title>
            <Flex
                justifyContent="start"
                alignItems="baseline"
                className="space-x-1"
                >
                <Metric>{symbol} {total_usage}</Metric>
                <Text>/ {hard_limit.toFixed(2)}</Text>
            </Flex>
            <DonutChart
                className="mt-6"
                data={donut_chart_data}
                category="cost"
                index="topic"
                valueFormatter={valueFormatter}
                colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
            />
            <Flex>
                <Text>45% of the limit</Text>
                <Text>{symbol} {total_usage}</Text>
            </Flex>
            <CategoryBar
                categoryPercentageValues={percentage_array}
                showLabels={true}
                colors={["emerald", "yellow", "orange", "rose"]}
                percentageValue={60}
                className="mt-3"
            />
        </Card>
    );
}