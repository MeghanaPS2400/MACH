import React, { useEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const HeatMap = ({ users }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      let root = am5.Root.new(chartRef.current);

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "none",
          wheelY: "none",
          paddingLeft: 0,
          paddingRight: 0,
          layout: root.verticalLayout
        })
      );

      let yRenderer = am5xy.AxisRendererY.new(root, {
        visible: false,
        minGridDistance: 20,
        inversed: true,
        minorGridEnabled: true
      });

      yRenderer.grid.template.set("visible", false);

      let yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: yRenderer,
          categoryField: "y"
        })
      );

      let xRenderer = am5xy.AxisRendererX.new(root, {
        visible: false,
        minGridDistance: 30,
        inversed: true,
        minorGridEnabled: true
      });

      xRenderer.grid.template.set("visible", false);

      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: xRenderer,
          categoryField: "x"
        })
      );

      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          calculateAggregates: true,
          stroke: am5.color(0xffffff),
          clustered: false,
          xAxis: xAxis,
          yAxis: yAxis,
          categoryXField: "x",
          categoryYField: "y",
          valueField: "value"
        })
      );

      series.columns.template.setAll({
        tooltipText: "{value}",
        strokeOpacity: 1,
        strokeWidth: 2,
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
        cornerRadiusBL: 5,
        cornerRadiusBR: 5,
        width: am5.percent(100),
        height: am5.percent(100),
        templateField: "columnSettings"
      });

      let circleTemplate = am5.Template.new({});

      series.set("heatRules", [{
        target: circleTemplate,
        min: 10,
        max: 35,
        dataField: "value",
        key: "radius"
      }]);

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(
            root,
            {
              fill: am5.color(0x000000),
              fillOpacity: 0.5,
              strokeOpacity: 0
            },
            circleTemplate
          )
        });
      });

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            fill: am5.color(0xffffff),
            populateText: true,
            centerX: am5.p50,
            centerY: am5.p50,
            fontSize: 10,
            text: "{value}"
          })
        });
      });

      const skillSet = new Set();
      users.forEach(user => {
        Object.keys(user.skills).forEach(skill => {
          skillSet.add(skill);
        });
      });

      const skillsArray = Array.from(skillSet);

      const data = [];
      for (let i = 1; i <= 5; i++) {
        skillsArray.forEach(skill => {
          const count = users.filter(user => user.skills[skill] === i).length;
          data.push({ x: skill, y: i.toString(), value: count });
        });
      }

      series.data.setAll(data);

      yAxis.data.setAll([
        { y: "5" },
        { y: "4" },
        { y: "3" },
        { y: "2" },
        { y: "1" }
      ]);

      xAxis.data.setAll(skillsArray.map(skill => ({ x: skill })));

      chart.appear(1000, 100);

      return () => {
        root.dispose();
      };
    }
  }, [users]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>;
};

export default HeatMap;
