// src/spec/router.mock.ts
import { createRouter, createMemoryHistory } from "vue-router";

export const mockRouter = createRouter({
    history: createMemoryHistory(),
    routes: [],
});
