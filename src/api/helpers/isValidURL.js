"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidURL = void 0;
function isValidURL(url) {
    if (!url) {
        return false;
    }
    try {
        new URL(url);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isValidURL = isValidURL;
