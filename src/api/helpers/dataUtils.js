"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateNumberKey = exports.formatDate = exports.parseDateMMYYYY = exports.filterDataByMemo = exports.isDateSameAsPrevious = exports.sumDebits = exports.formatKey = exports.filterDataByMonth = void 0;
function filterDataByMonth(data, selectedMonth) {
    if (selectedMonth) {
        return data.filter(function (d) {
            return "".concat(d.date.split('/')[0], "/").concat(d.date.split('/')[2]) === selectedMonth;
        });
    }
    else {
        return data;
    }
}
exports.filterDataByMonth = filterDataByMonth;
function sumDebits(data, groupBy) {
    return data.reduce(function (acc, cur) {
        var _a = cur.date.split('/'), month = _a[0], day = _a[1], year = _a[2];
        var paddedMonth = month.length === 1 ? "0".concat(month) : month;
        var key = groupBy === 'month' ? "".concat(paddedMonth, "/").concat(year) : cur.date;
        var amount = parseFloat(cur['amountDebit']) || 0;
        acc[key] = (acc[key] || 0) + amount;
        return acc;
    }, {});
}
exports.sumDebits = sumDebits;
function filterDataByMemo(data, selectedMemo) {
    if (selectedMemo) {
        return data.filter(function (d) { return d.memo === selectedMemo; });
    }
    else {
        return data;
    }
}
exports.filterDataByMemo = filterDataByMemo;
function parseDateMMYYYY(input) {
    var regex = /^(\d{2})\/(\d{4})$/;
    var match = input.match(regex);
    if (!match) {
        return null;
    }
    var month = parseInt(match[1], 10) - 1; // Month is 0-indexed
    var year = parseInt(match[2], 10);
    if (month < 0 || month > 11) {
        return null;
    }
    return new Date(year, month);
}
exports.parseDateMMYYYY = parseDateMMYYYY;
function formatKey(key) {
    if (!key)
        return "";
    var words = key.replace(/_/g, " ").split(" ");
    var capitalizedWords = words.map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); });
    return capitalizedWords.join(" ");
}
exports.formatKey = formatKey;
var isDateSameAsPrevious = function (currentDate, index, tableData) {
    if (index === 0)
        return false;
    var previousDate = tableData[index - 1].date;
    return formatDate(currentDate) === formatDate(previousDate);
};
exports.isDateSameAsPrevious = isDateSameAsPrevious;
function formatDate(dateString, format) {
    if (format === void 0) { format = 'YYYY-MM-DD'; }
    // Input validation: Check if dateString matches the expected format
    var date = new Date(dateString);
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    // Custom output format function
    var padZero = function (num) { return String(num).padStart(2, '0'); };
    var formattedDate = {
        'YYYY': padZero(year),
        'MM': padZero(month),
        'DD': padZero(day),
    };
    // Replace placeholders with their corresponding date values
    return format.replace(/YYYY|MM|DD/g, function (match) { return formattedDate[match]; });
}
exports.formatDate = formatDate;
function getDateNumberKey(dateType) {
    return "".concat(dateType, "_number");
}
exports.getDateNumberKey = getDateNumberKey;
