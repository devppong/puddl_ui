import { BarList, Card, Title, Bold, Flex, Text, Metric } from "@tremor/react";
import {
    TabList,
    Tab
} from "@tremor/react";
import { ChartBarIcon } from "@heroicons/react/solid";


export default function UserLevelRequests({ state, dispatch }) {
    let { user_level_reqs } = state;
    let total_requests = user_level_reqs && user_level_reqs.total_requests ? user_level_reqs.total_requests : 0;
    let data = user_level_reqs && user_level_reqs.data ? user_level_reqs.data : [];
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
                        <Bold>User</Bold>
                    </Text>
                    <Text>
                        <Bold>Requests</Bold>
                    </Text>
                </Flex>
            <BarList data={data} className="mt-2" />
        </Card>
    )
}