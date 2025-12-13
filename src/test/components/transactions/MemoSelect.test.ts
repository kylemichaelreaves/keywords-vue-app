import { test } from 'vitest'
import { mount } from '@vue/test-utils'
import MemoSelect from '@components/transactions/selects/MemoSelect.vue'
import { ElOption, ElSelect } from 'element-plus'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createTestingPinia } from '@pinia/testing'

describe('MemoSelect', () => {
  const wrapper = mount(MemoSelect, {
    global: {
      plugins: [ElSelect, ElOption, VueQueryPlugin, createTestingPinia()],
    },
  })

  test('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('should render the component and its options', async () => {
    expect(wrapper.findComponent(ElSelect).exists()).toBe(true)
  })

  test('clearable should be true', async () => {
    const select = wrapper.findComponent({ name: 'ElSelect' })
    expect(select.vm.clearable).toBe(true)
  })
})
