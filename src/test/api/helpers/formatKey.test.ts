import {formatKey} from "@api/helpers/formatKey";

describe('formatKey', () => {
    test('formats a snake_case key to capitalized words', () => {
        const input = 'snake_case_key';
        const expected = 'Snake Case Key';
        const result = formatKey(input);

        expect(result).toBe(expected);
    });

    test('formats a single word key without changing the capitalization', () => {
        const input = 'Key';
        const expected = 'Key';
        const result = formatKey(input);

        expect(result).toBe(expected);
    });

    test('formats a key with mixed capitalization', () => {
        const input = 'MiXeD_CaSe';
        const expected = 'Mixed Case';
        const result = formatKey(input);

        expect(result).toBe(expected);
    });

    test('returns an empty string for an empty input', () => {
        const input = '';
        const expected = '';
        const result = formatKey(input);

        expect(result).toBe(expected);
    });
});
