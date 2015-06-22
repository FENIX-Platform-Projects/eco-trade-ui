define(['jquery', 'WDSClient', 'fx-c-c/start', 'underscore'], function ($, WDSClient, FXChart) {

    'use strict'

    var self = this;
    var creator;

    var CONTAINERS = {
        regionWithin: "#chart_within_eco",
        regionBar: "#chart_commodity",
        countryBalance: "#chart_balance",
        countryNormal: "#chart_bars"
    }

    function ChartsHandler(queries) {
        this.o = {};
        this.o.queries = queries;
        this.o.containers = CONTAINERS;
        creator = new FXChart();

    };

    ChartsHandler.prototype.renderCharts = function (queryParameters, wdsConfig) {

        this.o.queryParams = queryParameters;
        this.o.wdsConfig = wdsConfig;

        debugger;
        // region
        this._createChart(this.o.queries.region_within, false, true);
        this._createChart(this.o.queries.region_year, false, false);

      /*  // country
        this._createChart(this.o.queries.country_balance, true, true);
        this._createChart(this.o.queries.country_bar, true, false);*/


    };

    ChartsHandler.prototype._createChart = function (query, isCountry, isSpecial) {

        var self = this;

        var wdsClient = new WDSClient(this.o.wdsConfig);
        var callback;
        if (isCountry) {
            callback = (isSpecial) ? this.renderCountryBalance : this.renderCountryNormal;
        } else {
            callback = (isSpecial) ? this.renderRegionWithin : this.renderRegionBar;
        }
        console.log(callback)


        wdsClient.retrieve({
            payload: {
                query: query,
                queryVars: self.o.queryParams
            },
            success: function (model) {
                creator.init({
                    model: model,
                    template: {},
                    creator: {},
                    onReady: _.bind(callback, self)
                });
            }
        });
    }


    ChartsHandler.prototype.renderCountryBalance = function (creator) {
        debugger;
        creator.render({
            container: self.o.containers.countryBalance,
            creator: {
                chartObj: {
                    chart: {
                        type: "column"
                    }
                }
            }
        });
    }


    ChartsHandler.prototype.renderCountryNormal = function (creator) {
        creator.render({
            container: self.o.containers.countryNormal,
            creator: {
                chartObj: {
                    chart: {
                        type: "column"
                    }
                }
            }
        });
    }


    ChartsHandler.prototype.renderRegionBar = function (creator) {
        var self = this;
        creator.render({
            container: self.o.containers.regionBar,
            adapter: {
                // used in init just for MATRIX and FENIX
                xOrder: 'asc',
                xDimensions: [0],
                valueDimensions: 2,
                seriesDimensions: [1]
            },
            creator: {
                chartObj: {
                    chart: {
                        type: "column"
                    }
                }
            }
        });
    }


    ChartsHandler.prototype.renderRegionWithin = function (creator) {
       var self = this;
        debugger;
        creator.render({
            container: self.o.containers.regionWithin,
            adapter: {
                // used in init just for MATRIX and FENIX
                xOrder: 'asc',
                xDimensions: [0],
                valueDimensions: 2,
                seriesDimensions: [1]
            }
        });
    }


    return ChartsHandler;
})
