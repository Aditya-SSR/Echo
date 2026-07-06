import api from "../../lib/axios";

export async function getMessages(){
    const response = await api.get("/messages");
    return response.data;
}

export async function createMessageService(text) {
    const response = await api.post("/messages", { content : text });
    return response.data;
}

export async function toggleLikeMessageService(id) {
    const response = await api.put(`/messages/${id}`);
    return response.data;
}

export async function deleteMessageService(id) {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
}