import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(
  function(config) {
    const authToken = localStorage.getItem('userToken');
    config.headers.Authorization = authToken;

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export { api };
