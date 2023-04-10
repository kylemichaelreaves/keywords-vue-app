import {Component, createApp, h} from "vue";
import {render, RenderOptions} from "@testing-library/vue";
import {QueryClient, QueryClientConfig, VueQueryPlugin} from "@tanstack/vue-query";
import ElementPlus from "element-plus";

export const renderWithQueryClient = (component: Component,
                                      options?: RenderOptions | undefined,
                                      config?: QueryClientConfig) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
        logger: {
            log: console.log,
            warn: console.warn,
            error: () => {
            }
        },
        ...config,
    })
    const app = createApp({
        components: {
            component,
            ElementPlus,
            VueQueryPlugin
        },
        setup() {
            return () => h(component, options)
        },
    })
    app.use(VueQueryPlugin, {queryClient})
    app.use(ElementPlus)

    return render(app, {
        ...options
    })
}