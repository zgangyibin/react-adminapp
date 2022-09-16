import { message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import api, { staticUrl } from "../../api/api";
import { deldetailimg } from "../../api/otherService";
import Prototype from "prop-types";

const Uploading = ({ ImgChange, imgList }) => {
  const [fileList, setFileList] = useState([]);
  useEffect(
    function () {
      setFileList(
        imgList.map((url) => ({
          url: `${staticUrl}/static/blogimg/${url}`,
          name: url,
          status: "done",
        }))
      );
    },
    [imgList] //根据props传递来的imgList主图，在该组件显示对应的主图
  );
  // 上传中，上中，上传完成都会触发该事件
  const onChange = ({ file, fileList: newFileList }) => {
    let filesList = newFileList;
    if (file.response) {
      // 如果图片上传成功，把fileList里面图片url的base64格式替换为后端地址
      const { url } = file.response.data;
      filesList = fileList;
      filesList.at(-1).url = `${staticUrl}/apidoc/${url}`;
      filesList.at(-1).name = url;
      filesList.at(-1).status = "done";
      ImgChange(fileList.map((item) => item.name)); // 把子组件的最新文件列表传递到父组件。
    }
    setFileList(filesList);
  };
  // 预览图片
  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // 删除文件
  const onRemove = (file) => {
    const { name } = file;
    deldetailimg(
      {
        file: [name],
      },
      () => {
        message.info("删除成功");
      }
    );
  };

  return (
    <ImgCrop rotate aspect={234 / 166}>
      <Upload
        action={api.adddetailimg}
        headers={{ Authorization: sessionStorage.getItem("token") }}
        listType="picture-card"
        fileList={fileList}
        maxCount={1}
        name="file"
        onChange={onChange}
        onRemove={onRemove}
        onPreview={onPreview}
      >
        {fileList.length < 1 && "+ Upload"}
      </Upload>
    </ImgCrop>
  );
};
// 组件的props属性类型校验
Uploading.prototype = {
  ImgChange: Prototype.func,
  imgList: Prototype.Array,
};
// 设置组件的props属性默认值
Uploading.defaultProps = {
  ImgChange: () => "",
  imgList: [],
};
export default Uploading;
