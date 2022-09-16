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
  getPro: `${url}/api/getBlogList`, //获取博客
  addPro: `${url}/api/addBlog`, //添加博客
  adddetailimg: `${url}/api/adddetailimg`, //上传文件
  deldetailimg: `${url}/api/deldetailimg`, //删除文件
  getDetail: `${url}/api/getDetail`, //获取博客详情
  updatepro: `${url}/api/updateBlog`, //更新博客
  delPro: `${url}/api/delBlog`, //删除博客
};
export default api;
