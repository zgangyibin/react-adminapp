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
};
export default api;
