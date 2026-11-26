// "now", "4m", "3h", "2d", then "Nov 26" (and the year once it's a different year).
export function timeAgo(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";

    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 45) return "now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${Math.max(1, minutes)}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    const sameYear = date.getFullYear() === new Date().getFullYear();
    return date.toLocaleDateString(undefined, sameYear
        ? { month: "short", day: "numeric" }
        : { month: "short", day: "numeric", year: "numeric" });
}

export function fullDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
