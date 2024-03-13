import React from "react";
import Navigate from "components/Navbar";
import MonthDataTable from "components/DataTable_Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { LoginWithLocalData } from '../store/UserSlice';
import axios from 'axios';
const baseURL = "http://localhost:8000";
export const Dashboard = () => {
    const userStore = useSelector(state => state.userStore)
    const dispatch = useDispatch()
    try {
        if (userStore.userId === null) {
            const localUser = localStorage.getItem('userData')
            if (localUser) {
                axios.post(`${baseURL}/auth/veriylocaluser`, {
                    localUser: localUser
                }).then(res => {
                    dispatch(LoginWithLocalData(JSON.parse(localUser)))
                }).catch(e => {
                    localStorage.removeItem("userData");
                    console.log(e)
                })
            }
        }
    } catch (e) {
        console.log(e)
    }
    return (
        <React.Fragment>
            <Navigate />
            <MonthDataTable />
        </React.Fragment>
    );
};

