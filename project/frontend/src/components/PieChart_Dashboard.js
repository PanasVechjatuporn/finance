import React, { useState, useEffect } from "react";

export default function PieChartComponent({ userData }) {
    // console.log(userData)
    return (
        <>
            <div>
                {JSON.stringify(userData, null, 2)}
            </div>
        </>
    )
}