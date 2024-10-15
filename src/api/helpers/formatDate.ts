/**
 * Formats a given date string into a specified format.
 *
 * @param {string} dateString - The date string to format.
 * @param {string} [format='YYYY-MM-DD'] - The desired output format. Defaults to 'YYYY-MM-DD'.
 * @returns {string} - The formatted date string or 'Invalid date' if the input is not a valid date.
 */
export function formatDate(dateString: string, format: string = 'YYYY-MM-DD'): string {
    // Input validation: Check if dateString matches the expected format
    let date = new Date(dateString);

    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();


    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    // Custom output format function
    const padZero = (num: number): string => String(num).padStart(2, '0');
    const formattedDate = {
        'YYYY': padZero(year),
        'MM': padZero(month),
        'DD': padZero(day),
    };

    // Replace placeholders with their corresponding date values
    return format.replace(/YYYY|MM|DD/g, (match) => formattedDate[match as keyof typeof formattedDate]);
}