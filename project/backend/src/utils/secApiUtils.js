
require('dotenv').config({ path: '../.env' });
const firebaseAuth = require("../controllers/firebaseAuth");
const axios = require('axios');

const secAPIFundDailyInfoHeader = {
    "Ocp-Apim-Subscription-Key": process.env.FUND_DAILY_INFO_API_KEY,
};

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getFundsLastestNav = async (req, res) => {
    const proj_id = req.header("proj_id");
    const idToken = req.header("userToken");
    const userId = req.header("userId");
    try {
        let found = false;
        let count = 0;
        const isVerify = await firebaseAuth.verifyIdToken(idToken, userId);
        if (isVerify) {
            while (!found) {
                const today = new Date();
                const nav_date = formatDate(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - count)
                );
                count++;
                const response = await axios.get(
                    `https://api.sec.or.th/FundDailyInfo/${proj_id}/dailynav/${nav_date}`,
                    {
                        headers: secAPIFundDailyInfoHeader,
                    }
                );
                await sleep(30);
                if (response.status === 200) {
                    res.status(200).json(response.data);
                    found = true
                }
                if (count < -30) {
                    throw new Error("Data Not Found more than 30 days")
                }
            }
        } else {
            throw new Error("unauthorized access");
        }

    } catch (err) {
        console.log("err :: ", err);
        res.status(401).json({ err });
    }
}

exports.getLastestNav = async(proj_id) => {
    try {
        let found = false;
        let count = 0;
            while (!found) {
                const today = new Date();
                const nav_date = formatDate(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - count)
                );
                count++;
                const response = await axios.get(
                    `https://api.sec.or.th/FundDailyInfo/${proj_id}/dailynav/${nav_date}`,
                    {
                        headers: secAPIFundDailyInfoHeader,
                    }
                );
                await sleep(30);
                if (response.status === 200) {
                    return response.data;
                }
                if (count < -30) {
                    throw new Error("Data Not Found more than 30 days")
                }
            }
    } catch (err) {
        console.log("err :: ", err);
        return null;
    }
}