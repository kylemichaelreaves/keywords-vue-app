import { mount } from '@vue/test-utils'
import Home from '@components/Home.vue'
import { ElIcon } from 'element-plus'

describe('Home.vue', () => {
  const createWrapper = () => {
    return mount(Home, {
      global: {
        components: {
          ElIcon,
        },
      },
    })
  }

  it('renders the correct content', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h2').text()).toMatch('Home')
    expect(wrapper.find('p').text()).toMatch(/demonstration of immense innovation/)
  })

  it('renders an icon', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent({ name: 'ElIcon' }).exists()).toBe(true)
  })
})
