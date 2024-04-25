import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import ArticleIcon from "@mui/icons-material/Article";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import { BuyAssetModal } from "./BuyAssetModal";
import { Container } from "react-bootstrap";
import { ComponentLoading } from "./OverlayLoading";
import { roundNumber } from "utils/numberUtil";
import { useNavigate, useLocation } from "react-router-dom";

function createData(
    id,
    proj_id,
    proj_name_th,
    proj_name_en,
    proj_abbr_name,
    risk_spectrum,
    spec_code,
    growth_rate,
    fact_sheet,
    last_val,
    last_update,
    buy_asset,
    growth_rate_predict
) {
    return {
        id,
        proj_id,
        proj_name_th,
        proj_name_en,
        proj_abbr_name,
        risk_spectrum,
        spec_code,
        growth_rate,
        fact_sheet,
        last_val,
        last_update,
        buy_asset,
        growth_rate_predict
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: "proj_name_th",
        numeric: false,
        disablePadding: false,
        label: "Fund Name (Thai)",
    },
    {
        id: "proj_abbr_name",
        numeric: false,
        disablePadding: true,
        label: "Fund's Abbreviation",
    },
    {
        id: "risk_spectrum",
        numeric: true,
        disablePadding: false,
        label: "Risk Level",
    },
    {
        id: "spec_code",
        numeric: false,
        disablePadding: false,
        label: "Special feature code",
    },
    {
        id: "growth_rate",
        numeric: false,
        disablePadding: false,
        label: "Returns since establishment",
    },
    {
        id: "fact_sheet",
        numeric: false,
        disablePadding: false,
        label: "Prospectus",
    },
    {
        id: "last_val",
        numeric: true,
        disablePadding: false,
        label: "Unit Price",
    },
    {
        id: "last_update",
        numeric: false,
        disablePadding: false,
        label: "Last updated date",
    },
    {
        id: "buy_asset",
        numeric: false,
        disablePadding: false,
        label: "Buy",
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead >
            <TableRow >
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "center"}
                        // padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={headCell.id === "proj_name_th" ? "15%" : "9.4%"}
                        sx={{ backgroundColor: "#7a8fb8", color: "white", fontWeight: "bold", fontSize: 14 }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar() {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                backgroundColor: "#3e5074",
                color: "white"
            }}
        >
            <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Available Funds
            </Typography>
        </Toolbar>
    );
}

export const InvestmentFundsTable = ({ fundsData, goalData, isLoading}) => {
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("growth_rate");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState(null);
    // const [isModalAssetOpen, setIsModalAssetOpen] = useState(false);
    // const [modalData, setModalData] = useState(null);

    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        if (fundsData) {
            let tmpRows = [];
            fundsData.forEach((fund) => {
                tmpRows.push(
                    createData(
                        fund._id,
                        fund.proj_id,
                        fund.proj_name_th,
                        fund.proj_name_en,
                        fund.proj_abbr_name,
                        fund.risk_spectrum,
                        fund.spec_code,
                        fund.growth_rate,
                        fund.url_factsheet,
                        fund.last_val,
                        fund.last_update,
                        "buy_asset",
                        fund.growthrat_avg
                    )
                );
            });
            setRows(tmpRows);
        }
    }, [fundsData]);

    const openInNewTab = (url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = useMemo(() => {
        if (rows) {
            return stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            );
        }
    }, [order, orderBy, page, rowsPerPage, rows]);
    return (
        <Container sx={{ maxWidth: "90%" }}>
            <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                    <EnhancedTableToolbar />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={"medium"}
                            stickyHeader
                        >
                                        <caption>*The actual value may change depending on the buying/selling price that investors receive when buying/selling. Investors should check the price received and the latest price with the asset management company again.</caption>
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows ? rows.length : 0}
                            />
                            <TableBody>
                                {visibleRows ? (
                                    visibleRows.map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    style={{ padding: "10px" }}
                                                >
                                                    {row.proj_name_th}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row.proj_abbr_name}
                                                </TableCell>
                                                <TableCell align="right">{row.risk_spectrum}</TableCell>
                                                <TableCell align="center">{row.spec_code}</TableCell>
                                                <TableCell align="center"
                                                    style={{ color: row.growth_rate > 0 ? "green" : "red" }}
                                                >
                                                    {roundNumber(row.growth_rate, 2)} %
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        children={<ArticleIcon />}
                                                        onClick={(e) => {
                                                            openInNewTab(row.fact_sheet);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{row.last_val}</TableCell>
                                                <TableCell align="center">{new Date(row.last_update).toLocaleDateString("en-GB")}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        children={<AddShoppingCartIcon />}
                                                        onClick={(e) => {
                                                            // setModalData(row);
                                                            // setIsModalAssetOpen(true);

                                                            navigate(`${location.pathname}/buy/${row.proj_id}`, {
                                                                state: {
                                                                    row,
                                                                    goalData
                                                                }
                                                            })
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            <Container>
                                                <ComponentLoading isLoading={true} size={"300px"}/>
                                            </Container>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows ? rows.length : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                {/* <BuyAssetModal
                    fundData={modalData}
                    open={isModalAssetOpen}
                    setOpen={setIsModalAssetOpen}
                    goalData={goalData}
                /> */}
            </Box>
        </Container>
    );
};
