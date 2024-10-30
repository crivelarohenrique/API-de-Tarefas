import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

export const userApi = {
  register: async(name: string ,email: string, password: string) => {
    const response = await axios.post(`${API_URL}/user`, { name, email, password });
    return response.data
  },
  login: async(email: string, password: string) => {
    const response = await axios.post(`${API_URL}/user/login`, { email, password });  
    return response.data
  },
  update: async(name: string, id: string) => {
    const response = await axios.patch(`${API_URL}/user/edit`, { name, id});
    return response.data
  },
  getUserById: async (id: string) => {
      const response = await axios.get(`${API_URL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data
  }
};
