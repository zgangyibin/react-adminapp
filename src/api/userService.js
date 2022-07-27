import { POST } from "./axios";
import api from "./api";

export function login(data, callback) {
  //登录
  POST(api.login, data, callback);
}
