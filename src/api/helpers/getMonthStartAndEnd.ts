export function getMonthStartAndEnd(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const monthStart = `${dayNames[firstDay.getDay()]} ${monthNames[firstDay.getMonth()]} ${firstDay.getDate()}`;
    const monthEnd = `${dayNames[lastDay.getDay()]} ${monthNames[lastDay.getMonth()]} ${lastDay.getDate()}`;

    return { monthStart, monthEnd };
}