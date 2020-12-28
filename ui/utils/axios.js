import axios from 'axios';

axios.interceptors.request.use(
    config => {
      return config
    },
    error => {
      Promise.reject(error)
    }
  );
  
// response 拦截器
axios.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
);
  
  export default axios;