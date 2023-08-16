"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekStartAndEnd = void 0;
function getWeekStartAndEnd(date) {
    var dayOfWeek = date.getDay();
    var startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    var endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + (6 - dayOfWeek));
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var weekStart = "".concat(dayNames[startOfWeek.getDay()], " ").concat(monthNames[startOfWeek.getMonth()], " ").concat(startOfWeek.getDate());
    var weekEnd = "".concat(dayNames[endOfWeek.getDay()], " ").concat(monthNames[endOfWeek.getMonth()], " ").concat(endOfWeek.getDate());
    return { weekStart: weekStart, weekEnd: weekEnd };
}
exports.getWeekStartAndEnd = getWeekStartAndEnd;
