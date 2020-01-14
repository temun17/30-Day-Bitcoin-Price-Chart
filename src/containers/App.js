import React from "react";
import DataChart from "../components/DataChart/DataChart";
import ToolTipHeader from "../components/ToolTipHeader/ToolTipHeader";
import SearchBox from "../components/SearchBox/SearchBox";

import moment from "moment";

import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchingData: true,
      data: [],
      searchField: "",
      currentPrice: null,
      monthChangeD: null,
      monthChangeP: null,
      updatedAt: null
    };
  }

  componentDidMount() {
    const urls = [
      "https://api.coindesk.com/v1/bpi/historical/close.json", // used for graph table
      "https://api.coindesk.com/v1/bpi/currentprice.json" // used for tooltip header
    ];

    Promise.all(
      urls.map(url => {
        return fetch(url).then(res => res.json());
      })
    )
      .then(cryptoData => {
        const sortData = [];
        let count = 0;
        for (let date in cryptoData[0].bpi) {
          sortData.push({
            date: moment(date).format("MMM DD"),
            price: cryptoData[0].bpi[date].toLocaleString("us-EN", {
              style: "currency",
              currency: "USD"
            }),
            index: count, //previous days
            numerical: cryptoData[0].bpi[date] // numerical price used for graphing
          });
          count++;
        }
        this.setState({
          data: sortData,
          fetchingData: false
        });
        const price = cryptoData[1].bpi.USD.rate_float;
        const change = price - this.state.data[0].numerical;
        const changeP =
          ((price - this.state.data[0].numerical) /
            this.state.data[0].numerical) *
          100;
        this.setState({
          currentPrice: cryptoData[1].bpi.USD.rate_float,
          monthChangeD: change.toLocaleString("us-EN", {
            style: "currency",
            currency: "USD"
          }),
          monthChangeP: changeP.toFixed(2) + "%"
        });
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  onSearchChange = e => {
    e.preventDefault();
    this.setState({
      searchField: e.target.value
    });
  };

  render() {
    // Function expression that enables the user to filter by dates
    const filteredDates = this.state.data.filter(dates => {
      return dates.date
        .toLowerCase()
        .includes(this.state.searchField.toLowerCase());
    });
    return (
      <div className="container tc">
        <div className="center ma4 pa4 br3 shadow-5 w-80">
          <div className="row grow center">
            <h1 className="header">30 Day Bitcoin Price Chart</h1>
          </div>
          <div className="row">
            {this.state.fetchingData !== true ? (
              <ToolTipHeader
                data={this.state.data}
                currentPrice={this.state.currentPrice}
                monthChangeD={this.state.monthChangeD}
                monthChangeP={this.state.monthChangeP}
                userInput={filteredDates}
              />
            ) : null}
          </div>
          <div className="row">
            <div className="chart">
              {this.state.fetchingData !== true ? (
                <DataChart data={this.state.data} userInput={filteredDates} />
              ) : null}
            </div>
          </div>
          <div className="row">
            <div id="coindesk">
              {" "}
              Powered by{" "}
              <a
                href="http://www.coindesk.com/price/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CoinDesk
              </a>
            </div>
          </div>
          <SearchBox searchChange={this.onSearchChange} />
        </div>
      </div>
    );
  }
}

export default App;
