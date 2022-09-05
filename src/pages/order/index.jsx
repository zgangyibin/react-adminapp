import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  InputNumber,
  Image,
} from "antd";
import { connect } from "react-redux";
import { staticUrl } from "../../api/api";
import { updatepro } from "../../api/proService";
import { Fragment, useEffect, useReducer } from "react";
import { formatDate } from "../../utils/tool";
import { getOrderList, updateOrders } from "../../api/orderService";
import React from "react";
const STATUS = {
  0: "未付款",
  1: "已付款",
  2: "已发货",
  3: "已收货",
  4: "已评价",
};

const initState = {
  data: [],
  page: 1,
  pageSize: 20,
  total: 0,
  visible: false,
  selectData: {}, //选中编辑的商品
};
//使用useReducer
function reducer(state, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
}
const Order = function ({ pageConfig }) {
  //hooks
  const [form] = Form.useForm(); //返回一个form对象，把form对象传递form表单的form属性，可以获取该form的实例
  const [state, dispatch] = useReducer(reducer, initState);
  const onFinish = (values) => {
    // 发货
    updateOrders(
      {
        ...values,
        orderid: state.selectData.orderid,
        status: 2,
      },
      () => {
        message.success("发货成功");
        dispatch({ visible: false });
        init();
      }
    );
  };
  useEffect(
    function () {
      init();
    },
    [state.page, state.key]
  );
  const init = () => {
    getOrderList({ page: state.page }, (res) => {
      dispatch({ data: res.data[0].data, total: res.data[1].data[0].count });
    });
  };
  //隐藏弹窗
  const handleonCancel = () => {
    dispatch({ visible: false });
  };
  //编辑
  const handleEdit = (row) => {
    dispatch({
      visible: true,
      selectData: { orderid: row.orderid },
    });
    form.setFieldsValue({
      EMSname: "",
      EMS: "",
    });
  };
  //切换页码
  const handlePageChange = (page) => {
    dispatch({ page });
  };
  // table展开行
  const expandedRowRender = (record) => {
    console.log(record);
    return (
      <Table
        rowKey="id"
        columns={proTableColumn}
        dataSource={JSON.parse(record.prolist)}
        pagination={false}
      />
    );
  };
  const proTableColumn = [
    {
      title: "商品id",
      dataIndex: "id",
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "主图",
      dataIndex: "img",
      render(text) {
        if (!text) return null;
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
      title: "价格",
      dataIndex: "price",
      render(text) {
        return text.toFixed(2);
      },
    },
    {
      title: "添加时间",
      dataIndex: "addtime",
      render: (text) => formatDate(text, "YYYY-MM-DD hh:mm:ss"),
    },
  ];
  //订单表头
  const columns = [
    {
      title: "订单id",
      dataIndex: "orderid",
    },
    {
      title: "总价",
      dataIndex: "allprice",
    },
    {
      title: "收货地址",
      dataIndex: "address",
      render(text) {
        if (typeof text == "string") {
          try {
            text = JSON.parse(text);
            console.log(text);
            return text.name + "," + text.tel + "," + text.address;
          } catch {
            return text;
          }
        }
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text) => STATUS[text],
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: (text) => formatDate(text, "YYYY-MM-DD hh:mm:ss"),
    },
    {
      title: "编辑",
      dataIndex: "status",
      render: (
        text,
        row //row是整行的数据
      ) =>
        text === 1 && (
          <Fragment>
            {pageConfig.edit && (
              <Space>
                <Button onClick={() => handleEdit(row)} type="primary">
                  发货
                </Button>
              </Space>
            )}
          </Fragment>
        ),
    },
  ];
  return (
    <Fragment>
      <Table
        rowKey="orderid"
        columns={columns}
        dataSource={state.data}
        expandedRowRender={expandedRowRender}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: state.total,
          onChange: handlePageChange,
        }}
      />
      <Modal
        onCancel={handleonCancel}
        title="发货设置"
        visible={state.visible}
        footer={false}
        width={800}
      >
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="订单编号"
          >
            <h3>{state.selectData.orderid}</h3>
          </Form.Item>

          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="快递名称"
            name="EMSname"
            rules={[
              {
                required: true,
                message: "请输入快递名称 !",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="快递单号"
            name="EMS"
            rules={[
              {
                required: true,
                message: "请输入快递单号!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <p style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" ghost>
                {"确认发货"}
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
    ? JSON.parse(state?.user?.userInfo.authority).order
    : {},
}))(Order);
