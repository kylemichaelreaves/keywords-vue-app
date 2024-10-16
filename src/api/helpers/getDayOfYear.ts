/**
 * Calculates the day of the year for a given date.
 *
 * @param {Date} date - The date for which to calculate the day of the year.
 * @returns {number} - The day of the year (1-366).
 */
export function getDayOfYear(date: Date): number {
    // Create a new date object for the start of the year
    const start = new Date(date.getFullYear(), 0, 0);

    // Calculate the difference in time between the input date and the start of the year
    // getTime returns the number of milliseconds since the Unix Epoch
    // getTimezoneOffset returns the time-zone offset in minutes for the current locale
    // The multiplication by 60 * 1000 converts the timezone offset from minutes to milliseconds
    const diff = date.getTime() - start.getTime() + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);

    // Define the number of milliseconds in a day
    const oneDay = 1000 * 60 * 60 * 24;

    // Convert the time difference from milliseconds to days
    // Return the day of the year
    return Math.floor(diff / oneDay);
}