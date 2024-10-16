import {defineStore} from 'pinia'
import type {User} from "@types";

export const useAuthStore = defineStore('auth', {
    state: (): {
        token: string,
        user: User,
        users: User[],
        returnUrl: null | string,
        isUserAuthenticated: boolean
    } => ({
        token: '',
        user: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
        },
        users: [],
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
        getUsers(state) {
            return state.users
        },
        getIsUserAuthenticated(state) {
            return state.isUserAuthenticated
        }
    },
    actions: {
        setToken(token: string) {
            this.token = token
        },
        setUser(user: User) {
            this.user = user
        },
        setUsers(users: User[]) {
            this.users = users
        },
        setIsUserAuthenticated(isUserAuthenticated: boolean) {
            this.isUserAuthenticated = isUserAuthenticated
        },
        async login(username: string, password: string) {
        },
        async logout() {
        },
        async isAuthenticated(): Promise<boolean> {
            return this.token !== '';
        }
    },
})