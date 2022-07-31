import { GET, POST } from "./axios";
import api from "./api";
export function getPro(data, callback) {
  //获取商品
  POST(api.getPro, data, callback);
}
export function addPro(data, callback) {
  //添加商品
  POST(api.addPro, data, callback);
}
export function getDetail(data, callback) {
  //获取商品详情
  GET(`${api.getDetail}?id=${data.id}`, callback);
}
export function updatepro(data, callback) {
  //更新商品
  POST(api.updatepro, data, callback);
}
export function delPro(data, callback) {
  //删除商品
  POST(api.delPro, data, callback);
}
