import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Keywords from '@components/Keywords.vue'
import ElementPlus, { ElInput } from 'element-plus'

describe('Keywords.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof Keywords>>

  beforeEach(() => {
    wrapper = mount(Keywords, {
      global: {
        plugins: [ElementPlus],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('initializes "keywords" ref with an empty string', async () => {
    await nextTick()
    expect(wrapper.vm.keywords).toEqual('')
    // The component should not emit an event on initialization
    expect(wrapper.emitted()['update:keywords']).toBeUndefined()
  })

  it('updates "keywords" ref when input is changed', async () => {
    const elInput = wrapper.findComponent(ElInput)
    await elInput.setValue('testing')
    await elInput.trigger('input')
    await nextTick()
    expect(wrapper.vm.keywords).toEqual('testing')
  })

  it('can be reset', async () => {
    const elInput = wrapper.findComponent(ElInput)
    await elInput.setValue('testing')
    await elInput.trigger('input')
    await nextTick()

    // Set the input value to an empty string and trigger the 'input' event
    await elInput.setValue('')
    await elInput.trigger('input')
    await nextTick()
    expect(wrapper.vm.keywords).toEqual('')
  })
})
