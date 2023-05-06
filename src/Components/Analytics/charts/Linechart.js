import { Card, Title, LineChart, Metric, Callout, Flex, Text } from "@tremor/react";
import { ExclamationIcon } from "@heroicons/react/solid";
const dataFormatter = (number) =>
    `${Intl.NumberFormat("us").format(number).toString()}`;

export default function Linechart({ state, dispatch }) {
    let hourly_requests_data = state.hourly_requests_data ? state.hourly_requests_data : [];
    let avg_daily_requests = state.avg_daily_requests ? state.avg_daily_requests : 0;
    let { total_usage, subscription_data } = state;
    let soft_limit = 0;
    if (subscription_data && subscription_data.countryInfo) {
        soft_limit = subscription_data.soft_limit_usd;
    }
    return (

        <Card className="max-w-lg h-full">
            <Title>Avg Daily Traffic</Title>
            <Flex
                justifyContent="start"
                alignItems="baseline"
                className="space-x-1"
            >
                <Metric>{avg_daily_requests}</Metric>
                {/* <Text>{"(Last 30 days)"}</Text> */}
            </Flex>
            {
                (total_usage > soft_limit) && (
                    <Callout
                        className="h-12 mt-4"
                        title="Critical Alerts"
                        icon={ExclamationIcon}
                        color="rose"
                    >
                    </Callout>
                )
            }
            <LineChart
                className="mt-6"
                data={hourly_requests_data}
                index="name"
                categories={["Requests"]}
                colors={["blue"]}
                valueFormatter={dataFormatter}
                yAxisWidth={40}
            />
        </Card>
    );
} 