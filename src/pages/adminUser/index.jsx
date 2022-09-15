import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  List,
  Checkbox,
} from "antd";
import {
  getAdminUserList,
  addCreateAdminUser,
  updateAdminUser,
  delAdminUser,
} from "../../api/adminUserService";
import { connect } from "react-redux";
import { PAGEAUTH } from "../../config";
import { Fragment, useEffect, useReducer, useState } from "react";
import { formatDate } from "../../utils/tool";
import React from "react";
const { Option } = Select;
const ROLEMAP = {
  1: { id: 1, text: "Admin" },
  2: { id: 2, text: "Normal" },
};

const initData = {
  user: {},
  type: "",
  role: "1",
  authority: JSON.parse(JSON.stringify(PAGEAUTH[1])),
};

//使用useReducer
function reducer(state, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
}
const AdminUser = function ({ pageConfig }) {
  //hooks
  const [form] = Form.useForm(); //返回一个form对象，把form对象传递form表单的form属性，可以获取该form的实例
  const [data, setState] = useState([]);
  const [state, dispatch] = useReducer(reducer, initData); //reducer初始化数据
  // 根据state的type属性判断是添加管理员还是修改
  const [visible, setVisible] = useState(false);
  const onFinish = (values) => {
    // console.log(values);
    if (state.type === "add") {
      //添加管理员
      addCreateAdminUser(
        {
          ...values,
          role: state.role,
          authority: JSON.stringify(state.authority),
        },
        () => {
          //添加成功后重新获取管理员列表接口
          message.success("添加成功");
          setVisible(false);
          init();
        }
      );
    } else {
      //修改管理员信息,修改之前和原始数据比较，如果没有改变，不需要调修改接口
      const { user } = state;
      if (
        user.password === values.password &&
        user.role === values.role &&
        user.authority === values.authority
      ) {
        return;
      }
      console.log(state);
      updateAdminUser(
        {
          ...values,
          id: state.user.id,
          role: state.role,
          authority: JSON.stringify(state.authority),
        },
        () => {
          message.success("修改成功");
          setVisible(false);
          init();
        }
      );
    }
  };
  useEffect(function () {
    init();
  }, []);
  const init = () => {
    getAdminUserList({ page: 1 }, (res) => {
      //   console.log(res);
      setState(res.data[0].data);
    });
  };
  //隐藏弹窗
  const handleonCancel = () => {
    setVisible(false);
  };
  //编辑
  const handleEdit = (row) => {
    // console.log(row);
    // 设置form表单的值
    console.log(form);
    form.setFieldsValue({
      username: row.username,
      password: row.password,
    });
    dispatch({
      user: row,
      type: "edit",
      role: row.role,
      authority: row.authority ? JSON.parse(row.authority) : PAGEAUTH[row.role],
    });
    setVisible(true);
  };
  //添加管理员
  const handleAddUser = () => {
    // 设置form表单的值
    form.setFieldsValue({
      username: "",
      password: "",
    });
    dispatch({ user: {}, type: "add", role: "1", authority: PAGEAUTH[1] });
    setVisible(true);
  };
  // 删除管理员
  const handleDel = (row) => {
    delAdminUser(
      {
        id: row.id,
      },
      () => {
        message.success("删除成功");
        init();
      }
    );
  };
  //修改用户权限
  const onChangeAuth = (item, key, e) => {
    // item页面，key页面的操作名称，e当前CheckBox的对象
    console.log(item, key, e);
    state.authority[item][key] = e.target.checked;
    dispatch({ authority: state.authority });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "昵称",
      dataIndex: "nick",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: (text) => formatDate(text, "YYYY-MM-DD hh:mm:ss"),
    },
    {
      title: "编辑",
      dataIndex: "id",
      render: (
        text,
        row //row是整行的数据
      ) => (
        <Fragment>
          <Space>
            {pageConfig.edit && (
              <Button onClick={() => handleEdit(row)} type="primary">
                编辑
              </Button>
            )}
            {pageConfig.delete && (
              <Popconfirm
                title="确认删除？"
                onConfirm={() => handleDel(row)}
                okText="确认"
                cancelText="取消"
              >
                <a href="#">
                  <Button type="danger">删除</Button>
                </a>
              </Popconfirm>
            )}
          </Space>
        </Fragment>
      ),
    },
  ];
  return (
    <Fragment>
      <p>
        {pageConfig.add && <Button onClick={handleAddUser}>添加管理员</Button>}
      </p>
      <Table rowKey="id" columns={columns} dataSource={data} />
      <Modal
        onCancel={handleonCancel}
        title={state.type === "add" ? "添加管理员" : "修改管理员信息"}
        visible={visible}
        footer={false}
        width={1200}
      >
        <Form
          form={form}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input disabled={state.type !== "add"} />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="角色"
          >
            <Select
              value={state.role}
              onChange={(e) => {
                //用户角色改变，默认权限也会改变
                dispatch({
                  role: e,
                  authority: JSON.parse(JSON.stringify(PAGEAUTH[e])),
                });
              }}
            >
              {Object.keys(ROLEMAP).map((key) => (
                <Option key={ROLEMAP[key].id} value={String(ROLEMAP[key].id)}>
                  {ROLEMAP[key].text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="权限"
            name="authority"
          >
            <List
              dataSource={Object.keys(state.authority)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={state.authority[item].title}
                    description={Object.keys(state.authority[item]).map(
                      (o) =>
                        o !== "title" && (
                          <Checkbox
                            key={o}
                            checked={state.authority[item][o]}
                            onChange={(e) => onChangeAuth(item, o, e)}
                          >
                            {o}
                          </Checkbox>
                        )
                    )}
                  />
                </List.Item>
              )}
            />
          </Form.Item>

          <Form.Item>
            <p style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" ghost>
                {state.type === "add" ? "提交" : "修改"}
              </Button>
            </p>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default connect((state) => ({
  pageConfig: state?.user?.userInfo.authority
    ? JSON.parse(state?.user?.userInfo.authority).adminuser
    : {},
}))(AdminUser);
