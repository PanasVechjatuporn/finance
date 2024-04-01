
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
export const UserNetSummary = () => {


    return (
        <Box
                sx={{
                    marginTop: "2%",
                    position: "relative",
                }}
            >
                <Typography>ยอดเงินสะสมของคุณ</Typography>

        </Box>
    )
}