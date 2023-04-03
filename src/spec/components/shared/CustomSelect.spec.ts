import {mount, shallowMount} from '@vue/test-utils';
import { test } from 'vitest';
import CustomSelect from "../../../components/shared/CustomSelect.vue";
import {ElOption, ElSelect} from "element-plus";

const createWrapper = (props: Record<string, unknown>) => {
    return shallowMount(CustomSelect, {
        global: {
            plugins: [ElSelect, ElOption],
        },
        props: {
            ...props,
            options: [
                {label: 'Option 1', value: 'option1'},
                {label: 'Option 2', value: 'option2'},
            ],
            filterable: true,
            clearable: true
        },
    });
};

describe('CustomSelect', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = mount(CustomSelect, {
            global: {
                plugins: [ElSelect, ElOption],
            },
            props: {
                selectedValue: '',
                placeholder: 'Select an option',
                options: [
                    {label: 'Option 1', value: 'option1'},
                    {label: 'Option 2', value: 'option2'},
                ],
                filterable: true,
                clearable: true
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    test('CustomSelect > should emit "update:selectedValue" when the selected value is changed', async ({expect}) => {
        // Find the select element and trigger the change event
        const select = wrapper.findComponent(ElSelect)
        // const select = wrapper.find('select');
        await select.setValue('option1');
        await select.trigger('change');

        // Check if the "update:selectedValue" event is emitted with the correct value

        console.log('wrapper.emitted()', wrapper.emitted());

        expect(wrapper.emitted()).toHaveProperty('update:selectedValue');
        expect(wrapper.emitted()['update:selectedValue']?.[0]).toEqual(['option1']);
    });

    test('CustomSelect > should render the component with default values', ({ expect }) => {
        // Check if the component is rendered correctly
        console.log('wrapper.html()', wrapper.html());

        // Get the options from the component instance
        const options = wrapper.props('options');
        expect(options.length).toBe(2);
        expect(options[0].label).toBe('Option 1');
        expect(options[0].value).toBe('option1');
        expect(options[1].label).toBe('Option 2');
        expect(options[1].value).toBe('option2');
    });

    test('CustomSelect > should render the component with custom placeholder', ({ expect }) => {
        // Mount the component with a custom placeholder
        const wrapper = mount(CustomSelect, {
            props: {
                options: [
                    {label: 'Option 1', value: 'option1'},
                    {label: 'Option 2', value: 'option2'},
                ],
                selectedValue: '',
                placeholder: 'Custom Placeholder',
                filterable: true,
                clearable: true
            },
        });

        const selectComponent = wrapper.vm.$refs.selectComponent as InstanceType<typeof ElSelect>;
        expect(selectComponent.placeholder).toBe('Custom Placeholder');
    });

    test('CustomSelect > should render the component without a clear icon when clearable is false', ({ expect }) => {
        const wrapper = mount(CustomSelect, {
            props: {
                options: [
                    {label: 'Option 1', value: 'option1'},
                    {label: 'Option 2', value: 'option2'},
                ],
                selectedValue: '',
                placeholder: 'Select an option',
                filterable: true,
                clearable: false
            },
        });

        const selectComponent = wrapper.vm.$refs.selectComponent as InstanceType<typeof ElSelect>;
        expect(selectComponent.clearable).toBe(false);
    });

    test('CustomSelect > should render the component without a filter when filterable is false', ({ expect }) => {
        const wrapper = mount(CustomSelect, {
            props: {
                options: [
                    {label: 'Option 1', value: 'option1'},
                    {label: 'Option 2', value: 'option2'},
                ],
                selectedValue: '',
                placeholder: 'Select an option',
                filterable: false,
                clearable: true
            },
        });

        const selectComponent = wrapper.vm.$refs.selectComponent as InstanceType<typeof ElSelect>;
        expect(selectComponent.filterable).toBe(false);
    });

    it('should render without a clear icon when clearable prop is set to false', () => {
        const wrapper = shallowMount(CustomSelect, {
            props: {
                clearable: false,
                filterable: true
            },
        });

        const selectComponent = wrapper.vm.$refs.selectComponent as InstanceType<typeof ElSelect>;
        expect(selectComponent.clearable).toBe(false);
    });

    it('should render without a filter when filterable prop is set to false', () => {
        const wrapper = shallowMount(CustomSelect, {
            props: {
                filterable: false,
                clearable: false
            },
        });

        const selectComponent = wrapper.vm.$refs.selectComponent as InstanceType<typeof ElSelect>;
        expect(selectComponent.filterable).toBe(false);
    });






});
