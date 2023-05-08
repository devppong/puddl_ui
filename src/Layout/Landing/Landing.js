/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useRef } from "react";
import {
	Box,
	Button,
	Container,
	Grid,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import logo from "./../../assets/puddl-logo.png";
import Typed from "typed.js";
import {
	AttractionsOutlined,
	History,
	InsertChartOutlined,
	Twitter,
} from "@mui/icons-material";
import "./Landing.css";
import LandingPageIcon from "./../../assets/landing-page.jpeg";
function Landing(props) {
	const el = useRef(null);

	useEffect(() => {
		const typed = new Typed(el.current, {
			strings: ["Write", "Test", "Track", "Iterate"],
			typeSpeed: 50,
			backSpeed: 30,
			loop: true,
			smartBackspace: false,
			shuffle: true,
			backDelay: 2500,
			startDelay: 1000,
			cursorChar: "_",
			showCursor: true,
		});
		return () => {
			typed.destroy();
		};
	}, []);
	return (
		<Container>
			<Toolbar
				sx={{
					zIndex: 20,
					paddingY: "0.75rem",
					position: "relative",
					display: "flex",
				}}
			>
				<Stack
					direction={"row"}
					sx={{ flexGrow: 1 }}
					alignItems={"center"}
				>
					<img
						src={logo}
						alt="logo"
						style={{ height: "2rem", display: "inline" }}
					/>
					<Typography
						variant="h5"
						color="#1d4ed8"
						noWrap
						fontSize={"1.5rem"}
						fontWeight={"bold"}
						marginX={"0.75rem"}
					>
						Puddl
					</Typography>
				</Stack>

				<Button
					variant="contained"
					sx={{
						bgcolor: "#1d4ed8",
						fontWeight: "700",
						fontFamily:
							"Inter,'Roboto','Helvetica','Arial',sans-serif",
					}}
					onClick={() => {
						props.setLogin(true);
					}}
				>
					Sign in
				</Button>
			</Toolbar>

			<Box sx={{ textAlign: "center", paddingY: "7rem" }}>
				<Typography
					variant="h2"
					sx={{
						fontWeight: "600",
						fontSize: "3.5rem",
						mb: "1.5rem",
					}}
				>
					Track your OpenAI costs for free.
					<span style={{ display: "block", color: "#1d4ed8" }}>
						<span ref={el} />
						<span className="typed-cursor" />
					</span>
				</Typography>
				<Typography
					variant="h6"
					sx={{
						fontWeight: "300",
						fontSize: "1.25rem",
						mb: "2.5rem",
					}}
				>
					Get insights to reduce costs in {" "}
					<b style={{ color: "#1d4ed8", fontWeight: "bolder" }}>
					seconds!
					</b>
				</Typography>
				<Button
					variant="contained"
					size="large"
					sx={{
						bgcolor: "#1d4ed8",
						fontWeight: "700",
						fontFamily:
							"Inter,'Roboto','Helvetica','Arial',sans-serif",
					}}
					onClick={() => {
						props.setLogin(true);
					}}
				>
					Get Started
				</Button>
			</Box>
			<Box>
				<Grid
					container
					spacing={2}
					sx={{
						display: "flex",
						alignItems: "center",
						flexFlow: "row wrap",
					}}
				>
					<Grid item lg={6}>
						<Typography
							variant="h1"
							fontSize={"3.5rem"}
							fontWeight={600}
							textAlign={"left"}
							px={{xs:"1rem",md:"0rem"}}
						>
							{"Get your "}
							{/* class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary capitalize" */}
							<span
								style={{
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									backgroundImage:
										"linear-gradient(to right,rgba(29,78,216,1),rgba(219,39,119,1))",
								}}
							>
								OpenAI Analytics
							</span>
							{" For Free!"}
						</Typography>
					</Grid>
					<Grid
						item
						centered
						lg={6}
						marginTop={{ lg: "0", md: "3rem" }}
						width={{ md: "100%" }}
						marginX={"auto"}
					>
						<img
							class="block mx-auto lg:mr-0 pr-6 lg:max-w-[500px]"
							src={LandingPageIcon}
							style={{
								filter: "drop-shadow(0.5rem 0.5rem 0.25rem rgba(0, 0, 0, 0.075))",
							}}
							width="500"
							height="370"
							alt="product image"
						/>
					</Grid>
				</Grid>
			</Box>
			<Box sx={{ paddingY: "1.5rem" }}>
				<Grid
					container
					spacing={4}
					display="flex"
					justifyContent="center"
				>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						mt={"1rem"}
						py={"1.5rem"}
						borderRadius={"0.25rem"}
					>
						<div
							style={{
								marginBottom: "2rem",
								backgroundImage:
									"linear-gradient(to right,rgba(29,78,216,1),rgba(219,39,119,1))",
								height: "0.25rem",
							}}
						></div>
						<Typography
							variant="h5"
							fontWeight={600}
							fontFamily={
								"Inter,'Roboto','Helvetica','Arial',sans-serif"
							}
							mb={"0.5rem"}
						>
							{"Detailed Cost"}
							<br />
							{"Breakdown"}
						</Typography>
						<Typography>
							Get Daily, Weekly and Monthly breakdown of your
							OpenAI costs.
						</Typography>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						mt={"1rem"}
						py={"1.5rem"}
						borderRadius={"0.25rem"}
					>
						<div
							style={{
								marginBottom: "2rem",
								backgroundImage:
									"linear-gradient(to right,rgba(29,78,216,1),rgba(219,39,119,1))",
								height: "0.25rem",
							}}
						></div>
						<Typography
							variant="h5"
							fontWeight={600}
							fontFamily={
								"Inter,'Roboto','Helvetica','Arial',sans-serif"
							}
							mb={"0.5rem"}
						>
							{"Currency"}
							<br />
							{"Localization"}
						</Typography>
						<Typography>
							Know your costs in your native currency, or USD; we
							have this covered.
						</Typography>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						mt={"1rem"}
						py={"1.5rem"}
						borderRadius={"0.25rem"}
					>
						<div
							style={{
								marginBottom: "2rem",
								backgroundImage:
									"linear-gradient(to right,rgba(29,78,216,1),rgba(219,39,119,1))",
								height: "0.25rem",
							}}
						></div>
						<Typography
							variant="h5"
							fontWeight={600}
							fontFamily={
								"Inter,'Roboto','Helvetica','Arial',sans-serif"
							}
							mb={"0.5rem"}
						>
							{"Model Wise"}
							<br />
							{"Spends"}
						</Typography>
						<Typography>
							Get request and token level details w.r.t the
							models.
						</Typography>
					</Grid>
				</Grid>
			</Box>

			<Box
				sx={{
					paddingY: "7rem",
				}}
			>
				<Stack
					direction={"column"}
					bgcolor={"rgba(239,246,255)"}
					py={"3rem"}
					px={{ md: "1.25rem", lg: "3rem" }}
				>
					<Grid
						container
						sx={{
							display: "flex",
							alignItems: "center",
							flexFlow: "row wrap",
						}}
						mb={"3rem"}
					>
						<Grid item md={5}>
							<Typography
								variant="h1"
								fontSize={"3.5rem"}
								fontWeight={600}
								textAlign={"left"}
								mb={"1.5rem"}
								px={{xs:"1rem",md:"0rem"}}
							>
								<span
									style={{
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundImage:
											"linear-gradient(to right,rgba(29,78,216,1),rgba(219,39,119,1))",
									}}
								>
									Good Things
								</span>
								{" are on the way."}
							</Typography>
							<Typography variant="body1" px={{xs:"1.5rem",md:"0rem"}}>
								Our LLM Ops tool will be launched soon. So, keep
								an eye out for that.
							</Typography>
						</Grid>
						<Grid item md={7}>
							<img
								alt="product"
								loading="lazy"
								src="https://d1pnnwteuly8z3.cloudfront.net/images/34042e2f-f9e4-4d41-97b0-9005b9f6513e/57a9ea1c-beb2-48b0-8a4f-5c7d12ad067f.png"
							/>
						</Grid>
					</Grid>
					<Grid container display="flex">
						<Grid item md={4} mb={"1rem"} px={"1.25rem"}>
							<Stack
								direction={"row"}
								mb={"1.5rem"}
								alignItems={"center"}
							>
								<AttractionsOutlined
									fontSize="large"
									sx={{ color: "#1d4ed8" }}
								></AttractionsOutlined>
								<Typography
									fontSize={"1.125rem"}
									lineHeight={"1.75rem"}
									fontWeight={600}
									ml={"1.5rem"}
								>
									Playground
								</Typography>
							</Stack>
							<Typography>
								Sleek Playground to create, test, iterate and
								save your prompts along with versions.
							</Typography>
						</Grid>
						<Grid item md={4} mb={"1rem"} px={"1.25rem"}>
							<Stack
								direction={"row"}
								mb={"1.5rem"}
								alignItems={"center"}
							>
								<History
									fontSize="large"
									sx={{ color: "#1d4ed8" }}
								></History>
								<Typography
									fontSize={"1.125rem"}
									lineHeight={"1.75rem"}
									fontWeight={600}
									ml={"1.5rem"}
								>
									History & Annotations
								</Typography>
							</Stack>
							<Typography>
								Our python library enables you to send LLM
								requests, track history and annotate
							</Typography>
						</Grid>
						<Grid item md={4} mb={"1rem"} px={"1.25rem"}>
							<Stack
								direction={"row"}
								mb={"1.5rem"}
								alignItems={"center"}
							>
								<InsertChartOutlined
									fontSize="large"
									sx={{ color: "#1d4ed8" }}
								></InsertChartOutlined>
								<Typography
									fontSize={"1.125rem"}
									lineHeight={"1.75rem"}
									fontWeight={600}
									ml={"1.5rem"}
								>
									Deep Analytics
								</Typography>
							</Stack>
							<Typography>
								We provide ways to organize and track your
								requests across deployments.
							</Typography>
						</Grid>
					</Grid>
				</Stack>
			</Box>
			<Stack direction={"column"}>
				<Grid container spacing={2} mb="3rem">
					<Grid item md={3} xs={12}>
						<Stack direction={"column"}>
							<Typography
								variant="h5"
								fontWeight={600}
								align="center"
								mb="0.75rem"
								color={"#1d4ed8"}
							>
								Puddl
							</Typography>
							<Typography align="center">
								Track your OpenAI costs for free.
							</Typography>
						</Stack>
					</Grid>
					<Grid item md={3} xs={12}>
						<Stack direction={"column"}>
							<Typography
								variant="body1"
								fontWeight={600}
								align="center"
								mb="0.75rem"
							>
								Product
							</Typography>
							<Button
								sx={{ color: "#1d4ed8" }}
								onClick={() => {
									props.setLogin(true);
								}}
							>
								Sign Up
							</Button>
						</Stack>
					</Grid>
					<Grid item md={3} xs={12}>
						<Stack direction={"column"}>
							<Typography
								variant="body1"
								fontWeight={600}
								align="center"
								mb="0.75rem"
							>
								Company
							</Typography>
							<Button
								sx={{ color: "#1d4ed8", cursor: "no-drop" }}
							>
								Terms
							</Button>
						</Stack>
					</Grid>
					<Grid item md={3} xs={12}>
						<Stack direction={"column"}>
							<Typography
								variant="body1"
								fontWeight={600}
								align="center"
								mb="0.75rem"
							>
								Connect With Us
							</Typography>
							<a
								href="https://twitter.com/Puddl_LLMOps"
								target="_blank"
								rel="noreferrer"
							>
								<Twitter
									sx={{
										display: "block",
										marginX: "auto",
										color: "#1d4ed8",
									}}
								></Twitter>
							</a>
						</Stack>
					</Grid>
				</Grid>
				<Typography variant="body2" align="center" mb="3rem">
					© 2023 Puddl Inc. All rights reserved.
				</Typography>
			</Stack>
		</Container>
	);
}

export default Landing;
