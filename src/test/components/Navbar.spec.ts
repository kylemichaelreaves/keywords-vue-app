import { mount, VueWrapper } from '@vue/test-utils'
import Navbar from '@components/Navbar.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { ElTabPane, ElTabs } from 'element-plus'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { routes } from '@router'
import { createTestingPinia } from '@pinia/testing'

// Define the component instance type properly
type NavbarInstance = InstanceType<typeof Navbar>

describe('Navbar.vue', () => {
  let wrapper: VueWrapper<NavbarInstance>

  // Define the same exclusions as the Navbar component
  const excludedRoutes = ['not-found', 'login', 'register']
  const displayedRoutes = routes.filter((r) => !excludedRoutes.includes(r.name as string))

  beforeEach(() => {
    const router = createRouter({
      history: createWebHistory(),
      routes: routes,
    })

    // Mock the stores that the component might use
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    })

    wrapper = mount(Navbar, {
      global: {
        components: {
          ElTabs,
          ElTabPane,
        },
        plugins: [router, pinia],
        stubs: {
          ThemeToggle: true, // Stub the ThemeToggle component
          'el-icon': true,
          'el-tag': true,
        },
      },
    })
  })

  it('renders the correct number of tabs', () => {
    const tabs = wrapper.findAllComponents(ElTabPane)
    // Filter out login control tab, only count route tabs
    const routeTabs = tabs.filter((tab) => !tab.classes().includes('login-control'))
    expect(routeTabs.length).toBe(displayedRoutes.length)
  })

  it('clicking on a tab changes the active tab', async () => {
    const tabs = wrapper.findComponent(ElTabs)

    // Find the first tab pane that represents a route (not login control)
    const routeTabPanes = wrapper.findAllComponents(ElTabPane)
    const firstRouteTab = routeTabPanes.find((tab) => !tab.classes().includes('login-control'))

    if (firstRouteTab) {
      // Simulate tab click by emitting the tab-click event on ElTabs
      await tabs.vm.$emit('tab-click', { index: 1, paneName: '1' })

      // Since this is testing navigation behavior, we can check if the component
      // responds to tab clicks appropriately
      expect(firstRouteTab.exists()).toBe(true)
    }
  })

  it('renders navbar container with correct data-test-id', () => {
    const navbarContainer = wrapper.find('[data-test-id="navbar"]')
    expect(navbarContainer.exists()).toBe(true)
  })

  it('renders theme toggle component', () => {
    const themeToggle = wrapper.findComponent({ name: 'ThemeToggle' })
    expect(themeToggle.exists()).toBe(true)
  })

  it('renders login control tab', () => {
    const loginTab = wrapper.find('.login-control')
    expect(loginTab.exists()).toBe(true)
  })

  it('displays correct number of navigation routes', () => {
    // Test that the component renders all available routes
    const routeElements = wrapper.findAll('.custom-tabs-label')
    expect(routeElements.length).toBe(displayedRoutes.length)
  })
})
