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
import { getDetail, updatepro } from "../../api/proService";
import { Fragment, useEffect, useReducer } from "react";
import { formatDate } from "../../utils/tool";
import { getOrderList } from "../../api/orderService";
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
  selectOrder: {}, //选中编辑的商品
};
//使用useReducer
function reducer(state, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
}
const Order = function () {
  //hooks
  const [form] = Form.useForm(); //返回一个form对象，把form对象传递form表单的form属性，可以获取该form的实例
  const [state, dispatch] = useReducer(reducer, initState);
  const onFinish = (values) => {
    updatepro(
      {
        ...values,
        img: state.imgList.join(","),
        detail: state.html,
        id: state.selectProData.id,
      },
      () => {
        message.success("修改成功");
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
    // 根据分类id找父类id
    const { typeid } = row;
    let fatherid = state.proType[typeid].fatherid;
    let mainId = "1";
    let keyArr = Object.keys(state.proType);
    for (let i = 0; i < keyArr.length; i++) {
      if (fatherid.includes(keyArr[i])) {
        mainId = Number(keyArr[i]);
      }
    }
    getDetail({ id: row.id }, (res) => {
      //商品详情需要调用接口返回
      dispatch({ html: res.data[0].data[0].detail });
    });
    // 设置state的imgList，把主图传入uploading组件
    dispatch({
      type: "edit",
      payload: row,
      visible: true,
      mainId,
      imgList: row.img.split(","),
      html: "",
      selectProData: { id: row.id },
    });
    form.setFieldsValue({
      ...row,
      mainId: Number(mainId),
    });
  };
  //切换页码
  const handlePageChange = (page) => {
    dispatch({ page });
  };
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
        text = JSON.parse(text);
        return text.name + "," + text.tel + "," + text.address;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text) => STATUS[text],
    },
    // {
    //   title: "商品",
    //   dataIndex: "prolist",
    // },
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
            <Space>
              <Button onClick={() => handleEdit(row)} type="primary">
                发货
              </Button>
            </Space>
          </Fragment>
        ),
    },
  ];
  return (
    <Fragment>
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
        title="修改订单状态"
        visible={state.visible}
        footer={false}
        width={800}
      >
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="商品标题"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input title!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="单价"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input price!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="折扣"
            name="discount"
            rules={[
              {
                required: true,
                message: "Please input discount!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="权重"
            name="weight"
            rules={[
              {
                required: true,
                message: "Please input weight!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="库存"
            name="stock"
            rules={[
              {
                required: true,
                message: "Please input stock!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="流行度"
            name="popular"
            rules={[
              {
                required: true,
                message: "Please input popular!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="销量"
            name="sales"
            rules={[
              {
                required: true,
                message: "Please input sales!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="颜色"
            name="color"
            rules={[
              {
                required: true,
                message: "Please input color",
              },
            ]}
          >
            <Input placeholder="use','split!" />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="尺寸"
            name="size"
            rules={[
              {
                required: true,
                message: "Please input size",
              },
            ]}
          >
            <Input placeholder="use','split!" />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="品牌"
            name="brand"
            rules={[
              {
                required: true,
                message: "Please input brand",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <p style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" ghost>
                {"提交"}
              </Button>
            </p>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Order;
