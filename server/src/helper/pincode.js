// 

import axios from "axios";


export const  getPicCode = async (pincode) => {
    try {
        let url = `https://api.postalpincode.in/pincode/${pincode}`;
        let cityData = await axios.get(url);

        return cityData.data

    } catch (err) {
        console.log("getPicCode",err);
    }
}