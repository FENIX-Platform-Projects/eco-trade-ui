define([
    'jquery','underscore','bootstrap','handlebars','jstree','rangeslider',
    'Config',
    'Codelists',
    'text!../../html/region/filter.html',
    'text!../../html/country/filter.html'
], function (
    $, _, bootstrap, Handlebars, jstree, rangeslider,
    Config,
    Codelists,
    tmplFilterRegion,
    tmplFilterCountry
) {
    'use strict';

    function FILTER(opts) {

        opts = opts || {};

        var self = this;

        self.opts = _.defaults(opts, {
            container: '',
            onSubmit: $.noop
        });

        self.selection = {
            year_list: [],
            commodity_code: null,
            trade_flow_code: null
        };

        var tmplFilter = (self.opts.isCountry)? tmplFilterCountry: tmplFilterRegion;
        self.$container = (self.opts.container instanceof jQuery) ? self.opts.container : $(self.opts.container);
        self.$container.append( Handlebars.compile(tmplFilter)() );

        self.$container.find('.filter_submit').on('click', function(e) {
            e.preventDefault();
            self.opts.onSubmit(self.selection);
        });

        if(self.opts.isCountry) {
            self.initPartners();
            self.initCommodities();
            self.initYear();
            self.initFlow();
        }else{
            self.initCommodities();
            self.initYear();
            self.initFlow();
        }

    };



    FILTER.prototype.initFlow = function() {

        var self = this;

        var radioComm$ = $('input[name="trade_flow_code"]:radio', self.$container);
        
        radioComm$.on('change', function (e, data) {
            e.preventDefault();
            self.selection.trade_flow_code = $(e.target).val();
        });

        self.selection.trade_flow_code = radioComm$.val();
    };


    FILTER.prototype.initCommodities = function() {
        var self = this;
        var treeComm$ = $(self.opts.filters.commodity, self.$container);

        self.listComm = $(self.opts.filters.commodity, self.$container).jstree({
            plugins: ["wholerow", "checkbox"],
            core: {
                multiple: false,
                themes: {
                    icons: false
                },
                data: Codelists.commodities
            }
        }).on('changed.jstree', function (e, data) {
            e.preventDefault();
            self.selection.commodity_code = data.selected[0];
        });
    };

    FILTER.prototype.initPartners = function() {
        var self = this;
        var partnerComm$ = $(self.opts.filters.partner, self.$container);

        var data = self.preparePartnerData();
        self.listpartner = $(self.opts.filters.partner, self.$container).jstree({
            core: {
                multiple: false,
                themes: {
                    icons: false
                },
                data: data
            },
            plugins: ["wholerow", "checkbox", "search"],
            "search": {
                show_only_matches: true
            }
        }).on('changed.jstree', function (e, data) {
            e.preventDefault();
                self.selection.reporter_code = data.selected[0];
        });
    }


    FILTER.prototype.preparePartnerData = function() {
        var result = [];
        var data  =Codelists.countries
        for(var key in data){
            result.push({
                id: key,
                text: data[key]
            })
        }
        return result;
    }

    FILTER.prototype.initYear = function() {

        var self = this;

        var rangeMonths$ = $(self.opts.filters.year, self.$container);

        rangeMonths$.rangeSlider(Config.filter_region);

        var vals = rangeMonths$.rangeSlider("values");
        self.selection.year_list = _.range(vals.min, vals.max+1).join();

        rangeMonths$.on('valuesChanged', function(e, sel) {
            self.selection.year_list = _.range(sel.values.min, sel.values.max+1).join();
        });

        self.rangeYear = $("#range").data("ionRangeSlider");
    };


    FILTER.prototype.getSelection = function() {
        var self = this;
        return self.selection;
    };

    FILTER.prototype.reset = function() {
        var self =this;
        self.rangeYear.reset();
    };

    return FILTER;
});