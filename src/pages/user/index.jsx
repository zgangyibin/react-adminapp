import { Table, Modal, Image, Button, Input } from "antd";
import { connect } from "react-redux";
import { usersList, showUserPwd } from "../../api/userService";
import { staticUrl } from "../../api/api";
import { Fragment, useEffect, useReducer } from "react";
import { formatDate } from "../../utils/tool";
import React from "react";

const { Search } = Input;

const initState = {
  data: [], //table数据
  total: 0, //数据总数
  page: 1, //当前页码
  key: "", //搜索关键词
  pageSize: 10, //每页几条数据
  visible: false, //弹窗显示与否
  password: "", //查询用户密码字段
};

function reducer(state, action) {
  // 方法一
  //   const { type, payload } = action;
  //   switch (type) {
  //     case "tableData": //表格数据变化
  //       return { ...state, data: payload.data, total: payload.total };
  //     case "page": //分页数据变化
  //       return { ...state, page: payload.page };
  //     case "key": //搜索关键词变化
  //       return { ...state, key: payload.key };
  //     case "visible": //搜索关键词变化
  //       return { ...state, visible: payload.visible };
  //     case "password": //修改用户密码
  //       return { ...state, password: payload.password };
  //     default:
  //       return state;
  //   }
  //   方法二
  if (action) {
    // action是一个对象，如果有action对象，则把action对象字段覆盖到state对象
    return { ...state, ...action };
  }
  return state;
}
const Users = function ({ pageConfig }) {
  //hooks
  const [state, dispatch] = useReducer(reducer, initState);
  useEffect(
    function () {
      init();
    },
    [state.page, state.key]
  ); //state.page 或state.key变化才触发function
  const init = () => {
    usersList(
      { page: state.page, key: state.key, pageSize: state.pageSize },
      (res) => {
        console.log(res);
        // dispatch({
        //   type: "tableData",
        //   payload: { data: res.data[0].data, total: res.data[1].data[0].total },
        // });
        dispatch({ data: res.data[0].data, total: res.data[1].data[0].total });
      }
    );
  };
  //隐藏弹窗
  const handleonCancel = () => {
    // dispatch({ type: "visible", payload: { visible: false } });
    dispatch({ visible: false });
  };
  //切换页码
  const handlePageChange = (page) => {
    // dispatch({ type: "page", payload: { page } });
    dispatch({ page });
  };
  //查看用户密码
  const showPassWord = (id) => {
    showUserPwd({ id }, (res) => {
      console.log(res);
      //   dispatch({ type: "visible", payload: { visible: true } });
      //   dispatch({
      //     type: "password",
      //     payload: { password: res.data[0][0].password },
      //   });
      dispatch({ password: res.data[0][0].password, visible: true });
    });
  };
  //按昵称搜索用户
  const onSearch = (key) => {
    // 搜索用户需要把page初始化为1
    console.log(key);
    dispatch({ key, page: 1 });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      render(text, row) {
        //需要判断是否上传头像，没有上传显示默认头像
        //avatartype=1是微信头像，不需要拼接服务器地址
        let imgUrl = "https://joeschmoe.io/api/v1/random";
        if (text && row.avatartype === "1") {
          imgUrl = text;
        } else if (text) {
          imgUrl = `${staticUrl}/apidoc/${text}`;
        }
        return <Image preview={false} src={imgUrl} style={{ width: 50 }} />;
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "昵称",
      dataIndex: "nick",
    },
    {
      title: "余额",
      dataIndex: "mymoney",
    },
    {
      title: "用户类型",
      dataIndex: "avatartype",
      render: (text) => (text === "1" ? "微信用户" : "商城平台用户"),
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: (text) => formatDate(text, "YYYY-MM-DD hh:mm:ss"),
    },
    {
      title: "创建时间",
      dataIndex: "id",
      render: (text) =>
        pageConfig.edit && (
          <Button
            onClick={() => {
              showPassWord(text);
            }}
          >
            查看密码
          </Button>
        ),
    },
  ];
  return (
    <Fragment>
      <p>
        {" "}
        <Search
          placeholder="请输入昵称"
          onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
      </p>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={state.data}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: state.total,
          onChange: handlePageChange,
        }}
      />
      <Modal
        onCancel={handleonCancel}
        title="用户密码"
        visible={state.visible}
        footer={false}
      >
        当前用户密码是：{state.password}
      </Modal>
    </Fragment>
  );
};
export default connect((state) => ({
  pageConfig: state?.user?.userInfo.authority
    ? JSON.parse(state?.user?.userInfo.authority).users
    : {},
}))(Users);
