import React from "react";
import { Typography } from "@mui/material";
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
export default function CustomChartLegend({ data , expenseType , taxableIncome}) {
    data.sort((a, b) => a.type - b.type)
    return (<>
        {
            data.map((data, index) => (
                <Grid container spacing={2} key={index+data.label+"grid"}>
                    <Grid item key={index+data.label+"grid-box-grid"}>
                        <Box
                            sx={{
                                width: 16,
                                height: 16,
                                borderRadius: 1,
                                bgcolor: data.color,
                                marginTop: 1.5
                            }}
                        />
                    </Grid>
                    <Grid item key={index+"-"+data.label+"-grid-typography-grid"}>
                        <Typography sx={{
                                marginTop:1
                            }}>{data.label}</Typography>
                    </Grid>
                </Grid>
            ))
        }
    </>)
}