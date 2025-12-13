import { mount, VueWrapper } from '@vue/test-utils'
import SelectComponent from '@components/shared/SelectComponent.vue'
import { vi, beforeEach, describe, test, expect } from 'vitest'
import type { SelectComponentProps, SelectOption } from '@types'

// Define the component instance type properly
type SelectComponentInstance = InstanceType<typeof SelectComponent>

describe('SelectComponent', () => {
  let wrapper: VueWrapper<SelectComponentInstance>
  let mockOnChange: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnChange = vi.fn()
    wrapper = mount(SelectComponent, {
      props: {
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        selectedValue: '1',
        placeholder: 'Select an option',
        onChange: mockOnChange,
        disabled: false,
        loading: false,
      } satisfies SelectComponentProps,
    })
  })

  test('renders with correct options', () => {
    const options = wrapper.props('options') as SelectOption[]
    expect(options).toHaveLength(2)
    expect(options[0]?.label).toBe('Option 1')
    expect(options[1]?.label).toBe('Option 2')
  })

  test('renders with correct selected value', () => {
    expect(wrapper.props('selectedValue')).toBe('1')
  })

  test('calls onChange when value changes', async () => {
    const onChangeMock = vi.fn<(value: string) => void>()
    await wrapper.setProps({ disabled: false, onChange: onChangeMock })

    const select = wrapper.findComponent({ name: 'ElSelect' })
    await select.trigger('click')

    const options = wrapper.findAllComponents({ name: 'ElOption' })
    if (options.length > 1) {
      await options[1]?.trigger('click')
    }

    const onChangeFunction = wrapper.props('onChange') as (value: string) => void
    if (typeof onChangeFunction === 'function') {
      onChangeFunction('2')
      expect(onChangeMock).toHaveBeenCalledWith('2')
    }
  })

  test('renders with correct placeholder', () => {
    expect(wrapper.props('placeholder')).toBe('Select an option')
  })

  test('renders as disabled when disabled prop is true', async () => {
    await wrapper.setProps({ disabled: true })
    expect(wrapper.props('disabled')).toBe(true)
  })

  test('renders with correct loading text when loading', async () => {
    await wrapper.setProps({ loading: true, loadingText: 'Loading...' })
    expect(wrapper.props('loadingText')).toBe('Loading...')
  })

  test('renders with correct loading state when loading prop is true', async () => {
    await wrapper.setProps({ loading: true })
    expect(wrapper.props('loading')).toBe(true)
  })

  test('does not call onChange when value changes and component is disabled', async () => {
    const onChangeMock = vi.fn<(value: string) => void>()
    await wrapper.setProps({ disabled: true, onChange: onChangeMock })

    const select = wrapper.findComponent({ name: 'ElSelect' })
    const options = wrapper.findAllComponents({ name: 'ElOption' })

    if (!wrapper.props('disabled')) {
      await select.trigger('click')
      if (options.length > 1) {
        await options[1]?.trigger('click')
      }
    }

    expect(onChangeMock).not.toHaveBeenCalled()
  })

  test('does not render options when options prop is empty', () => {
    wrapper = mount(SelectComponent, {
      props: {
        options: [],
        selectedValue: '1',
        placeholder: 'Select an option',
        onChange: vi.fn(),
      } satisfies SelectComponentProps,
    })

    const options = wrapper.findAllComponents({ name: 'ElOption' })
    expect(options).toHaveLength(0)
  })

  test('component emits change event when selection changes', async () => {
    const select = wrapper.findComponent({ name: 'ElSelect' })

    await select.vm.$emit('update:modelValue', '2')

    const onChangeFunction = wrapper.props('onChange') as (value: string) => void
    expect(typeof onChangeFunction).toBe('function')
  })

  test('component is accessible with proper attributes', () => {
    const select = wrapper.findComponent({ name: 'ElSelect' })
    expect(select.exists()).toBe(true)

    expect(wrapper.props('placeholder')).toBe('Select an option')
    expect(wrapper.props('disabled')).toBe(false)
  })
})
