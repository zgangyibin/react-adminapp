const url = "";
export const staticUrl = "https://8i98.com"; //静态文件地址
const api = {
  login: `${url}/dapi/vapi/adminLogin`, //登录
  dashboard: `${url}/dapi/vapi/getOrdersEchartData`, //数据
  getAdminUserList: `${url}/dapi/vapi/getAdminUserList`, //管理员
  addCreateAdminUser: `${url}/dapi/vapi/addCreateAdminUser`, //添加管理员
  updateAdminUser: `${url}/dapi/vapi/updateAdminUser`, //修改管理员
  delAdminUser: `${url}/dapi/vapi/delAdminUser`, //删除管理员
  usersList: `${url}/dapi/vapi/usersList`, //用户列表
  showUserPwd: `${url}/dapi/vapi/showUserPwd`, //查看用户密码
  getPro: `${url}/dapi/vapi/getPro`, //获取商品
  addPro: `${url}/dapi/vapi/addPro`, //添加商品
  getAllProType: `${url}/dapi/vapi/getAllProType`, //获取商品分类
  adddetailimg: `${url}/dapi/vapi/adddetailimg`, //上传文件
  deldetailimg: `${url}/dapi/vapi/deldetailimg`, //删除文件
  getDetail: `${url}/dapi/vapi/getDetail`, //获取商品详情
  updatepro: `${url}/dapi/vapi/updatepro`, //更新商品
  delPro: `${url}/dapi/vapi/delPro`, //删除商品
  getOrderList: `${url}/dapi/vapi/getOrdersList`, //获取订单数据
};
export default api;
