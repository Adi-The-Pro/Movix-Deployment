import axios from "axios";

const client = axios.create({
    baseURL: 'https://movix-deployment-backend.vercel.app/api'
});

export default client;