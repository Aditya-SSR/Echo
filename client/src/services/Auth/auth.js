import api from "../../lib/axios";

export async function signin(data){
    const response = await api.post("/users/login", data);
    return response.data;
}

export async function signup(data){
    const response = await api.post("/users/register", data);
    return response.data;
} 

export async function googleSignIn() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    window.location.href = `${apiUrl}/users/google`;
}