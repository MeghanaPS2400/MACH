import React, { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useSelector } from "react-redux";
import Comparison1 from "./Comparison1";
import Comparison2 from "./Comparison2";
import RadarChart from "./comparisonRadar";
import Layout from "../others/Layout";
import "../styles/comparision.css";
import GaugeChart from 'react-gauge-chart';

const ComparisonAnalysis = () => {
  const { users1 } = useSelector((state) => state.comparison.comparison1);
  const { users2 } = useSelector((state) => state.comparison.comparison2);

  const [overallAverage1, setOverallAverage1] = useState(0);
  const [overallAverage2, setOverallAverage2] = useState(0);
  const [teamMemberCounts1, setTeamMemberCounts1] = useState({});
  const [teamMemberCounts2, setTeamMemberCounts2] = useState({});
  const [totalUniqueSkills1, setTotalUniqueSkills1] = useState(0);
  const [totalUniqueSkills2, setTotalUniqueSkills2] = useState(0);

  const chartStyle = {
    height: 250,
  }

  useEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);
    root.container.set("layout", root.verticalLayout);

    const chartContainer = root.container.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        width: am5.percent(100),
        height: am5.percent(100),
      })
    );

    const calculateAverageRatings = (users) => {
      const uniqueSkills = new Set();

      const averageRatings = users.reduce((acc, user) => {
        Object.keys(user.skills).forEach((skill) => {
          uniqueSkills.add(skill); // Track unique skills
          if (!acc[skill]) {
            acc[skill] = { total: 0, count: 0 };
          }
          acc[skill].total += user.skills[skill];
          acc[skill].count += 1;
        });
        return acc;
      }, {});

      const totalUniqueSkills = uniqueSkills.size;

      const teamMemberCounts = users.reduce((counts, user) => {
        const designation = user.designation;
        counts[designation] = (counts[designation] || 0) + 1;
        return counts;
      }, {});

      const chartData = Object.keys(averageRatings).map((skill) => ({
        category: skill,
        value: averageRatings[skill].total / averageRatings[skill].count,
      }));

      const overallAverage =
        Object.values(averageRatings).reduce(
          (acc, { total, count }) => acc + total / count,
          0
        ) / Object.keys(averageRatings).length;

      return { chartData, overallAverage, totalUniqueSkills, teamMemberCounts };
    };

    const { chartData: chartData1, overallAverage: avg1, totalUniqueSkills: skills1, teamMemberCounts: counts1 } = calculateAverageRatings(users1);
    const { chartData: chartData2, overallAverage: avg2, totalUniqueSkills: skills2, teamMemberCounts: counts2 } = calculateAverageRatings(users2);

    setOverallAverage1(avg1);
    setOverallAverage2(avg2);
    setTotalUniqueSkills1(skills1); // Using totalUniqueSkills from users1
    setTotalUniqueSkills2(skills2); // Using totalUniqueSkills from users2
    setTeamMemberCounts1(counts1); // Using counts from users1
    setTeamMemberCounts2(counts2); // Using counts from users2

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
        text: totalUniqueSkills1,
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

    root.container.children.push(
      am5.Label.new(root, {
        text: `Overall Average: ${avg1.toFixed(2)}`,
        x: am5.percent(25),
        centerX: am5.percent(50),
        y: am5.percent(10),
        populateText: true,
        fontSize: "1.2em",
      })
    );

    root.container.children.push(
      am5.Label.new(root, {
        text: `Overall Average: ${avg2.toFixed(2)}`,
        x: am5.percent(75),
        centerX: am5.percent(50),
        y: am5.percent(10),
        populateText: true,
        fontSize: "1.2em",
      })
    );

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

    series.data.setAll(chartData1);
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

    return () => {
      root.dispose();
    };
  }, [users1, users2]);

  const highestAverage = Math.max(overallAverage1, overallAverage2);
  const percent = highestAverage / 5; // Assuming 5 is the maximum possible rating

  return (
    <>
      <Layout />
      <div className="comparison-container">
        <div className="comparison">
          <div><Comparison1 /></div>
          <div><Comparison2 /></div>
          <div id="chartdiv" style={{ flex: 1 }}></div>
        </div>
        <div className="gauge-container">
          <GaugeChart
            id="gauge-chart5"
            style={chartStyle}
            nrOfLevels={420}
            arcsLength={[0.5, 0.5]}
            colors={['#5BE12C', '#F5CD19']}
            percent={overallAverage1 > overallAverage2 ? 0.3 : 0.8}
            arcPadding={0.02}
          />
        </div>
        <div className="team-members">
          <div className="team-members1">
            {Object.keys(teamMemberCounts1).map((designation, index) => (
              <div key={`team1-${index}`}>
                {`${designation}: ${teamMemberCounts1[designation]}`}
              </div>
            ))}
          </div>
          <div className="team-members2">
            {Object.keys(teamMemberCounts2).map((designation, index) => (
              <div key={`team2-${index}`}>
                {`${designation}: ${teamMemberCounts2[designation]}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComparisonAnalysis;
