import axios from 'axios';

export default axios.create({
    baseURL: 'http://openapi.data.go.kr',
});
