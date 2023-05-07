import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import ApexCharts from "apexcharts";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";

// import logo from './mainlogo2.png';

function LatencyPredictor() {
  const [formValues, setFormValues] = useState({
    latencyConcurrency: "",
    errorPercentageConcurrency: "",
    errorPercentageRateLimit: "",
    tradeoffConcurrency: "",
    tradeoffRateLimit: "",
  }); // state to hold form values
  const [predictions, setPredictions] = useState([]); // state to hold predictions
  const [predictions1, setPredictions1] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // state to hold loading status

  const handleInputChange = (e) => {
    if (/^\d*$/.test(e.target.value)) {
      setFormValues({ ...formValues, [e.target.name]: e.target.value });
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter only numbers");
    }
  };

  const handlePredict3 = async (e) => {
    e.preventDefault();
    if (
      errorMessage ||
      !formValues["tradeoffConcurrency"] ||
      !formValues["tradeoffRateLimit"]
    ) {
      setErrorMessage("Please enter both values");
      return;
    }

    // Set the loading state
    setLoading(true);

    const response = await axios.post("/predict3", {
      concurrency: formValues["tradeoffConcurrency"],
      rateLimit: formValues["tradeoffRateLimit"],
    });

    const firstPrediction = response.data.output.response.map((row) => [
      row[0],
      row[1],
    ]);
    const secondPrediction = response.data.output.response.map((row) => [
      row[0],
      row[2],
    ]);
    setTimeout(() => {
      setPredictions(firstPrediction); // update predictions state with response from Flask endpoint
      setPredictions1(secondPrediction);
      setLoading(false);
    }, 1000);
  };

  const chartRef = useRef(null);

  useEffect(() => {
    const chart1 = new ApexCharts(chartRef.current, {
      chart: {
        type: "line",
        height: 500,
      },
      theme: {
        palette: "palette5",
      },
      series: [
        {
          name: "Latency",
          data: predictions,
        },
        {
          name: "Error percentage",
          data: predictions1,
          yaxis: 1, // associate the series with the second Y-axis
        },
      ],
      yaxis: [
        {
          title: {
            text: "Latency (ms)",
            style: {
              fontSize: "14px",
            },
          },
        },
        {
          opposite: true,
          title: {
            text: "Error percentage",
            style: {
              fontSize: "14px",
            },
          },
        },
      ],
      xaxis: {
        title: {
          text: "Timeout (ms)",
          style: {
            fontSize: "14px",
          },
        },
        tickAmount: 10,
        min: 1,
        max: 150,
      },
      grid: {
        show: true,
      },
    });
    chart1.render();

    return () => chart1.destroy();
  }, [predictions, predictions1]);

  const clearForm = () => {
    setFormValues({
      latencyConcurrency: "",
      errorPercentageConcurrency: "",
      errorPercentageRateLimit: "",
      tradeoffConcurrency: "",
      tradeoffRateLimit: "",
    });
    setPredictions([]);
    setPredictions1([]);
    setErrorMessage("");
  };

  const handleDownload = () => {
    html2canvas(chartRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="container-fluid">
      <div className="container">
        {/* <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <Link to="/" className="text-primary">
                Home
              </Link>
            </li>
          </ol>
        </nav> */}
        <nav class="navbar bg-body-tertiary px-0">
          <div class="container-fluid px-0">
            <Link
              to="/"
              className="border border-5 navbar-brand text-primary fs-5 btn btn-light"
            >
              <i className="m-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  fill="currentColor"
                  className="bi bi-house"
                  viewBox="1 1 16 16"
                >
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
              </i>
              Home
            </Link>
          </div>
        </nav>

        <div className="row w-100">
          <p className="display-4 pb-0 mb-0 text-center">
            {/* <img className="d-inline-block" src={logo} alt="logo" width={100} /> */}
            Gateway Guru
          </p>
          <p className="display-5 pt-0 mt-0 text-muted text-center">
            Smarter API Rate Limiting
          </p>
        </div>
      </div>

      <div className="container-fluid bg-light py-4 rounded">
        <div className="container py-4">
          <div className="row mb-4">
            <p className="fs-2 fw-normal">
              Error Percentage - Latency Trade-off Predictor
            </p>
          </div>

          <div className="row">
            <form
              className="row gy-2 gx-3 px-3 align-items-center"
              onSubmit={handlePredict3}
              onReset={clearForm}
            >
              <div className="col-auto row mt-2">
                <label
                  htmlFor="tradeoffConcurrency"
                  className="col-auto col-form-label"
                >
                  Concurrency
                </label>
                <input
                  type="text"
                  className="col form-control"
                  id="tradeoffConcurrency"
                  name="tradeoffConcurrency"
                  onChange={handleInputChange}
                  value={formValues["tradeoffConcurrency"]}
                  required
                  // placeholder="Concurrency"
                />
              </div>

              <div className="col-auto row mt-2">
                <label
                  htmlFor="tradeoffRateLimit"
                  className="col-auto col-form-label"
                >
                  Rate Limit (Req/min)
                </label>
                <input
                  type="text"
                  className="col form-control"
                  id="tradeoffRateLimit"
                  name="tradeoffRateLimit"
                  onChange={handleInputChange}
                  value={formValues["tradeoffRateLimit"]}
                  required
                  // placeholder="Rate Limit (Req/min)"
                />
              </div>

              <div className="col-auto mt-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {/* {loading ? "Predicting trade-off forecast..." : "Predict"} */}
                  {loading ? (
                    <span
                      class="spinner-border spinner-border-sm mr-2"
                      role="loading"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <span></span>
                  )}
                  Predict
                </button>
              </div>

              <div className="col-auto mt-2">
                <button type="reset" className="btn btn-secondary">
                  Clear
                </button>
              </div>
            </form>
            {errorMessage && (
              <div className="mx-3 my-3 alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
          <div className="row py-4 my-2">
            <div className="graph" ref={chartRef} />
            <div className="col-10"></div>
            <button
              type="button"
              className="col-2 btn btn-primary btn-download"
              onClick={handleDownload}
            >
              <i className="m-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-download"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
              </i>
              Download Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatencyPredictor;
