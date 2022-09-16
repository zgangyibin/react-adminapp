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
import { deldetailimg } from "../../api/otherService";
import Uploading from "../../components/uploading";
import WangEditor from "../../components/wangEditor";
import React from "react";
const { Option } = Select;
const typeList = [
  { type: "技术博客", id: 0 },
  { type: "经验分享", id: 1 },
  { type: "随笔", id: 2 },
];
const initState = {
  proData: [],
  page: 1,
  pageSize: 10,
  total: 0,
  visible: false,
  selectProData: {}, //选中编辑的博客
  proType: {}, //博客分类数据
  mainId: "", //选择的主分类
  imgList: [], //博客主图列表
  html: "", //富文本编辑器编辑内容
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
  //添加产品
  const onFinish = (values) => {
    console.log(state.imgList);
    console.log(state.html);
    console.log(values);
    if (state.imgList.length === 0) {
      return message.error("至少上传一张封面图");
    }
    if (state.html.length < 10) {
      return message.error("至少添加十个字符的文本内容");
    }
    if (state.type === "add") {
      //添加博客
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
  useEffect(
    function () {
      init();
    },
    [state.page, state.key]
  );
  const init = () => {
    getPro({ page: state.page, key: state.key, orderbytype: "id" }, (res) => {
      dispatch({ proData: res.data, total: res.count });
    });
  };
  //隐藏弹窗
  const handleonCancel = () => {
    dispatch({ visible: false });
  };
  //编辑
  const handleEdit = (row) => {
    getDetail({ id: row.id }, (res) => {
      //博客详情需要调用接口返回
      dispatch({ html: res.content });
    });
    // 设置state的imgList，把主图传入uploading组件
    dispatch({
      type: "edit",
      visible: true,
      imgList: row.img.split(","),
      html: "",
      selectProData: { id: row.id },
    });
    form.setFieldsValue({
      ...row,
    });
  };
  //切换页码
  const handlePageChange = (page) => {
    dispatch({ page });
  };
  //添加博客弹窗打开
  const handleAddPro = () => {
    // 设置form表单的值
    form.setFieldsValue({
      title: "",
      keywords: "",
      description: "",
      content: "",
      showBlog: 1,
      blogType: "技术博客",
    });
    dispatch({
      visible: true,
      selectProData: {},
      type: "add",
      imgList: [],
      html: "",
    });
  };
  // 删除博客
  const handleDel = (row) => {
    // 删除博客之前需要删除该博客的所有图片,主图和详情图
    let imgArr = row.img.split(",");
    getDetail({ id: row.id }, (res) => {
      //博客详情需要调用接口返回
      const { detail } = res.content;
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
      title: "封面图",
      dataIndex: "cover",
      render(text) {
        return (
          <Image
            preview={false}
            src={`${staticUrl}/static//blogimg/${text}`}
            style={{ width: 50 }}
          />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "关键词",
      dataIndex: "keywords",
    },
    {
      title: "作者",
      dataIndex: "nick",
    },
    {
      title: "阅读量",
      dataIndex: "readCount",
    },
    {
      title: "分类",
      dataIndex: "blogType",
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
        <Button onClick={handleAddPro}>添加博客</Button>
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
        title={state.type === "add" ? "添加博客" : "修改博客信息"}
        visible={state.visible}
        footer={false}
        width={800}
      >
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="博客标题"
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
            label="关键词"
            name="keywords"
            rules={[
              {
                required: true,
                message: "Please input keywords!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="文章简介"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input description",
              },
            ]}
          >
            <Input.TextArea placeholder="文章简介" />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="文章显示"
            name="showBlog"
            rules={[
              {
                required: true,
                message: "Please select!",
              },
            ]}
          >
            <Select>
              <Option value={1}>显示文章</Option>
              <Option value={0}>隐藏文章</Option>
            </Select>
          </Form.Item>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="分类"
            name="blogType"
            rules={[
              {
                required: true,
                message: "Please select!",
              },
            ]}
          >
            <Select>
              {typeList.map((item) => (
                <Option key={item.id} value={item.type}>
                  {item.type}
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

export default Product;
