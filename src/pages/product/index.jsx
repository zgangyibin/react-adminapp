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
  InputNumber,
  Image,
} from "antd";
import {
  getPro,
  addPro,
  getDetail,
  updatepro,
  delPro,
} from "../../api/proService";
import { connect } from "react-redux";
import { Fragment, useEffect, useReducer } from "react";
import { formatDate } from "../../utils/tool";
import { staticUrl } from "../../api/api";
import { getAllProType } from "../../api/proTypeService";
import { deldetailimg } from "../../api/otherService";
import Uploading from "../../components/uploading";
import WangEditor from "../../components/wangEditor";
import React from "react";
const { Option } = Select;

const initState = {
  proData: [],
  page: 1,
  pageSize: 10,
  total: 0,
  visible: false,
  selectProData: {}, //选中编辑的商品
  proType: {}, //商品分类数据
  mainId: "", //选择的主分类
  imgList: [], //商品主图列表
  html: "", //富文本编辑器编辑内容
};
//使用useReducer
function reducer(state, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
}
const Product = function ({ pageConfig }) {
  //hooks
  const [form] = Form.useForm(); //返回一个form对象，把form对象传递form表单的form属性，可以获取该form的实例
  const [state, dispatch] = useReducer(reducer, initState);
  //添加产品
  const onFinish = (values) => {
    console.log(state.imgList);
    console.log(state.html);
    console.log(values);
    if (state.imgList.length === 0) {
      return message.error("至少上传一张主图");
    }
    if (state.html.length < 10) {
      return message.error("至少添加十个字符的文本内容");
    }
    if (state.type === "add") {
      //添加商品
      addPro(
        { ...values, img: state.imgList.join(","), detail: state.html },
        () => {
          message.success("添加成功");
          dispatch({ visible: false });
          init();
        }
      );
    } else {
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
    }
  };
  useEffect(function () {
    getAllProType(function (res) {
      // console.log(res);
      const { data } = res.data[0];
      let o = {};
      data.forEach(function (item) {
        o[item.id] = item; //一一映射，数组转为对象
      });
      dispatch({ proType: o });
    });
  }, []); //渲染完成执行一次
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
  //添加商品弹窗打开
  const handleAddPro = () => {
    // 设置form表单的值
    form.setFieldsValue({
      title: "",
      price: "",
      discount: "",
      weight: "",
      stock: "",
      popular: "",
      sales: "",
      color: "",
      size: "",
      brand: "",
      mainId: "",
      typeid: "",
    });
    dispatch({
      visible: true,
      selectProData: {},
      type: "add",
      imgList: [],
      html: "",
    });
  };
  // 删除商品
  const handleDel = (row) => {
    // 删除商品之前需要删除该商品的所有图片,主图和详情图
    let imgArr = row.img.split(",");
    getDetail({ id: row.id }, (res) => {
      //商品详情需要调用接口返回
      const { detail } = res.data[0].data[0];
      console.log(detail);
      let reg =
        /(?<=\<img src="https:\/\/8i98.com\/apidoc\/)vapi\/\d+\/[\w-]+\.[a-z]+(?=" alt="" data-href="" style=""\>)/g; // 找出详情里面的所有图片的正则
      let imgs = detail.match(reg) || [];
      deldetailimg(
        {
          file: [...imgArr, ...imgs],
        },
        () => {}
      );
      delPro({ id: row.id }, () => {
        message.success("删除成功");
        init();
      });
    });
  };
  // wangEditor子传父
  const handleChangeEditor = (html) => {
    dispatch({ html });
  };
  //主分类切换
  const handleMainTypeChange = (value) => {
    dispatch({ mainId: value });
  };
  // upload子组件图片需要放到state的imgList里面（子传父）
  const handleUploadChange = (imgList) => {
    dispatch({ imgList });
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
      title: "分类",
      dataIndex: "typeid",
      render: (text) => state.proType[text]?.title,
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
  const typeList = Object.keys(state.proType).map((key) => state.proType[key]); //把proType的value值转为数组
  return (
    <Fragment>
      <p>
        {pageConfig.add && <Button onClick={handleAddPro}>添加商品</Button>}
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
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="主分类"
            name="mainId"
            rules={[
              {
                required: true,
                message: "Please select!",
              },
            ]}
          >
            <Select onChange={handleMainTypeChange}>
              {typeList
                .filter((item) => item.typelevel === 0)
                .map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="分类"
            name="typeid"
            rules={[
              {
                required: true,
                message: "Please select!",
              },
            ]}
          >
            <Select>
              {typeList
                .filter(
                  (item) =>
                    item.typelevel === 1 &&
                    item.fatherid.includes(String(state.mainId))
                )
                .map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <div>
            <Uploading ImgChange={handleUploadChange} imgList={state.imgList} />
          </div>
          <div>
            <WangEditor
              handleChangeEditor={handleChangeEditor}
              htmlContent={state.html}
            />
          </div>
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
    ? JSON.parse(state?.user?.userInfo.authority).product
    : {},
}))(Product);
