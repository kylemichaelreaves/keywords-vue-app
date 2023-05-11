export function getWeekStartAndEnd(date: Date) {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + (6 - dayOfWeek));

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const weekStart = `${dayNames[startOfWeek.getDay()]} ${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()}`;
    const weekEnd = `${dayNames[endOfWeek.getDay()]} ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}`;

    return { weekStart, weekEnd };
}
