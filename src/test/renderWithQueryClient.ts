import {createApp, h} from "vue";
import type {Component} from "vue"
import type { QueryClientConfig} from "@tanstack/vue-query"
import {render} from "@testing-library/vue";
import type {RenderOptions} from "@testing-library/vue";
import { QueryClient, VueQueryPlugin} from "@tanstack/vue-query";
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