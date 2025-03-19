import {defineStore} from 'pinia'
import type {User} from "@types";
import { httpClient } from '@api/httpClient.ts'

export const useAuthStore = defineStore('auth', {
    state: (): {
        token: string,
        user: User,
        isUserAuthenticated: boolean
    } => ({
        token: '',
        user: {
            id: 0,
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            role: 'guest'
        },
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
        async login(username: User['username'], password: User['password']) {
            return await httpClient
              .post('/login', {
                  username: username,
                  password: password
              })
              .then(response => {
                  return response.data;
              });
        },
        logout() {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this.setUser({
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
                role: 'guest'
            });
        },
    },
})