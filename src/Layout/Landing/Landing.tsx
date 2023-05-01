import React, { useRef, useEffect } from "react";
import "./Landing.css";
import {
	Box,
	Button,
	Divider,
	Grid,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import Typed from "typed.js";
import landingAnalyticsImg from "./../../assets/Landing_page_analaytics_img.png";
import landingAnalyticsImg2 from "./../../assets/Landing_page_analaytics_img2.png";
import landingComingSoonImg1 from "./../../assets//Landing_page_coming_soon_1.png";
import landingComingSoonImg2 from "./../../assets/Landing_page_coming_soon_2.png";

function Landing(props: any) {
	const el = useRef(null);

	useEffect(() => {
		const typed = new Typed(el.current, {
			strings: ["write", "Test", "Track", "Iterate"],
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
		<div>
			<Toolbar>
				<Typography
					component="h1"
					variant="h6"
					color="#2149D9"
					noWrap
					sx={{ flexGrow: 1 }}
				>
					Puddl
				</Typography>
				<Stack direction="row" spacing={5}>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "#2149D9",
						}}
					>
						docs
					</Button>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "#2149D9",
						}}
					>
						pricing
					</Button>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "#2149D9",
						}}
					>
						about
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							props.setLogin(true);
						}}
					>
						Sign in
					</Button>
				</Stack>
			</Toolbar>
			<Box sx={{ textAlign: "center" }}>
				<Typography
					variant="h3"
					sx={{
						border: "1px solid #2149D9",
						width: "fit-content",
						fontFamily: "Roboto",
						mx: "auto",
						p: "15px",
						mt: "5vh",
					}}
				>
					Say Hello to <b style={{ color: "#2149D9" }}>Puddl</b>
				</Typography>
				<Typography
					variant="h1"
					sx={{ mt: "3vh" }}
					fontFamily={"Roboto"}
					color={"#2149D9"}
					fontWeight={200}
				>
					A Better Way to Prompt
				</Typography>
				<Typography
					variant="h1"
					align="center"
					sx={{ fontFamily: "Roboto", mt: "3vh" }}
				>
					<span ref={el} />
					<span className="typed-cursor" />
				</Typography>
				<Button variant="contained" sx={{ mt: "3vh" }}>
					get started!
				</Button>
			</Box>
			<Box>
				<Grid container spacing={2}>
					<Grid item xs={9}>
						<img
							src={landingAnalyticsImg}
							alt=""
							style={{
								display: "block",
								width: "50vw",
								margin: "5vh 15% 0 auto",
							}}
						/>
					</Grid>
					<Grid item xs={2.5} position="relative">
						<img
							src={landingAnalyticsImg2}
							alt=""
							style={{
								width: "70%",
								maxWidth: "220px",
								margin: "auto",
								display: "block",
								justifyContent: "center",
								position: "absolute",
								top: "-90px",
								left: "50%",
								transform: "translateX(-50%)",
							}}
						/>
						<Typography
							variant="h4"
							color={"#2149D9"}
							fontWeight={300}
							marginTop={"200px"}
						>
							Stay on top of your OpenAI spends for <b>Free</b>!
						</Typography>
						<ul
							style={{
								fontFamily: "Montserrat",
								listStyleType: "disc",
							}}
						>
							<li>Daily, weekly and monthly break downs</li>
							<li>Model wise spends</li>
							<li>Requests and Tokens w.r.t models</li>
							<li>Spend vs Hard Limit</li>
						</ul>
					</Grid>
				</Grid>
			</Box>
			<Divider
				sx={{
					width: "50%",
					margin: "10vh auto 5vh auto",
					border: "1px solid #BDBDBD",
				}}
			/>
			<Box>
                <Typography variant="h3" textAlign={'center'} fontFamily={'Roboto'} fontWeight={400}>Coming Soon...</Typography>
                <Typography variant="h4" textAlign={'center'} fontFamily={'Roboto'} fontWeight={300} margin={'3vh auto 5vh auto'}>Playground, Prompt Registry, Annotations and much more! </Typography>
				<Grid container spacing={2}>
					<Grid item xs={7.5}>
						<img
							src={landingComingSoonImg1}
							alt=""
							style={{
								display: "block",
								width: "50vw",
								margin: "auto 0 auto auto",
							}}
						/>
						<div></div>
						<Box sx={{ width: "35vw" }}>
							<Typography
								variant="h3"
								color={"#2149D9"}
								fontWeight={300}
								margin={"2vh 0 2vh 5vw"}
								sx={{ textAlign: "right" }}
							>
								Track history and annotate generations.
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={3} position="relative">
						<Typography
							variant="h3"
							color={"#2149D9"}
							fontWeight={300}
							margin={"5vh 2vw"}
							height={"15vh"}
						>
							Sleek playground to iterate your prompts.
						</Typography>
						<img
							src={landingComingSoonImg2}
							alt=""
							style={{
								position: "absolute",
								transform: "translateX(-50%)",
								width: "50vw",
							}}
						/>
					</Grid>
				</Grid>
			</Box>
			<Box sx={{ mt: "10vh" }}>
				<Button
					variant="contained"
					sx={{ margin: "auto", display: "block" }}
				>
					get started!
				</Button>
				<Stack direction="row" spacing={5} sx={{margin:'1vh auto', justifyContent: "center" }}>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "black",
						}}
					>
						product
					</Button>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "black",
						}}
					>
						docs
					</Button>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "black",
						}}
					>
						pricing
					</Button>
					<Button
						sx={{
							textTransform: "lowercase",
							fontWeight: "normal",
							color: "black",
						}}
					>
						about
					</Button>
                    <Typography variant="body1" sx={{position:'absolute', right:'2vw'}}>2023, Puddl, Inc.</Typography>
				</Stack>
			</Box>
		</div>
	);
}

export default Landing;
