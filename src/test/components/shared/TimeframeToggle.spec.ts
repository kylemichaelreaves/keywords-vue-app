// import { mount } - unused from "@vue/test-utils";
import TimeframeToggle from "@components/shared/TimeframeToggle.vue";
import { ElCheckTag } from "element-plus";

describe("TimeframeToggle.vue", () => {
    it("renders the component", () => {
        const _wrapper = mount(TimeframeToggle, {
            global: {
                components: {
                    ElCheckTag,
                },
            },
        });

        expect(wrapper.find(".time-selector").exists()).toBeTruthy();
        expect(wrapper.findAllComponents(ElCheckTag).length).toBe(3);
    });

    it("has 'monthly' as the default selected option", () => {
        const _wrapper = mount(TimeframeToggle);
        const selectedOption = wrapper.vm.selectedOption;

        expect(selectedOption).toBe("monthly");
    });

    it("handleChange updates the selectedOption", async () => {
        const _wrapper = mount(TimeframeToggle, {
            global: {
                components: {
                    ElCheckTag,
                },
            },
        });
        wrapper.findAllComponents(ElCheckTag);
        wrapper.vm.handleChange("monthly");

        expect(wrapper.vm.selectedOption).toBe("monthly");
    });
});
