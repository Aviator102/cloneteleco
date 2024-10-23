import React from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Spinner
} from "reactstrap";
import { Enviroments } from "../../enviroments/enviroments";
import moment from "moment";

function HistoryHours({ props }) {
  const dateNow = moment(new Date()).format("YYYY-MM-DD");
  const [historyHourAviator, setHistoryHourAviator] = React.useState();
  const [historyHourAviator30, setHistoryHourAviator30] = React.useState();
  const [historyHourAviator100, setHistoryHourAviator100] = React.useState();
  const [numberVelas, setNumberVelas] = React.useState(10);
  const [loadingAviator, setLoadingAviator] = React.useState(true);
  const [loadingAviator30, setLoadingAviator30] = React.useState(true);
  const [loadingAviator100, setLoadingAviator100] = React.useState(true);

  React.useEffect(() => {
    const interval = setTimeout(async () => {
      setLoadingAviator(true);
      setLoadingAviator30(true);
      setLoadingAviator100(true);

      const res = await getHistoryHourAviator(10);
      const res2 = await getHistoryHourAviator(30);
      const res3 = await getHistoryHourAviator(100);

      setHistoryHourAviator(res);
      setHistoryHourAviator30(res2);
      setHistoryHourAviator100(res3);

      setLoadingAviator(false);
      setLoadingAviator30(false);
      setLoadingAviator100(false);
    }, 500);
    return () => clearInterval(interval);
  }, [numberVelas, props.betHouse]);

  const getHistoryHourAviator = async odd => {
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
        `${Enviroments.API_URL_NODE}candles-by-hour?date=${dateNow}&odd=${odd}&betHouse=${betHouseCustom}`,
        headers
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return (
    <div className="history-hours">
      <Row>
        <Col md={4}>
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Histórico de pague por horário</h5>
              <CardTitle tag="h4">Histórico de pague: 10X</CardTitle>
            </CardHeader>
            <CardBody className="body-hours p-3">
              {loadingAviator ? (
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
                historyHourAviator?.oddsByHour?.map((item, index) => (
                  <div className="d-flex justify-content-between" key={index}>
                    <CardTitle tag="h5" className="hour-item">
                      {item.hour}
                    </CardTitle>
                    <CardTitle tag="h5" className="hour-count">
                      {item.count}
                    </CardTitle>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Histórico de pague por horário</h5>
              <CardTitle tag="h4">Histórico de pague: 30X</CardTitle>
            </CardHeader>
            <CardBody className="body-hours p-3">
              {loadingAviator30 ? (
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
                historyHourAviator30?.oddsByHour?.map((item, index) => (
                  <div className="d-flex justify-content-between" key={index}>
                    <CardTitle tag="h5" className="hour-item">
                      {item.hour}
                    </CardTitle>
                    <CardTitle tag="h5" className="hour-count">
                      {item.count}
                    </CardTitle>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Histórico de pague por horário</h5>
              <CardTitle tag="h4">Histórico de pague: 100X</CardTitle>
            </CardHeader>
            <CardBody className="body-hours p-3">
              {loadingAviator100 ? (
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
                historyHourAviator100?.oddsByHour?.map((item, index) => (
                  <div className="d-flex justify-content-between" key={index}>
                    <CardTitle tag="h5" className="hour-item">
                      {item.hour}
                    </CardTitle>
                    <CardTitle tag="h5" className="hour-count">
                      {item.count}
                    </CardTitle>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HistoryHours;
