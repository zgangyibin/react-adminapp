import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect, Fragment } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import api, { staticUrl } from "../../api/api";
import Prototype from "prop-types";

function MyEditor({ handleChangeEditor, htmlContent }) {
  // editor 实例
  const [editor, setEditor] = useState(null); // JS 语法
  useEffect(
    function () {
      setHtml(htmlContent);
    },
    [htmlContent] //根据传入的htmlContent属性变化，执行该useEffect
  );
  // 编辑器内容
  const [html, setHtml] = useState("");

  // 模拟 ajax 请求，异步设置 html
  // useEffect(() => {
  //   setTimeout(() => {
  //     setHtml("<p>hello world</p>");
  //   }, 1500);
  // }, []);

  // 工具栏配置
  const toolbarConfig = {}; // JS 语法

  // 编辑器配置
  const editorConfig = {
    // JS 语法
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        server: api.adddetailimg, //配置上传地址
        headers: {
          //header
          Authorization: sessionStorage.getItem("token"), //配置token
        },
        fieldName: "file",

        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 1 * 1024 * 1024, // 1M

        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 5,
        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ["image/*"],
        customInsert(res, insertFn) {
          // JS 语法
          // res 即服务端的返回结果

          // 从 res 中找到 url alt href ，然后插图图片
          const { url } = res.data;
          insertFn(`${staticUrl}/static/blogimg/${url}`, "", "");
        },
      },
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  //编辑内容改变触发的方法
  const onChange = (editor) => {
    let html = editor.getHtml();
    setHtml(html);
    handleChangeEditor(html); //子传父
  };

  return (
    <Fragment>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={onChange}
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
        />
      </div>
      {/* <div style={{ marginTop: "15px" }}>{html}</div>*/}
    </Fragment>
  );
}
// 组件的props属性类型校验
MyEditor.prototype = {
  handleChangeEditor: Prototype.func,
  htmlContent: Prototype.string,
};
// 设置组件的props属性默认值
MyEditor.defaultProps = {
  handleChangeEditor: () => "",
  htmlContent: "",
};

export default MyEditor;
