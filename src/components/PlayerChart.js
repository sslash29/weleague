"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function PlayerChart({ data = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Adjust values for display: scale all but defending to percentage
    const adjustedData = (data.length ? data : [7, 60, 9, 8, 5]).map(
      (val, i) => {
        if (i === 1) return val; // Defending stays raw
        return val > 10 ? 10 * 10 : val * 10; // scale to percentage
      }
    );

    const chartInstance = new Chart(canvasRef.current, {
      type: "radar",
      data: {
        labels: ["Shooting", "Defending", "Saving", "Playmaking", "Long Shots"],
        datasets: [
          {
            data: adjustedData,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgb(54, 162, 235)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          r: {
            beginAtZero: true,
            // Defending might be bigger than percentages, so pick the larger
            max: Math.max(100, adjustedData[1]),
            ticks: {
              stepSize: 10,
              display: false,
            },
            pointLabels: {
              font: { size: 14 },
              callback: function (label, index) {
                const value = this.chart.data.datasets[0].data[index];
                if (index === 1) {
                  // Defending raw
                  return `${label} ${value}`;
                }
                // Others as %
                return `${label} ${value}%`;
              },
            },
          },
        },
      },
    });

    return () => chartInstance.destroy();
  }, [data]);

  return <canvas ref={canvasRef} className="w-[400px] h-[400px]" />;
}

export default PlayerChart;
