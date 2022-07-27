const initState = {
  userInfo: sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo"))
    : "",
}; //每次刷新页面，项目会被初始化，state也会被初始化，所以要先读storage里有没有对应的数据
export default function userReducer(state = initState, action) {
  //创建一个user的reducer,该reducer返回的state放在store的user属性里面，store.user.state
  const { type, payload } = action; //payload是dispatch触发reducer传递的参数
  switch (type) {
    case "SET_USER":
      state.userInfo = payload;
      sessionStorage.setItem("userInfo", JSON.stringify(payload));
      return { ...state };
    case "LOGOUT":
      state.userInfo = "";
      sessionStorage.clear();
      return { ...state };
    default:
      return state;
  }
}
