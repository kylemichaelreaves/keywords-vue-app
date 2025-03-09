import type {User} from "@types";
import { useAuthStore } from '@stores/auth.ts'
import { httpClient } from '@api/httpClient.ts'

class AuthService {
    async login(username: User['username'], password: User['password']) {
        return await httpClient
            .post('/login', {
                username: username,
                password: password
            })
            .then(response => {
                return response.data;
            });
    }
    logout() {
        const authStore = useAuthStore();
        sessionStorage.removeItem('user');
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
