import React from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Label
} from "reactstrap";
import { Enviroments } from "../../enviroments/enviroments";
import { calculateStatistics } from "../../helpers/statistics";
import moment from "moment";

function HistoryOdds({ props }) {
  const dateNow = moment(new Date()).format("YYYY-MM-DD");

  const defaultHistory = [
    {
      odd: 0,
      time: 10
    }
  ];

  const defaultHistory2 = [
    {
      odd: 2,
      time: 13
    }
  ];

  const [historyResultsAviator, setHistoryResultsAviator] = React.useState(
    defaultHistory
  );

  const [historyResultsAviator2, setHistoryResultsAviator2] = React.useState(
    defaultHistory2
  );

  const [historyOddActive, setHistoryOddActive] = React.useState([]);
  const [historyLoading, setHistoryLoading] = React.useState(true);
  const [numberVelas, setNumberVelas] = React.useState(10);
  const [isActiveOdd, setActiveOdd] = React.useState(false);
  const [median, setMedian] = React.useState(0);
  const [average, setAverage] = React.useState(0);
  const [stats, setStats] = React.useState({});

  const getBadgeClassName = value => {
    if (value < 2) {
      return "bg-info";
    } else if (value <= 9.99) {
      return "bg-purple";
    } else if (value >= 10) {
      return "bg-primary";
    }
  };

  React.useEffect(() => {
    setHistoryLoading(true);
    const interval = setInterval(async () => {
      const res = await getHistoryResultsAviator();
      setHistoryResultsAviator(res);

      const resMedian = calculateMedian(res);
      const resAverage = calculateAverage(res);
      const resStats = calculateStatistics(res);

      setStats(resStats);
      setMedian(resMedian);
      setAverage(resAverage);
      setHistoryLoading(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [numberVelas, props.betHouse]);

  const getHistoryResultsAviator = async () => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("apiToken")}`
        }
      };

      let betHouseCustom;

      if (props.betHouse === "BR4BET") {
        betHouseCustom = "MINES_BET";
      } else if (props.betHouse === "BR4BET2") {
        betHouseCustom = "BRAZUKA";
      } else {
        betHouseCustom = props.betHouse;
      }
      
      const response = await axios.get(
        `${Enviroments.API_URL_NODE}history-odd?date=${dateNow}&numberVelas=${numberVelas}&betHouse=${betHouseCustom}`,
        headers
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setHistoryLoading(false);
    }
  };

  const calculateAverage = numbers => {
    const sum = numbers.reduce((acc, { odd }) => acc + parseFloat(odd), 0);
    return sum / numbers.length;
  };

  const calculateMedian = numbers => {
    const sortedNumbers = [...numbers].sort(
      (a, b) => parseFloat(a.odd) - parseFloat(b.odd)
    );
    const middleIndex = Math.floor(sortedNumbers.length / 2);
    if (sortedNumbers.length % 2 === 0) {
      return (
        (parseFloat(sortedNumbers[middleIndex - 1].odd) +
          parseFloat(sortedNumbers[middleIndex].odd)) /
        2
      );
    } else {
      return parseFloat(sortedNumbers[middleIndex].odd);
    }
  };

  const handleToogleSearchOdds = e => {
    setActiveOdd(e);
  };

  const isEqualValuesKeys = odd => {
    const validOdds = new Set([
      "1.00",
      "2.00",
      "3.00",
      "9.99",
      "1.04",
      "1.66",
      "1.01",
      "1.11",
      "1.02",
      "1.03",
      "99",
      "9.99",
      "1.37",
      "3.04",
      "1.99",
      "1.88"
    ]);

    //return validOdds.has(odd) ? "2px solid #00FF7F" : "none";
    return historyOddActive.includes(odd) ? "2px solid #00FF7F" : "none";
  };

  const handleSetOddHistory = odd => {
    setHistoryOddActive(prevArray => {
      if (prevArray.includes(odd)) {
        return prevArray.filter(item => item !== odd);
      } else {
        return [...prevArray, odd];
      }
    });
  };

  return (
    <>
      <div className="history-odd">
        {historyLoading ? (
          <div className="d-flex justify-content-center align-items-center w-100">
            <div className="lds-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <>
            <Row>
              <Col xs="12">
                <Card className="card-chart">
                  <CardHeader>
                    <Row>
                      <Col className="text-left" sm="4">
                        <h5 className="card-category">
                          Histórico de velas do Aviator em Tempo Real
                        </h5>
                        <CardTitle tag="h3">Histórico de Velas</CardTitle>
                      </Col>
                      <Col
                        sm="2"
                        className="d-flex justify-content-start align-items-center"
                      >
                        <div class="form-floating">
                          Qde de velas
                          <select
                            id="floatingSelect"
                            className="form-control"
                            onChange={event =>
                              setNumberVelas(event.target.value)
                            }
                            value={numberVelas}
                          >
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                          </select>
                        </div>{" "}
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className="history-results row">
                      {historyResultsAviator?.map((item, i) => (
                        <div
                          className="vela-results"
                          key={item + i}
                          onClick={() => handleSetOddHistory(item.odd)}
                        >
                          <span
                            key={item.time}
                            className={`badge text-wrap p-2 ${getBadgeClassName(
                              item.odd
                            )}`}
                            style={{
                              border: `${isEqualValuesKeys(item.odd)}`,
                              color: "white",
                              backgroundColor:
                                getBadgeClassName(item.odd) === "bg-purple"
                                  ? "#5603ad"
                                  : ""
                            }}
                          >
                            {item.odd && item.odd}
                            <br />
                            {item.hour}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="2" lg="2" md="2">
                <Card className="card-chart">
                  <CardHeader>
                    <Row>
                      <Col sm="12">
                        <h5 className="card-category">
                          Filtrada por: {numberVelas} casas
                        </h5>
                        <Label>Mediana: </Label>
                        <CardTitle tag="h3">
                          {median.toFixed(2)}{" "}
                          <i
                            className={`tim-icons ${
                              median > 2
                                ? "icon-minimal-up text-success"
                                : "icon-minimal-down text-danger"
                            }`}
                          />
                        </CardTitle>
                      </Col>
                    </Row>
                  </CardHeader>
                </Card>
              </Col>
              <Col xs="6" sm="2" lg="2" md="2">
                <Card className="card-chart">
                  <CardHeader>
                    <Row>
                      <Col sm="12">
                        <h5 className="card-category">
                          Filtrada por: {numberVelas} casas
                        </h5>
                        <Label>Media: </Label>
                        <CardTitle tag="h3">
                          {average.toFixed(2)}{" "}
                          <i
                            className={`tim-icons ${
                              average > 2
                                ? "icon-minimal-up text-success"
                                : "icon-minimal-down text-danger"
                            }`}
                          />
                        </CardTitle>
                      </Col>
                    </Row>
                  </CardHeader>
                </Card>
              </Col>
              <Col xs="7" sm="2" lg="2" md="2">
                <Card className="card-chart">
                  <CardHeader>
                    <Row>
                      <Col sm="12">
                        <h5 className="card-category">
                          Filtrada por: {numberVelas} casas
                        </h5>
                        <Label>
                          Moda:
                          <span
                            style={{
                              border: "1px solid",
                              padding: 4,
                              marginLeft: 4,
                              borderRadius: 4
                            }}
                          >
                            novo
                          </span>
                        </Label>
                        <CardTitle tag="h3">
                          {stats && stats.mode !== undefined
                            ? Array.isArray(stats.mode)
                              ? stats.mode.join(", ")
                              : stats.mode
                            : "N/A"}{" "}
                          <i
                            className={`tim-icons ${
                              stats.mode > 2
                                ? "icon-minimal-up text-success"
                                : "icon-minimal-down text-danger"
                            }`}
                          />
                        </CardTitle>
                      </Col>
                    </Row>
                  </CardHeader>
                </Card>
              </Col>
              <Col xs="5" sm="2" lg="2" md="2">
                <Card className="card-chart">
                  <CardHeader>
                    <Row>
                      <Col sm="12">
                        <h5 className="card-category">
                          Filtrada por: {numberVelas}
                        </h5>
                        <Label>
                          Amplitude:
                          <span
                            style={{
                              border: "1px solid",
                              padding: 4,
                              marginLeft: 4,
                              borderRadius: 4
                            }}
                          >
                            novo
                          </span>
                        </Label>
                        <CardTitle tag="h3">
                          {stats && stats.range !== undefined
                            ? stats.range.toFixed(2)
                            : "N/A"}{" "}
                          <i
                            className={`tim-icons ${
                              stats.range > 2
                                ? "icon-minimal-up text-success"
                                : "icon-minimal-down text-danger"
                            }`}
                          />
                        </CardTitle>
                      </Col>
                    </Row>
                  </CardHeader>
                </Card>
              </Col>
              <Col xs="12" sm="2" lg="2" md="2">
                <Card className="card-chart">
                  <CardHeader>
                    <Row>
                      <Col sm="12">
                        <h5 className="card-category">
                          Filtrada por: {numberVelas} casas
                        </h5>
                        <Label>
                          Quartis:
                          <span
                            style={{
                              border: "1px solid",
                              padding: 4,
                              marginLeft: 4,
                              borderRadius: 4
                            }}
                          >
                            novo
                          </span>
                        </Label>
                        <CardTitle tag="h3">
                          {stats && stats.quartiles !== undefined
                            ? `Q1: ${stats.quartiles.q1.toFixed(
                                2
                              )}, Q2: ${stats.quartiles.q2.toFixed(
                                2
                              )}, Q3: ${stats.quartiles.q3.toFixed(2)}`
                            : "N/A"}
                        </CardTitle>
                      </Col>
                    </Row>
                  </CardHeader>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
}

export default HistoryOdds;
