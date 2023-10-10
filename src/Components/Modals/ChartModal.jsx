import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

import html2canvas from "html2canvas";
import annotationplugin from "chartjs-plugin-annotation";

Chart.register(annotationplugin);
Chart.register(...registerables);

const LineChartModal = ({
  data,
  showModal,
  closeModal,
  nombre,
  year,
  month,
  goalData,
}) => {
  const chartRef = useRef(null);
  const [hiddenButton, setHiddenButton] = useState(false);
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        type: "bar",
        label: "Total facturado",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#5cb8b2",
        borderColor: "#5cb8b2",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.values(data),
      },
      {
        type: "bar",
        label: "Metas de venta",
        lineTension: 0.1,
        backgroundColor: "#6a4593",
        borderColor: "#6a4593",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.values(goalData),
        yAxisID: "y",
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "category", // Specify the x-axis as a category scale
        title: {
          display: true,
          text: "Fecha", // Label for the x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: "Total", // Label for the y-axis
        },
      },
    },
  };

  const handleDownload = () => {
    setHiddenButton(true);
    const modalContentElement = chartRef.current;

    if (modalContentElement) {
      html2canvas(modalContentElement)
        .then(function (canvas) {
          const imageBlob = canvas.toDataURL("image/png");

          // Create a temporary link element
          const a = document.createElement("a");
          a.href = imageBlob;
          a.download = `Ventas de ${nombre} en ${month} de ${year}`;

          // Trigger a click event on the link element to start the download
          a.click();
        })
        .catch(function (error) {
          console.error("Error creating image:", error);
        });
    } else {
      console.error("Modal content not found");
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="xl">
      <div ref={chartRef}>
        <Modal.Body>
          <Modal.Header closeButton>
            <Modal.Title>
              {`Total ventas diarias de ${nombre} en ${month} de ${year}`}{" "}
            </Modal.Title>
          </Modal.Header>
          <Bar data={chartData} options={chartOptions} />
        </Modal.Body>
      </div>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={handleDownload}
          hidden={hiddenButton}
        >
          Descargar como imagen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LineChartModal;

/*
 plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: 2500,
            yMax: 2500,
            borderColor: "#eead1a",
            borderWidth: 2,
          },
          label1: {
            type: "label",
            yValue: 2700,

            content: ["Meta de ventas"],
            color: "#6a4593",
            font: {
              size: 12,
            },
          },
        },
      },
    },
    */
