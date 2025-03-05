import {defineStore} from 'pinia'
import type {User} from "@types";

export const useAuthStore = defineStore('auth', {
    state: (): {
        token: string,
        user: User,
        returnUrl: null | string,
        isUserAuthenticated: boolean
    } => ({
        token: '',
        user: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            role: 'user'
        },
        returnUrl: null,
        isUserAuthenticated: false
    }),
    getters: {
        getToken(state) {
            return state.token
        },
        getUser(state) {
            return state.user
        },
        getIsUserAuthenticated(state) {
            return state.isUserAuthenticated
        },
    },
    actions: {
        setToken(token: string) {
            this.token = token
        },
        setUser(user: User) {
            this.user = user
        },
        setIsUserAuthenticated(isUserAuthenticated: boolean) {
            this.isUserAuthenticated = isUserAuthenticated
        },
    },
})