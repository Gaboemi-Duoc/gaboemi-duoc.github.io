import axios from 'axios';
const BASE_URL = 'goldencatapi-production.up.railway.app/api/usuario';

class UserService {
    getUserByID(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createUser(user) {
        return axios.post(BASE_URL, user);
    }
    updateUser(id, user) {
        return axios.put(`${BASE_URL}/${id}`, user);
    }
    deleteUser(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }
}
export default new UserService();