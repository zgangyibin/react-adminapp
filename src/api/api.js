const url = "";

const api = {
  login: `${url}/dapi/vapi/adminLogin`, //登录
  dashboard: `${url}/dapi/vapi/getOrdersEchartData`, //数据
  getAdminUserList: `${url}/dapi/vapi/getAdminUserList`, //管理员
  addCreateAdminUser: `${url}/dapi/vapi/addCreateAdminUser`, //添加管理员
};
export default api;
