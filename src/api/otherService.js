import { GET } from "./axios";
import api from "./api";

export function getDashboardData(callback) {
  //数据
  GET(api.dashboard, callback);
}
