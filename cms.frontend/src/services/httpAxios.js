import axios from "axios";

const httpAxios = axios.create({
    baseURL: "http://localhost:5114",
    headers: {
        "Content-Type": "application/json",
    },
});

export default httpAxios;