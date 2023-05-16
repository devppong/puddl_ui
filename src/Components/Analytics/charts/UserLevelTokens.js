import { BarList, Card, Title, Bold, Flex, Text, Metric } from "@tremor/react";
import {
	ChartBarIcon,
	SortAscendingIcon,
	LightningBoltIcon,
} from "@heroicons/react/solid";

import { TabList, Tab } from "@tremor/react";

import { useState } from "react";

const renderCard = (value, state) => {
	let {
		user_tokens_data,
		user_context_tokens_data,
		user_generated_tokens_data,
	} = state;
	if (value === "total") {
		let data =
			user_tokens_data && user_tokens_data.data
				? user_tokens_data.data
				: [];
		data.sort(function (a, b) {
			return b["value"] - a["value"];
		});
		return (
			<div className="max-w-lg">
				<Flex className="mt-4">
					<Text>
						<Bold>User</Bold>
					</Text>
					<Text>
						<Bold>Requests</Bold>
					</Text>
				</Flex>
				<BarList data={data} className="mt-2" />
			</div>
		);
	} else if (value === "context") {
		let data =
			user_context_tokens_data && user_context_tokens_data.data
				? user_context_tokens_data.data
				: [];
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
		);
	} else if (value === "generated") {
		let data =
			user_generated_tokens_data && user_generated_tokens_data.data
				? user_generated_tokens_data.data
				: [];
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
		);
	}
};
const getTotalMetrics = (value, state) => {
	let {
		user_tokens_data,
		user_context_tokens_data,
		user_generated_tokens_data,
	} = state;
	if (value === "total") {
		return user_tokens_data && user_tokens_data.total_tokens
			? user_tokens_data.total_tokens
			: 0;
	} else if (value === "context") {
		return user_context_tokens_data && user_context_tokens_data.total_tokens
			? user_context_tokens_data.total_tokens
			: 0;
	} else if (value === "generated") {
		return user_generated_tokens_data &&
			user_generated_tokens_data.total_tokens
			? user_generated_tokens_data.total_tokens
			: 0;
	}
};

export default function UserLevelTokens({ state, dispatch }) {
	const [showCard, setShowCard] = useState("total");
	return (
		<Card className="max-w-lg h-full">
			<Title>Tokens</Title>
			<Metric>{getTotalMetrics(showCard, state).toLocaleString()}</Metric>
			<>
				<TabList
					defaultValue="total"
					onValueChange={(value) => setShowCard(value)}
					className="mt-6"
				>
					<Tab value="total" text="Total" icon={ChartBarIcon} />
					<Tab
						value="context"
						text="Context"
						icon={SortAscendingIcon}
					/>
					<Tab
						value="generated"
						text="Generated"
						icon={LightningBoltIcon}
					/>
				</TabList>
			</>

			{renderCard(showCard, state)}
		</Card>
	);
}
