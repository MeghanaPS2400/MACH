import React, { useLayoutEffect,useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useSelector } from "react-redux";
import Comparison1 from "./Comparison1";
import Comparison2 from "./Comparison2";
import Layout from "../others/Layout";
import "../styles/comparision.css";

const ComparisonAnalysis = () => {
  const { users1} = useSelector((state) => state.comparison.comparison1);
  const { users2 } = useSelector((state) => state.comparison.comparison2);

  const plotGraph=()=>{// Create root element
    const root = am5.Root.new("chartdiv");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    root.container.set("layout", root.verticalLayout);

    // Create container to hold charts
    const chartContainer = root.container.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        width: am5.percent(100),
        height: am5.percent(100),
      })
    );

    const averageRatings1 = users1.reduce((acc, user) => {
      Object.keys(user.skills).forEach((skill) => {
        if (!acc[skill]) {
          acc[skill] = { total: 0, count: 0 };
        }
        acc[skill].total += user.skills[skill];
        acc[skill].count += 1;
      });
      return acc;
    }, {});

    const chartData1 = Object.keys(averageRatings1).map((skill) => ({
      category: skill,
      value: averageRatings1[skill].total / averageRatings1[skill].count,
    }));

    const averageRatings2 = users2.reduce((acc, user) => {
      Object.keys(user.skills).forEach((skill) => {
        if (!acc[skill]) {
          acc[skill] = { total: 0, count: 0 };
        }
        acc[skill].total += user.skills[skill];
        acc[skill].count += 1;
      });
      return acc;
    }, {});

    const chartData2 = Object.keys(averageRatings2).map((skill) => ({
      category: skill,
      value: averageRatings2[skill].total / averageRatings2[skill].count,
    }));

    // Create the 1st chart
    const chart = chartContainer.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270,
        innerRadius: am5.percent(60),
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270,
        alignLabels: false,
      })
    );

    series.children.push(
      am5.Label.new(root, {
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        text: "Comparison 1",
        populateText: true,
        fontSize: "1.5em",
      })
    );

    series.slices.template.setAll({
      cornerRadius: 8,
    });

    series.labels.template.setAll({
      visible: false,
    });

    series.states.create("hidden", {
      endAngle: -90,
    });

    series.slices.template.set("tooltipText", "{category}: {value}");

    // Create the 2nd chart
    const chart2 = chartContainer.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270,
        innerRadius: am5.percent(60),
      })
    );

    const series2 = chart2.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270,
        alignLabels: false,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    series2.children.push(
      am5.Label.new(root, {
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        text: "Comparison 2",
        populateText: true,
        fontSize: "1.5em",
      })
    );

    series2.slices.template.setAll({
      cornerRadius: 8,
    });

    series2.labels.template.setAll({
      visible: false,
    });

    series2.states.create("hidden", {
      endAngle: -90,
    });

    series2.slices.template.set("tooltipText", "{category}: {value}");

    // Duplicate interaction
    series.slices.template.events.on("pointerover", function (ev) {
      const slice = ev.target;
      const dataItem = slice.dataItem;
      const otherSlice = getSlice(dataItem, series2);

      if (otherSlice) {
        otherSlice.hover();
      }
    });

    series.slices.template.events.on("pointerout", function (ev) {
      const slice = ev.target;
      const dataItem = slice.dataItem;
      const otherSlice = getSlice(dataItem, series2);

      if (otherSlice) {
        otherSlice.unhover();
      }
    });

    series.slices.template.on("active", function (active, target) {
      const slice = target;
      const dataItem = slice.dataItem;
      const otherSlice = getSlice(dataItem, series2);

      if (otherSlice) {
        otherSlice.set("active", active);
      }
    });

    // Same for the 2nd series
    series2.slices.template.events.on("pointerover", function (ev) {
      const slice = ev.target;
      const dataItem = slice.dataItem;
      const otherSlice = getSlice(dataItem, series);

      if (otherSlice) {
        otherSlice.hover();
      }
    });

    series2.slices.template.events.on("pointerout", function (ev) {
      const slice = ev.target;
      const dataItem = slice.dataItem;
      const otherSlice = getSlice(dataItem, series);

      if (otherSlice) {
        otherSlice.unhover();
      }
    });

    series2.slices.template.on("active", function (active, target) {
      const slice = target;
      const dataItem = slice.dataItem;
      const otherSlice = getSlice(dataItem, series);

      if (otherSlice) {
        otherSlice.set("active", active);
      }
    });

    // Set data
    series.data.setAll(chartData1);

    // Set data
    series2.data.setAll(chartData2);

    function getSlice(dataItem, series) {
      let otherSlice;
      am5.array.each(series.dataItems, function (di) {
        if (di.get("category") === dataItem.get("category")) {
          otherSlice = di.get("slice");
        }
      });

      return otherSlice;
    }

    // Create legend
    const legend = root.container.children.push(
      am5.Legend.new(root, {
        x: am5.percent(50),
        centerX: am5.percent(50),
      })
    );

    // Trigger all the same for the 2nd series
    legend.itemContainers.template.events.on("pointerover", function (ev) {
      const dataItem = ev.target.dataItem.dataContext;
      const slice = getSlice(dataItem, series2);
      slice.hover();
    });

    legend.itemContainers.template.events.on("pointerout", function (ev) {
      const dataItem = ev.target.dataItem.dataContext;
      const slice = getSlice(dataItem, series2);
      slice.unhover();
    });

    legend.itemContainers.template.on("disabled", function (disabled, target) {
      const dataItem = target.dataItem.dataContext;
      const slice = getSlice(dataItem, series2);
      if (disabled) {
        series2.hideDataItem(slice.dataItem);
      } else {
        series2.showDataItem(slice.dataItem);
      }
    });

    legend.data.setAll(series.dataItems);

    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }
  useEffect(plotGraph
    , [users1, users2]);

  return (
    <>
      <Layout/>
      <div class="comparison">
        <Comparison1 />
        <Comparison2 />
        <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
      </div>
    </>
  );
};

export default ComparisonAnalysis;
