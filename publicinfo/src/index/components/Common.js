import axios from "axios";
import { Component } from "react";

let base = "http://192.168.129.75:8080/";
// 请求前拦截
axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    console.log("请求超时");
    return Promise.reject(err);
  }
);

// 返回后拦截
axios.interceptors.response.use(
  data => {
    return data;
  },
  err => {
    if (err.response.status === 504 || err.response.status === 404) {
      console.log("服务器被吃了⊙﹏⊙∥");
    } else if (err.response.status === 401) {
      console.log("登录信息失效⊙﹏⊙∥");
    } else if (err.response.status === 500) {
      console.log("服务器开小差了⊙﹏⊙∥");
    }
    return Promise.reject(err);
  }
);

// @RequestBody请求
const post = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      "Content-Type": "application/json",
      charset: "utf-8"
    }
  });
};

// @RequsetParam请求
const postRequestParam = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

const get = (url,params) => {
  return axios({
    method: "get",
    url: `${base}${url}`,
    params:params,
  });
};

const multiple = function(requsetArray, callback) {
  axios.all(requsetArray).then(axios.spread(callback));
};

Component.prototype.get = get;
Component.prototype.post = post;
Component.prototype.postRequestParam = postRequestParam;
Component.prototype.multiple = multiple;

