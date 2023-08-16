"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthStartAndEnd = void 0;
function getMonthStartAndEnd(date) {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthStart = "".concat(dayNames[firstDay.getDay()], " ").concat(monthNames[firstDay.getMonth()], " ").concat(firstDay.getDate());
    var monthEnd = "".concat(dayNames[lastDay.getDay()], " ").concat(monthNames[lastDay.getMonth()], " ").concat(lastDay.getDate());
    return { monthStart: monthStart, monthEnd: monthEnd };
}
exports.getMonthStartAndEnd = getMonthStartAndEnd;
