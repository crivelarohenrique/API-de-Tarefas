import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

export const eventApi = {
  
  create: async (name: string, description: string, hour: string, date: string) => {
    const response = await axios.post(`${API_URL}/event/create`, 
      { 
        name, 
        description, 
        hour, 
        date 
      }, 
      { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      }
    );
    return response.data;
  },

  findAll: async () => {
    const response = await axios.get(`${API_URL}/event`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data;
  },

  findOne: async (id: string) => {
    const response = await axios.get(`${API_URL}/event/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data;
  },

  update: async (id: string, name: string, description: string, hour: string, date: string) => {
    const response = await axios.patch(`${API_URL}/event/${id}`, 
      { name, description, hour, date }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/event/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data;
  }
}
