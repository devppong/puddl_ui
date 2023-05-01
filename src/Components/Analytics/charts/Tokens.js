import { BarList, Card, Title, Bold, Flex, Text, Metric } from "@tremor/react";
import { ChartBarIcon, SortAscendingIcon ,LightningBoltIcon } from "@heroicons/react/solid";

import {
    TabList,
    Tab,
} from "@tremor/react";

import { useState } from "react";

const renderCard = (value,state) => {
    let {tokens_data,context_tokens_data,generated_tokens_data} = state;
    if (value === "total") {
        let data = tokens_data && tokens_data.data ? tokens_data.data : [];
        return (
            <div className="max-w-lg">
                <Flex className="mt-4">
                    <Text>
                        <Bold>Model</Bold>
                    </Text>
                    <Text>
                        <Bold>Requests</Bold>
                    </Text>
                </Flex>
                <BarList data={data} className="mt-2" />
            </div>
        )
    }
    else if (value === "context") {
        let data = context_tokens_data && context_tokens_data.data ? context_tokens_data.data : [];
        return (
            <div className="max-w-lg">
                <Flex className="mt-4">
                    <Text>
                        <Bold>Model</Bold>
                    </Text>
                    <Text>
                        <Bold>Requests</Bold>
                    </Text>
                </Flex>
                <BarList data={data} className="mt-2" />
            </div>
        )
    }
    else if (value === "generated") {
        let data = generated_tokens_data && generated_tokens_data.data ? generated_tokens_data.data : [];
        return (
            <div className="max-w-lg">
                <Flex className="mt-4">
                    <Text>
                        <Bold>Model</Bold>
                    </Text>
                    <Text>
                        <Bold>Requests</Bold>
                    </Text>
                </Flex>
                <BarList data={data} className="mt-2" />
            </div>
        )
    }
}
const getTotalMetrics = (value,state) => {
    let {tokens_data,context_tokens_data,generated_tokens_data} = state;
    if (value === "total"){
        return tokens_data&&tokens_data.total_tokens? tokens_data.total_tokens:0;
    }else if(value==="context"){
        return context_tokens_data&&context_tokens_data.total_tokens? context_tokens_data.total_tokens:0;
    }else if(value==="generated"){
        return generated_tokens_data&&generated_tokens_data.total_tokens? generated_tokens_data.total_tokens:0;
    }

}

export default function CompUITok({ state, dispatch }) {
    const [showCard, setShowCard] = useState("total");
    return (
        <Card className="max-w-lg h-full">
            <Title>Tokens</Title>
            <Metric>{getTotalMetrics(showCard, state)}</Metric>
            <>
                <TabList
                    defaultValue="1"
                    onValueChange={(value) => setShowCard(value)}
                    className="mt-6"
                >
                    <Tab value="total" text="Total" icon={ChartBarIcon} />
                    <Tab value="context" text="Context" icon={SortAscendingIcon} />
                    <Tab value="generated" text="Generated" icon={LightningBoltIcon} />
                </TabList>
            </>

            {renderCard(showCard, state)}
        </Card>
    );
};