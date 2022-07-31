import { GET, POST } from "./axios";
import api from "./api";

export function getDashboardData(callback) {
  //数据
  GET(api.dashboard, callback);
}

export function deldetailimg(data, callback) {
  //删除文件
  POST(api.deldetailimg, data, callback);
}
