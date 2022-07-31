import { GET } from "./axios";
import api from "./api";

export function getAllProType(callback) {
  GET(api.getAllProType, callback); ///获取商品分类
}
