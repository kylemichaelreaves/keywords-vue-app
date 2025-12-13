import { shallowMount } from '@vue/test-utils'
import Home from '@components/Home.vue'

describe('Home.vue', () => {
  it('renders the correct content', () => {
    const wrapper = shallowMount(Home)
    expect(wrapper.find('h2').text()).toMatch('Home')
    expect(wrapper.find('p').text()).toMatch(/demonstration of immense innovation/)
  })

  it('renders an icon', () => {
    const wrapper = shallowMount(Home)
    expect(wrapper.findComponent({ name: 'ElIcon' }).exists()).toBe(true)
  })
})
