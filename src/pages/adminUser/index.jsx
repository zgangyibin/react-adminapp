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
} from "antd";
import {
  getAdminUserList,
  addCreateAdminUser,
  updateAdminUser,
  delAdminUser,
} from "../../api/adminUserService";
import { Fragment, useEffect, useReducer, useState } from "react";
import { formatDate } from "../../utils/tool";
import React from "react";
const { Option } = Select;
const ROLEMAP = {
  1: { id: 1, text: "Admin" },
  2: { id: 2, text: "Normal" },
};
//使用useReducer
function reducer(state, action) {
  const { type, payload } = action; //payload是dispatch触发reducer传递的参数
  switch (type) {
    case "edit":
      return { ...state, user: payload, type };
    case "add":
      return { ...state, user: {}, type };
    default:
      return state;
  }
}
const AdminUser = function () {
  //hooks
  const [form] = Form.useForm(); //返回一个form对象，把form对象传递form表单的form属性，可以获取该form的实例
  const [data, setState] = useState([]);
  const [state, dispatch] = useReducer(reducer, { user: {}, type: "" });
  // 根据state的type属性判断是添加管理员还是修改
  const [visible, setVisible] = useState(false);
  const onFinish = (values) => {
    console.log(values);
    if (state.type === "add") {
      //添加管理员
      addCreateAdminUser(values, () => {
        //添加成功后重新获取管理员列表接口
        message.success("添加成功");
        setVisible(false);
        init();
      });
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
      updateAdminUser(
        {
          ...values,
          id: state.user.id,
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
      role: row.role,
      password: row.password,
      authority: row.authority,
    });
    dispatch({ type: "edit", payload: row });
    setVisible(true);
  };
  //添加管理员
  const handleAddUser = () => {
    // 设置form表单的值
    form.setFieldsValue({
      username: "",
      role: "",
      password: "",
      authority: "",
    });
    dispatch({ type: "add", payload: {} });
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
      title: "角色",
      dataIndex: "role",
      render: (text) => ROLEMAP[text]?.text,
    },
    {
      title: "权限",
      dataIndex: "authority",
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
            <Button onClick={() => handleEdit(row)} type="primary">
              编辑
            </Button>
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
          </Space>
        </Fragment>
      ),
    },
  ];
  return (
    <Fragment>
      <p>
        <Button onClick={handleAddUser}>添加管理员</Button>
      </p>
      <Table rowKey="id" columns={columns} dataSource={data} />
      <Modal
        onCancel={handleonCancel}
        title={state.type === "add" ? "添加管理员" : "修改管理员信息"}
        visible={visible}
        footer={false}
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
          {state.type === "add" && (
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
              <Input />
            </Form.Item>
          )}

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
            name="role"
            rules={[
              {
                required: true,
                message: "Please select!",
              },
            ]}
          >
            <Select>
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
            rules={[
              {
                required: true,
                message: "Please input your authority!",
              },
            ]}
          >
            <Input />
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

export default AdminUser;
