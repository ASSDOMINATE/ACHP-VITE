import axios from "axios";
import {ElMessage} from "element-plus";
import router from "./router";
import {useRouter} from "vue-router";

axios.defaults.timeout = 3000;
axios.defaults.baseURL = "http://www.thadhff.site";

const getStorageToken = () => {
    return window.localStorage.getItem("token");
}

//http request 拦截器
axios.interceptors.request.use(
    config => {
        // 配置请求头
        config.headers['token'] = getStorageToken();
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.code != 200) {
            ElMessage({message: response.data.msg, type: 'error'});
        }
        switch (response.data.code) {
            case 402:
            case 407:
            case 408:
            case 412:
                window.localStorage.removeItem('token');
                break;
            default:
                break;
        }
        return response;
    },
    error => {
        ElMessage({message: '请求失败请稍后重试', type: 'error'});
    }
);

// 封装 GET POST 请求并导出
export function request(url = '', params = {}, type = 'POST') {
//设置 url params type 的默认值
    return new Promise((resolve, reject) => {
        let promise
        if (type.toUpperCase() === 'GET') {
            promise = axios({
                url,
                params
            })
        } else if (type.toUpperCase() === 'POST') {
            promise = axios({
                method: 'POST',
                url,
                data: params
            })
        }
        //处理返回
        promise.then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}