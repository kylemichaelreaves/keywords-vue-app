export function getMonthStartAndEnd(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const monthStart = `${days[firstDay.getDay()]} ${months[firstDay.getMonth()]} ${firstDay.getDate()}`;
    const monthEnd = `${days[lastDay.getDay()]} ${months[lastDay.getMonth()]} ${lastDay.getDate()}`;

    return {monthStart, monthEnd};
}