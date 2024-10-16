import axios from 'axios';
import type {User} from "@types";


class AuthService {
    login(user: User) {
        return axios
            .post(import.meta.env.VITE_APIGATEWAY_URL + 'login', {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user: User) {
        return axios.post(import.meta.env.VITE_APIGATEWAY_URL + 'register', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }
}

export default new AuthService();
