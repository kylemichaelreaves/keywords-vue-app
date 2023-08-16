"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var test_utils_1 = require("@vue/test-utils");
var Home_vue_1 = require("@components/Home.vue");
describe('Home.vue', function () {
    it('renders the correct content', function () {
        var wrapper = (0, test_utils_1.shallowMount)(Home_vue_1.default);
        expect(wrapper.find('h2').text()).toMatch('Home');
        expect(wrapper.find('p').text()).toMatch(/demonstration of immense innovation/);
    });
    it('renders an icon', function () {
        var wrapper = (0, test_utils_1.shallowMount)(Home_vue_1.default);
        expect(wrapper.findComponent({ name: 'HomeFilled' }).exists()).toBe(true);
    });
});
