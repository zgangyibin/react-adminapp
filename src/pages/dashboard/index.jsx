import {
  MoneyCollectOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import * as echarts from "echarts";
import { Fragment, useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { getDashboardData } from "../../api/otherService";
import "./index.scss";
import React from "react";
import { formatDate } from "../../utils/tool";
// Fragment不会渲染组件，只做jsx根组件使用

function Dashboard() {
  const [data, setData] = useState({});
  const [echartData, setEchartData] = useState("");
  const [myChart, setMyChart] = useState("");
  useEffect(() => {
    if (!myChart) {
      //需要判断myChart实例是否存在，如果不存在才初始化
      // 基于准备好的dom，初始化echarts实例
      setMyChart(echarts.init(document.getElementById("main")));
    }
    getDashboardData(function (res) {
      console.log(res);
      const chartData = res.data[2];
      var chartMap = {};
      chartData.forEach(function (o) {
        let date = o.createTime.slice(0, 10);
        if (!chartMap[date]) {
          chartMap[date] = 1;
        } else {
          chartMap[date]++;
        }
      });
      // console.log(chartMap);
      setEchartData(chartMap); //echart数据
      setData({
        userCount: res.data[1][0].total,
        money: res.data[0][0].total,
      });
    });
  }, []); //模拟mounted
  useEffect(() => {
    if (!echartData) return;

    // 绘制图表
    const option = {
      title: {
        text: "博客数量",
        left: "45%",
      },
      xAxis: {
        type: "category",
        data: Object.keys(echartData),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: Object.keys(echartData).map((item) => echartData[item]),
          type: "line",
        },
      ],
      label: {
        show: true,
        position: "bottom",
        textStyle: {
          fontSize: 20,
        },
      },
    };
    myChart.setOption(option);
  }, [echartData]); //echartData变化才触发
  return (
    <Fragment>
      <div className="dashboard-content">
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="注册人数"
                value={data.userCount}
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
                title="博客数量"
                value={data.money}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
                prefix={<MoneyCollectOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div id="main" className="dashboard-echart"></div>
    </Fragment>
  );
}

export default Dashboard;
