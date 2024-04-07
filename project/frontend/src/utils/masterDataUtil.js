import axios from "axios";
const baseURL = "http://localhost:8000";
//utils function to get master data filter querying by name
export async function getMasterDataByName(masterDataName) {
    try {
        const result = await axios.get(
            `${baseURL}/db/get_master_data`,
            {
                headers: {
                    Name: masterDataName,
                },
            }
        )
        return result.data.queryResult

    } catch (err) {

    }

}