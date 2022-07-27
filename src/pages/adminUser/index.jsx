import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  getAdminUserList,
  addCreateAdminUser,
} from "../../api/adminUserService";
import { Fragment, useEffect, useState } from "react";
import { formatDate } from "../../utils/tool";
import React from "react";
const { Option } = Select;
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
    render: (text) => (
      <Fragment>
        <Space>
          <Button type="primary">编辑</Button>
          <Button type="danger">删除</Button>
        </Space>
      </Fragment>
    ),
  },
];
const AdminUser = function () {
  const [data, setState] = useState([]);
  const [visible, setVisible] = useState(false);
  const onFinish = (values) => {
    //添加管理员
    console.log(values);
    addCreateAdminUser(values, (res) => {
      //添加成功后重新获取管理员列表接口
      message.success("添加成功");
      setVisible(false);
      init();
    });
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
  //显示弹窗
  const handleShowVisible = () => {
    setVisible(true);
  };
  //隐藏弹窗
  const handleonCancel = () => {
    setVisible(false);
  };

  return (
    <Fragment>
      <p>
        <Button onClick={handleShowVisible}>添加管理员</Button>
      </p>
      <Table rowKey="id" columns={columns} dataSource={data} />
      <Modal
        onCancel={handleonCancel}
        title="添加管理员"
        visible={visible}
        footer={false}
      >
        <Form
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
            <Input />
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
            name="role"
            rules={[
              {
                required: true,
                message: "Please select!",
              },
            ]}
          >
            <Select>
              <Option value="admin">admin</Option>
              <Option value="normal">normal</Option>
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
                提交
              </Button>
            </p>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default AdminUser;
