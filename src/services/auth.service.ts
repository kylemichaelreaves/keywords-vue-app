import axios from 'axios';
import type {User} from "@types";
import { useAuthStore } from '@stores/auth.ts'

const USERS_API = import.meta.env.VITE_LOCAL_APIGATEWAY_URL;

class AuthService {
    async login(username: User['username'], password: User['password']) {
        return await axios
            .post(USERS_API + '/login', {
                username: username,
                password: password
            }, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                return response.data;
            });
    }
    logout() {
        const authStore = useAuthStore();
        localStorage.removeItem('user');
        authStore.setUser({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            role: 'user'
        });
    }

}

export default new AuthService();
