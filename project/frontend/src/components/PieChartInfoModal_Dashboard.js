import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export default function PieChartInfoModal({
    open,
    setOpen,
    modalParams,
    modalType,
}) {
    const handleClose = () => setOpen(false);
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: modalParams.color,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    if (modalParams) {
        return (
            <>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                    disableAutoFocus
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <div>
                                <Typography
                                    variant="h5"
                                    style={{
                                        color: "#757575",
                                        textDecoration: "underline",
                                        textDecorationColor: "transparent",
                                        borderBottom: "2px solid #757575",
                                        display: "inline-block",
                                        width: "100%",
                                        paddingBottom: "8px",
                                        userSelect: "none",
                                        marginBottom: "12px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    สรุป {modalParams.label}
                                </Typography>
                            </div>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: "50%" }} aria-label="customized table">
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell align="center"><b>Date</b></StyledTableCell>
                                            <StyledTableCell align="center"><b>Amount</b></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {modalParams.monthEntries.map((data, index) => (
                                            <StyledTableRow>
                                                <StyledTableCell align="center">
                                                    {data.date}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {data.amount}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        <StyledTableRow>
                                            <StyledTableCell align="center"><b>Total</b></StyledTableCell>
                                            <StyledTableCell align="center">
                                                <b>
                                                    {modalParams.value}
                                                </b>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Fade>
                </Modal>
            </>
        );
    } else {
        return <></>;
    }
}
