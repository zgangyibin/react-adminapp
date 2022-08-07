import { GET, POST } from "./axios";
import api from "./api";

export function getOrderList(data, callback) {
  //获取订单数据
  POST(api.getOrderList, data, callback);
}
export function updateOrders(data, callback) {
  //更新订单数据
  POST(api.updateOrders, data, callback);
}
