const url = "";
export const staticUrl = "http://localhost:8081"; //静态文件地址
const api = {
  login: `${url}/api/adminLogin`, //登录
  dashboard: `${url}/api/getOrdersEchartData`, //数据
  getAdminUserList: `${url}/api/getAdminUserList`, //管理员
  addCreateAdminUser: `${url}/api/addCreateAdminUser`, //添加管理员
  updateAdminUser: `${url}/api/updateAdminUser`, //修改管理员
  delAdminUser: `${url}/api/delAdminUser`, //删除管理员
  usersList: `${url}/api/usersList`, //用户列表
  showUserPwd: `${url}/api/showUserPwd`, //查看用户密码
  getPro: `${url}/api/getPro`, //获取商品
  addPro: `${url}/api/addPro`, //添加商品
  getAllProType: `${url}/api/getAllProType`, //获取商品分类
  adddetailimg: `${url}/api/adddetailimg`, //上传文件
  deldetailimg: `${url}/api/deldetailimg`, //删除文件
  getDetail: `${url}/api/getDetail`, //获取商品详情
  updatepro: `${url}/api/updatepro`, //更新商品
  delPro: `${url}/api/delPro`, //删除商品
  getOrderList: `${url}/api/getOrdersList`, //获取订单数据
  updateOrders: `${url}/api/updateOrders`, //更新订单数据
};
export default api;
