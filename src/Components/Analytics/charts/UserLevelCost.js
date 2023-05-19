import { Card, Title, DonutChart, Metric, Legend } from "@tremor/react";
import { Flex, Text, CategoryBar } from "@tremor/react";

const getUsageData = (subscription_data, total_usage) => {
	let { soft_limit_usd, hard_limit_usd } = subscription_data;
	let soft_limit = soft_limit_usd ? soft_limit_usd : 0;
	let hard_limit = hard_limit_usd ? hard_limit_usd : 100;
	let soft_percentage = parseInt(
		((soft_limit / hard_limit) * 100).toFixed(0)
	);
	let limit1 = parseInt(soft_percentage.toFixed(0));
	let rem_per = 100 - soft_percentage;
	let limit2 = parseInt((0.2 * rem_per).toFixed(0));
	let limit3 = parseInt((0.8 * rem_per).toFixed(0));
	let percentage_array = [limit1, limit2, limit3];
	let percent_value = ((total_usage / hard_limit_usd) * 100).toFixed(2);
	return { percentage_array, percent_value, hard_limit };
};
const getPercentage = (hard_limit, total_usage) => {
	let percent_value = 0;
	try {
		percent_value = ((total_usage / hard_limit) * 100).toFixed(2);
	} catch (e) {
		percent_value = 0;
	}
	return percent_value;
};
export default function UserLevelCost({ state, dispatch }) {
	let { user_level_costs, filters, total_usage, subscription_data } = state;
	// console.log(user_level_costs);
	let symbol = "$";
	// let soft_limit = 0;
	if (subscription_data && subscription_data.countryInfo) {
		symbol = subscription_data.countryInfo.symbol;
		// soft_limit = subscription_data.soft_limit_usd;
	}
	let { selectedUSD } = state;
	if (selectedUSD) {
		symbol = "$";
	}
	const valueFormatter = (number) =>
		`${symbol} ${Intl.NumberFormat("us").format(number).toString()}`;
	let { percentage_array, percent_value, hard_limit } = getUsageData(
		subscription_data ? subscription_data : {},
		total_usage
	);
	return (
		<Card className='max-w-lg h-full'>
			<Title>User Level Cost</Title>
			<Flex
				justifyContent='start'
				alignItems='baseline'
				className='space-x-1'
			>
				<Metric>
					{symbol} {total_usage}
				</Metric>
				<Text>/ {hard_limit.toFixed(2)}</Text>
			</Flex>
			<DonutChart
				variant='pie'
				className='mt-6'
				data={user_level_costs}
				category='cost'
				index='name'
				valueFormatter={valueFormatter}
				colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
				showLabel={true}
			/>
			{user_level_costs && (
				<Flex justifyContent="center">
					<Legend
						className='mt-6'
						categories={user_level_costs.map((item) => item.name)}
						colors={[
							"blue",
							"teal",
							"amber",
							"rose",
							"indigo",
							"emerald",
						]}
					/>
				</Flex>
			)}

			{/* <Flex>
				<Text>
					{getPercentage(hard_limit, total_usage)}% of the limit
				</Text>
				<Text>
					{symbol} {hard_limit.toFixed(2)}
				</Text>
			</Flex>
			<CategoryBar
				categoryPercentageValues={percentage_array}
				// showLabels={true}
				colors={["emerald", "orange", "rose"]}
				percentageValue={getPercentage(hard_limit, total_usage)}
				className='mt-3'
			/> */}
		</Card>
	);
}
