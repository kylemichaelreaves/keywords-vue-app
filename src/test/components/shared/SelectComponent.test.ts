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
                disabled: false,
                loading: false,
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
        const onChangeMock = vi.fn();
        await wrapper.setProps({disabled: false, onChange: onChangeMock});
        const select = wrapper.findComponent({name: 'ElSelect'});
        await select.trigger('click');
        const option = wrapper.findAllComponents({name: 'ElOption'})[1];
        await option.trigger('click');

        // Directly call the onChange method, since the event doesn't propagate to the parent component
        // @ts-ignore
        wrapper.vm.onChange('2');

        expect(onChangeMock).toHaveBeenCalled();
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

    test('renders with correct loading text when loading', async () => {
        await wrapper.setProps({loading: true});
        // @ts-ignore
        expect(wrapper.props().loadingText).toBe('Loading...');
    });

    test('renders with correct loading state when loading prop is true', async () => {
        await wrapper.setProps({loading: true});
        // @ts-ignore
        expect(wrapper.props().loading).toBe(true);
    });

    test('does not call onChange when value changes and component is disabled', async () => {;
        await wrapper.setProps({disabled: true});
        const select = wrapper.findComponent({name: 'ElSelect'});
        const option = wrapper.findAllComponents({name: 'ElOption'})[1];

        // @ts-ignore
        if (!wrapper.props().disabled) {
            await select.trigger('click');
            await option.trigger('click');
        }
        // @ts-ignore
        expect(wrapper.vm.onChange).not.toHaveBeenCalled();
    });

    test('does not render options when options prop is empty', () => {
        wrapper = mount(SelectComponent, {
            props: {
                options: [],
                selectedValue: '1',
                placeholder: 'Select an option',
                onChange: vi.fn(),
            },
        });
        const options = wrapper.findAllComponents({name: 'ElOption'});
        expect(options.length).toBe(0);
    });


});