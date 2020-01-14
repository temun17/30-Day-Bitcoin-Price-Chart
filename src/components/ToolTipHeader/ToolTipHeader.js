import React from "react";

import "./ToolTipHeader.css";

const priceErrorHandling = ({ userInput, data }, price) => {
  try {
    return (price = userInput[0].price.toLocaleString("us-EN", {
      style: "currency",
      currency: "USD"
    }));
  } catch (error) {
    return (price = `$0.00`.toLocaleString("us-EN", {
      style: "currency",
      currency: "USD"
    }));
  }
};

const dateErrorHandling = ({ userInput, data }, date) => {
  try {
    return (date = userInput[0].date);
  } catch (error) {
    date = data[0].date;
  }
};

const ToolTipHeader = props => {
  return (
    <div id="data-container">
      {true ? (
        <div id="left" className="box">
          <div className="heading">{priceErrorHandling(props)}</div>
          <div className="subtext">
            {"BTC (USD)"}
            <br />
            {dateErrorHandling(props)}
          </div>
        </div>
      ) : null}
      {props.currentPrice ? (
        <div id="middle" className="box">
          <div className="heading">{props.monthChangeD}</div>
          <div className="subtext">Change Since Last Month (USD)</div>
        </div>
      ) : null}
      <div id="right" className="box">
        <div className="heading">{props.monthChangeP}</div>
        <div className="subtext">Change Since Last Month (%)</div>
      </div>
    </div>
  );
};

export default ToolTipHeader;
