import { GET, POST } from "./axios";
import api from "./api";

export function getAdminUserList(data, callback) {
  //管理员
  GET(`${api.getAdminUserList}?page=${data.page}`, callback);
}

export function addCreateAdminUser(data, callback) {
  //添加管理员
  POST(api.addCreateAdminUser, data, callback);
}
