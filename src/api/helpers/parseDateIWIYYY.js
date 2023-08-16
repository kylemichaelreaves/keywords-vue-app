"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateIWIYYY = void 0;
function parseDateIWIYYY(input) {
    var regex = /^(\d{2})-(\d{4})$/;
    var match = input.match(regex);
    if (!match) {
        return null;
    }
    var week = parseInt(match[1], 10);
    var year = parseInt(match[2], 10);
    if (week < 1 || week > 53) {
        return null;
    }
    var firstDayOfYear = new Date(year, 0, 1);
    var firstWeekDay = firstDayOfYear.getUTCDay();
    firstWeekDay = firstWeekDay === 0 ? 7 : firstWeekDay; // Get the day of the week (1-7), treating Sunday as 7
    // If January 1st is not a Monday (2-7), then it belongs to the last week of the previous year
    if (firstWeekDay > 1) {
        firstWeekDay -= 7;
    }
    var daysOffset = (week - 1) * 7 + 1 - firstWeekDay;
    return new Date(year, 0, daysOffset);
}
exports.parseDateIWIYYY = parseDateIWIYYY;
