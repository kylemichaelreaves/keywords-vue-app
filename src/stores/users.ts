import {defineStore} from 'pinia'
import type {User} from "@types";


export const useUsersStore = defineStore('users', {
    state: (): {
        users: Array<User>
    } => ({
        users: [],
    }),
    getters: {
        getUsers(state) {
            return state.users
        },
    },
    actions: {
        add(user: User) {
            this.users.push(user)
        },
    },
})