import {
  Chart,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";
import "hammerjs";
import { getAllGaugeData } from "../Api/Api.js";
import { Button } from "@progress/kendo-react-buttons";
import React, { useState, Fragment, useEffect } from "react";

function CustomChart(prop) {
  //   const seriesData = [20, 40, 45, 30, 50, 80, 34];
  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [seriesData, setSeriesData] = useState([20, 40, 45, 30, 50, 80, 34]);

  useEffect(() => {}, [seriesData]);

  const monday = [];
  const tuesday = [];
  const wednesday = [];
  const thursday = [];
  const friday = [];
  const saturday = [];
  const sunday = [];

  const gaugeData = [
    {
      data: 0,
      date: "",
    },
  ];

  const buttonClickHandler = async () => {
    var response = await getAllGaugeData();
    response.data.forEach((item) => {
      const { data, date } = item; // Extracting only 'data' and 'date' properties
      gaugeData.push({ data, date });
    });

    gaugeData.forEach((data) => {
      const dateObject = new Date(data.date);
      var dayIndex = dateObject.getDay();
      populateChartData(dayIndex, data.data);
    });

    updateChart();
  };

  function updateChart() {
    var mondayAvg = calculateAvg(monday);
    var tuesdayAvg = calculateAvg(tuesday);
    var wednesdayAvg = calculateAvg(wednesday);
    var thursdayAvg = calculateAvg(thursday);
    var fridayAvg = calculateAvg(friday);
    var saturdayAvg = calculateAvg(saturday);
    var sundayAvg = calculateAvg(sunday);

    const dummyArray = [
      mondayAvg,
      tuesdayAvg,
      wednesdayAvg,
      thursdayAvg,
      fridayAvg,
      saturdayAvg,
      sundayAvg,
    ];
    setSeriesData(dummyArray);
  }

  function populateChartData(dayIndex, data) {
    console.log(dayIndex);
    if (dayIndex === 0) monday.push(data);
    else if (dayIndex === 1) tuesday.push(data);
    else if (dayIndex === 2) wednesday.push(data);
    else if (dayIndex === 3) thursday.push(data);
    else if (dayIndex === 4) friday.push(data);
    else if (dayIndex === 5) saturday.push(data);
    else if (dayIndex === 6) sunday.push(data);
  }

  function calculateAvg(arr) {
    var sum = 0;
    arr.forEach((data) => {
      sum += data;
    });
    return sum / arr.length;
  }

  return (
    <div>
      <Chart>
        <ChartCategoryAxis>
          <ChartCategoryAxisItem categories={categories} />
        </ChartCategoryAxis>
        <ChartSeries>
          <ChartSeriesItem data={seriesData} />
        </ChartSeries>
      </Chart>
      <Button onClick={buttonClickHandler}>Refresh</Button>
    </div>
  );
}
export default CustomChart;
