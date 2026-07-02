import axios from "axios";



const API = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3000/api',
    // baseURL: 'https://expense-tracker-live-back-end-1.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});



API.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if(error.response && error.response.status === 401){
            console.log("Token Expired or Logged Out...");
        }
        return Promise.reject(error);
    }

)


export default API;