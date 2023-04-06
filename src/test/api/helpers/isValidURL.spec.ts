import { test } from 'vitest';
import {isValidURL} from "../../../api/helpers/isValidURL";

test('isValidURL > should return true for a valid URL', ({ expect }) => {
    const validURL = 'https://example.com';
    expect(isValidURL(validURL)).toBe(true);
});

test('isValidURL > should return false for an invalid URL', ({ expect }) => {
    const invalidURL = 'not-a-url';
    expect(isValidURL(invalidURL)).toBe(false);
});

test('isValidURL > should return false for an empty string', ({ expect }) => {
    const emptyString = '';
    expect(isValidURL(emptyString)).toBe(false);
});

test('isValidURL > should return false for a null value', ({ expect }) => {
    const nullValue = null;
    expect(isValidURL(nullValue)).toBe(false);
});
