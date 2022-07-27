import {
  MoneyCollectOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import * as echarts from "echarts";
import { Fragment, useEffect } from "react";
import { Card, Col, Row, Statistic } from "antd";
import "./index.scss";
import React from "react";
function Dashboard() {
  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 绘制图表
    const option = {
      title: {
        text: "订单数量",
        left: "50%",
      },
      xAxis: {
        type: "category",
        data: ["A", "B", "C"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150],
          type: "line",
        },
      ],
    };
    myChart.setOption(option);
  }, []);
  return (
    <Fragment>
      <div className="dashboard-content">
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="注册人数"
                value={11.28}
                precision={2}
                valueStyle={{
                  color: "#173f6f",
                }}
                prefix={<UserOutlined />}
                suffix="人"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="总销售额"
                value={9.3}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
                prefix={<MoneyCollectOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="在线商品"
                value={9.3}
                precision={2}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<AppstoreOutlined />}
                suffix="件"
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div id="main"></div>
    </Fragment>
  );
}

export default Dashboard;
