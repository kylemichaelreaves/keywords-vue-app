export function isValidURL(url: string | null | undefined) {
    if (!url) {
        return false;
    }
    try {
        new URL(url);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
