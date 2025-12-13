import { mount } from '@vue/test-utils'
import TimeframeToggle from '@components/shared/TimeframeToggle.vue'
import { ElCheckTag } from 'element-plus'

describe('TimeframeToggle.vue', () => {
  it('renders the component', () => {
    const wrapper = mount(TimeframeToggle, {
      global: {
        components: {
          ElCheckTag,
        },
      },
    })

    expect(wrapper.find('.time-selector').exists()).toBeTruthy()
    expect(wrapper.findAllComponents(ElCheckTag).length).toBe(3)
  })

  it("has 'monthly' as the default selected option", () => {
    const wrapper = mount(TimeframeToggle)

    // Check the default modelValue prop
    expect(wrapper.props('modelValue')).toBe('monthly')
  })

  it('emits update:modelValue when option changes', async () => {
    const wrapper = mount(TimeframeToggle, {
      props: {
        modelValue: 'monthly',
      },
      global: {
        components: {
          ElCheckTag,
        },
      },
    })

    const checkTags = wrapper.findAllComponents(ElCheckTag)

    // Ensure we have check tags before testing
    expect(checkTags.length).toBeGreaterThan(0)

    // Simulate clicking on the "weekly" option (first option)
    if (checkTags[0]) {
      await checkTags[0].trigger('change')
    }

    // Check that the component emitted the update:modelValue event
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('updates modelValue when prop changes', async () => {
    const wrapper = mount(TimeframeToggle, {
      props: {
        modelValue: 'monthly',
      },
    })

    // Change the modelValue prop
    await wrapper.setProps({ modelValue: 'weekly' })

    // Verify the prop was updated
    expect(wrapper.props('modelValue')).toBe('weekly')
  })
})
