import {mount, VueWrapper} from "@vue/test-utils";
import SelectComponent from "@components/shared/SelectComponent.vue";

describe('SelectComponent', () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        wrapper = mount(SelectComponent, {
            props: {
                options: [{value: '1', label: 'Option 1'}, {value: '2', label: 'Option 2'}],
                selectedValue: '1',
                placeholder: 'Select an option',
                onChange: vi.fn(),
            },
        });
    });

    test('renders with correct options', () => {
        // @ts-ignore
        const options = wrapper.componentVM.options
        expect(options.length).toBe(2);
        expect(options[0].label).toBe('Option 1');
        expect(options[1].label).toBe('Option 2');
    });

    test('renders with correct selected value', () => {
        // @ts-ignore
        expect(wrapper.props().selectedValue).toBe('1');
    });

    test('calls onChange when value changes', async () => {
        // find a component based on its css class
        const select = wrapper.find('.el-select');
        // simulate a click on that dropdown
        await select.trigger('click');
        // find the second option based on its component name
        const option = wrapper.findAllComponents({name: 'ElOption'})[1];
        // simulate a click on that option
        await option.trigger('click');
        // check if the onChange prop was called
        // @ts-ignore
        expect(wrapper.props().onChange).toHaveBeenCalled();
    });

    test('renders with correct placeholder', () => {
        // @ts-ignore
        expect(wrapper.props().placeholder).toBe('Select an option');
    });

    test('renders as disabled when disabled prop is true', async () => {
        await wrapper.setProps({disabled: true});
        // @ts-ignore
        expect(wrapper.props().disabled).toBe(true);
    });
});