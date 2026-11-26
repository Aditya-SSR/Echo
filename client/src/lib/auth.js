import { useMemo, useSyncExternalStore } from "react";
import { jwtDecode } from "jwt-decode";

// One place that knows how the session token is stored. Components call
// useCurrentUser() and re-render automatically when the token changes
// (sign in, sign out, or another tab).
const CHANGE_EVENT = "echo-auth-change";

export function saveToken(token) {
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("vibe_checked");
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback) {
    window.addEventListener(CHANGE_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
        window.removeEventListener(CHANGE_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

// Returns the stored token only if it decodes and hasn't expired.
function readToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const { exp } = jwtDecode(token);
        if (exp && exp * 1000 <= Date.now()) return null;
        return token;
    } catch {
        return null;
    }
}

export function useCurrentUser() {
    const token = useSyncExternalStore(subscribe, readToken, () => null);
    return useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    }, [token]);
}
