import { BarList, Card, Title, Bold, Flex, Text, Metric } from "@tremor/react";
import {
    TabList,
    Tab
} from "@tremor/react";
import { ChartBarIcon } from "@heroicons/react/solid";


export default function CompUIReq({ state, dispatch }) {
    let { requests_data } = state;
    let total_requests = requests_data && requests_data.total_requests ? requests_data.total_requests : 0;
    let data = requests_data && requests_data.data ? requests_data.data : [];
    data.sort(function (a, b) {
        return b['value'] - a['value'];
    });
    return (
        <Card className="max-w-lg h-full">
            <Title>Requests</Title>
            <Metric>{total_requests.toLocaleString()}</Metric>
          
            <TabList
                defaultValue="total"
                className="mt-6"
            >
                <Tab value="total" text="Total" icon={ChartBarIcon} />
            </TabList>
            <Flex className="mt-4">
                    <Text>
                        <Bold>Model</Bold>
                    </Text>
                    <Text>
                        <Bold>Requests</Bold>
                    </Text>
                </Flex>
            <BarList data={data} className="mt-2" />
        </Card>
    )
}