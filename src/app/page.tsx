"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Tables from "../../Components/Table";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface User {
	username: string;
}

export default function Home() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const [username, setUsername] = useState("");

	const handleLogin = async () => {
		try {
			const response = await fetch(
				"https://frontend-test-api.aircall.io/auth/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: "hello",
						password: "1234",
					}),
				},
			);

			if (response.ok) {
				const data = await response.json();
				// Process the data returned from the API
				console.log(data);
				localStorage.setItem("token", data.access_token);
			} else {
				// Handle the error response
				console.error("API request failed with status:", response.status);
			}
		} catch (error) {
			// Handle any network or other errors
			console.error("Error occurred while making the API request:", error);
		}
	};

	const authenticatedUser = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				console.error("Access token not found in localStorage");
				return;
			}

			const response = await fetch("https://frontend-test-api.aircall.io/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data: User = await response.json();
				setUsername(data.username);
			} else {
				// Handle the error response
				console.error("API request failed with status:", response.status);
			}
		} catch (error) {
			// Handle any network or other errors
			console.error("Error occurred while making the API request:", error);
		}
	};

	useEffect(() => {
		authenticatedUser();
	}, []);

	return (
		<main className={styles.main}>
			<button onClick={handleLogin} className={styles.button}>Login</button>

			<div className={styles.card}>
				<span className={styles.heading}>{username}</span>
				<button className={styles.button}>Logout</button>
			</div>

			<div className={styles.title}>Turing Technologies Frontend Test</div>

			<span>Filter By: {"  "}</span>

			<span
				id={styles["basic-button"]}
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup='true'
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}>
				Status
			</span>
			<Menu
				id={styles["basic-menu"]}
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}>
				<MenuItem>All</MenuItem>
				<MenuItem>Archived</MenuItem>
				<MenuItem>Unarchive</MenuItem>
			</Menu>

			<Tables />
		</main>
	);
}
