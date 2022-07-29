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
  Image,
} from "antd";
import {
  addCreateAdminUser,
  updateAdminUser,
  delAdminUser,
} from "../../api/adminUserService";
import { getPro } from "../../api/proService";
import { Fragment, useEffect, useReducer } from "react";
import { formatDate } from "../../utils/tool";
import { staticUrl } from "../../api/api";
import React from "react";
const { Option } = Select;
const ROLEMAP = {
  1: { id: 1, text: "Admin" },
  2: { id: 2, text: "Normal" },
};
const initState = {
  proData: [],
  page: 1,
  pageSize: 10,
  total: 0,
  visible: false,
  selectProData: {}, //选中编辑的商品
};
//使用useReducer
function reducer(state, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
}
const Product = function () {
  //hooks
  const [form] = Form.useForm(); //返回一个form对象，把form对象传递form表单的form属性，可以获取该form的实例
  const [state, dispatch] = useReducer(reducer, initState);
  const onFinish = (values) => {
    console.log(values);
    if (state.type === "add") {
      //添加管理员
      addCreateAdminUser(values, () => {
        //添加成功后重新获取管理员列表接口
        message.success("添加成功");
        dispatch({ visible: false });
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
          dispatch({ visible: false });
          init();
        }
      );
    }
  };
  useEffect(
    function () {
      init();
    },
    [state.page, state.key]
  );
  const init = () => {
    getPro({ page: state.page, key: state.key, orderbytype: "id" }, (res) => {
      dispatch({ proData: res.data[0].data, total: res.data[1].data[0].count });
    });
  };
  //隐藏弹窗
  const handleonCancel = () => {
    dispatch({ visible: false });
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
    dispatch({ visible: true });
  };
  //切换页码
  const handlePageChange = (page) => {
    dispatch({ page });
  };
  //添加商品
  const handleAddPro = () => {
    // 设置form表单的值
    form.setFieldsValue({
      username: "",
      role: "",
      password: "",
      authority: "",
    });
    dispatch({ visible: true, selectProData: {} });
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
      title: "商品主图",
      dataIndex: "img",
      render(text) {
        var arr = text.split(",");
        return arr.map((item) => (
          <Image
            key={item}
            preview={false}
            src={`${staticUrl}/apidoc/${item}`}
            style={{ width: 50 }}
          />
        ));
      },
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "价格",
      dataIndex: "price",
    },
    {
      title: "折扣",
      dataIndex: "discount",
    },
    {
      title: "销量",
      dataIndex: "sales",
    },
    {
      title: "库存",
      dataIndex: "stock",
    },
    {
      title: "品牌",
      dataIndex: "brand",
    },
    {
      title: "颜色",
      dataIndex: "color",
    },
    {
      title: "尺寸",
      dataIndex: "size",
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
        <Button onClick={handleAddPro}>添加商品</Button>
      </p>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={state.proData}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: state.total,
          onChange: handlePageChange,
        }}
      />
      <Modal
        onCancel={handleonCancel}
        title={state.type === "add" ? "添加商品" : "修改商品信息"}
        visible={state.visible}
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

export default Product;
