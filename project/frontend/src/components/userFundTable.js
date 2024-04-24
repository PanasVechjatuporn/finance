import React from "react";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useSelector } from "react-redux";
import axios from "axios";

export default function UserFundTable({ setFund, open, arr }) {
  const uid = useSelector((state) => state.userStore.userId);
  //const [arr, setArr] = React.useState([]);


  if (arr.length > 0) {
    return Object.entries(arr).map(([objKey, eachAsset], index) => (
      <TableRow sx={{ "& > *": { borderBottom: "none" } }} key={index}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "10%" }} />
                  <TableCell align="left" style={{ width: "70%" }}>
                    {eachAsset.fundName}
                  </TableCell>
                  <TableCell align="center" style={{ width: "20%" }}>
                    {parseInt(eachAsset.amount).toLocaleString("en-GB")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    ));
  } else
    return (
      <TableRow sx={{ "& > *": { borderBottom: "none" } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table>
              <TableBody>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell style={{ width: "10%" }} />
                  <TableCell align="left" style={{ width: "70%" }}>
                  You have not made any investments in funds eligible for tax deduction yet.
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ width: "20%" }}
                  ></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    );
}
