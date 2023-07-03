"use client";

import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./Table.module.css";
// import { Container } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey[100],
		color: theme.palette.common.black,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(() => ({
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};

interface Call {
	id: number;
	call_type: string;
	direction: string;
	from: string;
	to: string;
	via: string;
	duration: number;
	created_at: string;
	notes: { id: number; content: string }[]; // Add a notes property to the Call interface
	is_archived: boolean;
}

export default function Tables() {
	const [open, setOpen] = useState(false);
	const [callsData, setCallsData] = useState<Call[]>([]);
	const [selectedCallId, setSelectedCallId] = useState<number | null>(null);
	const [selectedCallData, setSelectedCallData] = useState<Call | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [callsPerPage] = useState(5);

	const handleOpen = async (callId: number) => {
		setSelectedCallId(callId);
		await fetchCallData(callId);
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	const fetchUserCallsData = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				console.error("Access token not found in localStorage");
				return;
			}

			let url = "https://frontend-test-api.aircall.io/calls";

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				// Process the data returned from the API
				// console.log(data.nodes);
				setCallsData(data.nodes);
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
		fetchUserCallsData();
	}, []);

	const fetchCallData = async (callId: number) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				console.error("Access token not found in localStorage");
				return;
			}

			const response = await fetch(
				`https://frontend-test-api.aircall.io/calls/${callId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.ok) {
				const data: Call = await response.json();
				// Process the fetched call data as needed
				setSelectedCallData(data);
			} else {
				// Handle the error response
				console.error("API request failed with status:", response.status);
			}
		} catch (error) {
			// Handle any network or other errors
			console.error("Error occurred while making the API request:", error);
		}
	};

	// const handleCallClick = async (callId: number) => {
	// 	setSelectedCallId(callId);
	// 	await fetchCallData(callId);
	// };

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear().toString();
		return `${day}-${month}-${year}`;
	};

	const getCallTypeColor = (callType: string) => {
		if (callType === "missed") {
			return "#d34661";
		} else if (callType === "voicemail") {
			return "#001664";
		} else if (callType === "answered") {
			return "#3cd0c1";
		}
		return "black";
	};

	const handleArchiveButtonClick = async (callId: number) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				console.error("Access token not found in localStorage");
				return;
			}

			const response = await fetch(
				`https://frontend-test-api.aircall.io/calls/${callId}/archive`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.ok) {
				console.log(`Archived call with ID ${callId}`);

				// Reset the database by refetching the calls data
				fetchUserCallsData();
			} else {
				console.error("API request failed with status:", response.status);
			}
		} catch (error) {
			console.error("Error occurred while making the API request:", error);
		}
	};

	const handleUnarchiveButtonClick = async (callId: number) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				console.error("Access token not found in localStorage");
				return;
			}

			const response = await fetch(
				`https://frontend-test-api.aircall.io/calls/${callId}/archive`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.ok) {
				console.log(`Unarchived call with ID ${callId}`);

				// Reset the database by refetching the calls data
				fetchUserCallsData();
			} else {
				console.error("API request failed with status:", response.status);
			}
		} catch (error) {
			console.error("Error occurred while making the API request:", error);
		}
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const handlePrevPage = () => {
		setCurrentPage((prevPage) => prevPage - 1);
	};

	const indexOfLastCall = currentPage * callsPerPage;
	const indexOfFirstCall = indexOfLastCall - callsPerPage;
	const currentCalls = callsData.slice(indexOfFirstCall, indexOfLastCall);

	const pageNumbers = Math.ceil(callsData.length / callsPerPage);

	return (
		<>
			{/* <Container> */}
			<TableContainer
				component={Paper}
				style={{ marginTop: "1%" }}>
				<Table
					sx={{ minWidth: 700 }}
					aria-label='customized table'>
					<TableHead sx={{ textTransform: "uppercase" }}>
						<TableRow>
							<StyledTableCell>Call Type</StyledTableCell>
							<StyledTableCell align='center'>Direction</StyledTableCell>
							<StyledTableCell align='center'>Duration</StyledTableCell>
							<StyledTableCell align='center'>From</StyledTableCell>
							<StyledTableCell align='center'>To</StyledTableCell>
							<StyledTableCell align='center'>Via</StyledTableCell>
							<StyledTableCell align='center'>Created At</StyledTableCell>
							<StyledTableCell align='center'>Status</StyledTableCell>
							<StyledTableCell align='center'>Action</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody sx={{ textTransform: "capitalize" }}>
						{callsData.map((call, index) => (
							<StyledTableRow key={index}>
								<StyledTableCell
									component='th'
									scope='row'
									// onClick={() => handleCallClick(call.id)}
									style={{ color: getCallTypeColor(call.call_type) }} // Set the text color based on the call type
								>
									{call.call_type}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{call.direction}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{call.duration}
									{/* 80 minutes 23 seconds <br /> (4823 seconds) */}
								</StyledTableCell>
								<StyledTableCell align='center'>{call.from}</StyledTableCell>
								<StyledTableCell align='center'>{call.to}</StyledTableCell>
								<StyledTableCell align='center'>{call.via}</StyledTableCell>
								<StyledTableCell align='center'>
									{formatDate(call.created_at)}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{call.is_archived ? (
										<button
											onClick={() => handleUnarchiveButtonClick(call.id)}
											className={styles.unarchive}>
											Unarchive
										</button>
									) : (
										<button
											onClick={() => handleArchiveButtonClick(call.id)}
											className={styles.archive}>
											Archive
										</button>
									)}
								</StyledTableCell>
								<StyledTableCell align='center'>
									<button
										className={styles.addNote}
										onClick={() => handleOpen(call.id)}>
										Add Note
									</button>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<div>
				<button
					disabled={currentPage === 1}
					onClick={handlePrevPage}>
					Previous
				</button>
				<span>{currentPage}</span>
				<button
					disabled={currentPage === pageNumbers}
					onClick={handleNextPage}>
					Next
				</button>
			</div>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box sx={style}>
					<button
						className={styles.close}
						onClick={handleClose}>
						X
					</button>
					<Typography
						id='modal-modal-title'
						variant='h6'
						component='h2'>
						Add Notes
					</Typography>
					<span
						id='modal-modal-description'
						sx={{ mt: 2 }}>
						Call ID {selectedCallId}
					</span>

					<div className={styles.border} />

					<div>
						{selectedCallId && selectedCallData && (
							<div className={styles.popup}>
								<div className={styles.m5}>
									<div style={{ paddingBottom: "10px" }}>call Type</div>
									<div style={{ paddingBottom: "10px" }}>duration</div>
									<div style={{ paddingBottom: "10px" }}>From</div>
									<div style={{ paddingBottom: "10px" }}>to</div>
									<div style={{ paddingBottom: "10px" }}>via</div>
								</div>
								<div className={styles.m5}>
									<div
										style={{
											paddingBottom: "10px",
											color: getCallTypeColor(selectedCallData.call_type),
										}}>
										{selectedCallData.call_type}
									</div>
									<div style={{ paddingBottom: "10px" }}>
										{selectedCallData.duration}
									</div>
									<div style={{ paddingBottom: "10px" }}>
										{selectedCallData.from}
									</div>
									<div style={{ paddingBottom: "10px" }}>
										{selectedCallData.to}
									</div>
									<div style={{ paddingBottom: "10px" }}>
										{selectedCallData.via}
									</div>
								</div>
							</div>
						)}
					</div>

					<div style={{ paddingBottom: "13px" }}>Notes</div>
					<textarea
						placeholder='Add Notes'
						rows={4}
						cols={50}
					/>

					<div className={styles.border} />

					<button className={styles.saveBtn}>Save</button>
				</Box>
			</Modal>
			{/* </Container> */}
		</>
	);
}
