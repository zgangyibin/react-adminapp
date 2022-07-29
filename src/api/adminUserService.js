import { GET, POST } from "./axios";
import api from "./api";

export function getAdminUserList(data, callback) {
  //管理员
  GET(`${api.getAdminUserList}?page=${data.page}`, callback);
}
export function delAdminUser(data, callback) {
  //删除管理员
  GET(`${api.delAdminUser}?id=${data.id}`, callback);
}
export function addCreateAdminUser(data, callback) {
  //添加管理员
  POST(api.addCreateAdminUser, data, callback);
}

export function updateAdminUser(data, callback) {
  //修改管理员
  POST(api.updateAdminUser, data, callback);
}
