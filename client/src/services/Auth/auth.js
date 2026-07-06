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
    window.location.href = "http://localhost:8000/users/google";
}