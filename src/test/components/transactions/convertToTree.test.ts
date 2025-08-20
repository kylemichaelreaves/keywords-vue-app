import {convertToTree} from "@api/helpers/convertToTree";
import {test, expect, describe} from 'vitest';

describe('convertToTree', () => {
    test('convertToTree returns an empty array when categories is an empty object', () => {
        const categories = {};
        const result = convertToTree(categories);
        expect(result).toEqual([]);
    });

    test('convertToTree returns a single node when categories has a single key-value pair', () => {
        const categories = {'Category1': {}};
        const result = convertToTree(categories);
        expect(result).toEqual([{value: 'Category1', label: 'Category1'}]);
    });

    test('convertToTree returns a tree when categories has nested key-value pairs', () => {
        const categories = {'Category1': {'SubCategory1': {}}};
        const result = convertToTree(categories);
        expect(result).toEqual([{value: 'Category1', label: 'Category1', children: [{value: 'Category1 - SubCategory1', label: 'SubCategory1'}]}]);
    });

    test('convertToTree returns a tree with multiple nodes when categories has multiple key-value pairs', () => {
        const categories = {'Category1': {}, 'Category2': {}};
        const result = convertToTree(categories);
        expect(result).toEqual([{value: 'Category1', label: 'Category1'}, {value: 'Category2', label: 'Category2'}]);
    });

    test('convertToTree returns a tree with multiple levels when categories has deeply nested key-value pairs', () => {
        const categories = {'Category1': {'SubCategory1': {'SubSubCategory1': {}}}};
        const result = convertToTree(categories);
        expect(result).toEqual([{
            value: 'Category1',
            label: 'Category1',
            children: [{value: 'Category1 - SubCategory1', label: 'SubCategory1', children: [{value: 'Category1 - SubCategory1 - SubSubCategory1', label: 'SubSubCategory1'}]}]
        }]);
    })
});
