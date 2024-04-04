import React,{ useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export function OverlayLoading({ isLoading }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(isLoading);
    }, [isLoading]);

    return (
        <div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export function ComponentLoading({isLoading}) {
    const [open,setOpen] = useState(false);
    useEffect(() => {
        setOpen(isLoading);
    },[isLoading])
    return (
        <div>
            <Backdrop
                sx={{ color: "#fff"}}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}