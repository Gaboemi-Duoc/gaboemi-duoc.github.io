import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://goldencatapi-production.up.railway.app/api/usuario';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
  username?: string;
  clave?: string;
}

class UserService {
    testConnection() {
        return axios.get(`https://goldencatapi-production.up.railway.app`);
    }
    login(loginRequest: LoginRequest): Promise<AxiosResponse<string>> {
        return axios.post(`${BASE_URL}/login`, loginRequest);
    }

    getUserByID(id: number): Promise<AxiosResponse<User>> {
        return axios.get(`${BASE_URL}/${id}`);
    }

    createUser(user: User): Promise<AxiosResponse<User>> {
        return axios.post(BASE_URL, user);
    }

    updateUser(id: number, user: User): Promise<AxiosResponse<User>> {
        return axios.put(`${BASE_URL}/${id}`, user);
    }

    deleteUser(id: number): Promise<AxiosResponse<void>> {
        return axios.delete(`${BASE_URL}/${id}`);
    }
}

export default new UserService();