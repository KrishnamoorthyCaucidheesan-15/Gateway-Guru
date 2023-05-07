import React from "react";
import { Link } from "react-router-dom";

// import logo from './mainlogo2.png';

function Home() {
  return (
    <div className="container-fluid px-0 h-100">
      <div className="row w-100">
        <p className="display-2 pb-0 mb-0 text-center">
          {/* <img className="d-inline-block" src={logo} alt="logo" width={100} /> */}
          Gateway Guru
        </p>
        <p className="display-5 pt-0 mt-0 text-muted text-center">
          Smarter API Rate Limiting
        </p>
      </div>
      <div className="bg-dark rounded pb-2">
        <div className="container">
          <div className="container-fluid p-4 m-4">
            <div className="row px-4">
              <p className="lead fs-4 pt-3 text-white fw-normal">
                What is Error percentage - Latency Trade-off in Rate limiting
                service on API Gateways?
              </p>
              <ul
                className="fs-6 text-light"
                style={{ listStylePosition: "outside", paddingLeft: "40px" }}
              >
                <li style={{ marginBottom: "10px" }}>
                  Rate limiting service in API gateways is a feature helps to
                  prevent excessive traffic and ensures that the API can handle
                  requests without being overloaded.
                </li>
                <li style={{ marginBottom: "10px" }}>
                  Error percentage is the percentage of requests that is
                  excessicely sent than the limit allocated.
                </li>
                <li style={{ marginBottom: "10px" }}>
                  Latency is the round trip time for API requests.
                </li>
                <li>
                  The error percentage - latency tradeoff in rate limiting
                  service on API gateways refers to the balance between the
                  level of error rate and the latency.
                </li>
              </ul>
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4 my-1 px-4">
              <div className="col">
                <div className="card h-100 p-4">
                  <div className="card-body">
                    <h5 className="card-title">Error Percentage Predictor</h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                      Predict error percentage
                    </h6>
                    <p class="card-text">
                      See the Error percentage forecast by inserting Concurrency
                      and Rate limit
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <Link
                      className="btn btn-primary px-4 w-100"
                      to="error-percentage-predictor"
                    >
                      Predict
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100 p-4">
                  <div className="card-body">
                    <h5 className="card-title">Latency Predictor</h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                      Predict latency
                    </h6>
                    <p class="card-text">
                      See the Latency forecast by inserting Concurrency
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <Link
                      className="btn btn-primary px-4 w-100"
                      to="latency-predictor"
                    >
                      Predict
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100 p-4">
                  <div className="card-body">
                    <h5 className="card-title">Trade-off Predictor</h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                      Predict trade-offs
                    </h6>
                    <p class="card-text">
                      See the trade-off between error percentage and latency and
                      identify the combination of suitable parameters
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <Link
                      className="btn btn-success px-4 w-100"
                      to="trade-off-predictor"
                    >
                      Predict
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
