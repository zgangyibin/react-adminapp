import { POST, GET } from "./axios";
import api from "./api";

export function login(data, callback) {
  //登录
  POST(api.login, data, callback);
}
export function usersList(data, callback) {
  //用户列表
  POST(api.usersList, data, callback);
}
export function showUserPwd(data, callback) {
  //查看用户密码
  GET(`${api.showUserPwd}?id=${data.id}`, callback);
}
