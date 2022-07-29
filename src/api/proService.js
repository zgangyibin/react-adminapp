import { POST } from "./axios";
import api from "./api";
export function getPro(data, callback) {
  //查看用户密码
  POST(api.getPro, data, callback);
}
