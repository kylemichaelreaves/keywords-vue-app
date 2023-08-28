export function formatKey(key: string): string {
    if (!key) return "";

    const words = key.replace(/_/g, " ").split(" ");
    const capitalizedWords = words.map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return capitalizedWords.join(" ");
}