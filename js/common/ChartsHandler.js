
define(['jquery', 'underscore', 'handlebars', 'text!html/region/charts.html',
        'text!html/country/charts.html','WDSClient', 'fx-c-c/start'],
    function ($,_, Handlebars, tmplChartsRegion, tmplChartsCountry,WDSClient, FXChart) {

    'use strict'

    var creator;

    function ChartsHandler(opts) {

        var self = this;

        var CONTAINERS = {
            regionWithin: "#chart_within_eco",
            regionBar: "#chart_commodity",
            countryBalance: "#chart_balance",
            countryNormal: "#chart_bars"
        }

        this.o = _.defaults(opts, {
            container: '',
            containers: CONTAINERS,
            queries: opts.queries 
        });

        creator = new FXChart();

        self.$container = (self.o.container instanceof jQuery) ? self.o.container : $(self.o.container);

    };

    ChartsHandler.prototype.renderCharts = function (queryParameters, wdsConfig, isCountry) {
        var self = this;
        var tmplCharts = (isCountry)? tmplChartsCountry: tmplChartsRegion;
        if(self.$templateCharts)
            self.$templateCharts.remove();

        self.$templateCharts = $(Handlebars.compile(tmplCharts)())
        self.$container.append(self.$templateCharts);


        this.o.queryParams = queryParameters;
        this.o.wdsConfig = wdsConfig;

        if(!isCountry) {
            // region
            this._createChart(this.o.queries.region_within, isCountry, true);
            this._createChart(this.o.queries.region_year, isCountry, false);

        }else{
            this._createChart(this.o.queries.country_balance, isCountry, true);
            this._createChart(this.o.queries.country_bar, isCountry, false);
        }
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
    };


    ChartsHandler.prototype.renderCountryBalance = function (creator) {
        var self = this;
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
    };


    ChartsHandler.prototype.renderCountryNormal = function (creator) {
        var self = this;
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
    };


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
    };


    return ChartsHandler;
})
