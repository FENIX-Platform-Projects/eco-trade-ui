define([
    'jquery','underscore','bootstrap','handlebars','jstree','rangeslider',
    'Config',
    'Codelists',
    'text!html/region/filter.html',
], function (
    $, _, bootstrap, Handlebars, jstree, rangeslider,
    Config,
    Codelists,
    tmplFilter
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

        self.$container = (self.opts.container instanceof jQuery) ? self.opts.container : $(self.opts.container);
        self.$container.append( Handlebars.compile(tmplFilter)() );

        self.$container.find('.filter_submit').on('click', function(e) {
            e.preventDefault();

            console.log(self.selection);

            self.opts.onSubmit(self.selection);
        });

        self.initCommodities();
        self.initYear();
        self.initFlow();        
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
    
        var treeComm$ = $('#filter_commodity_code', self.$container);

        self.listComm = $('#filter_commodity_code', self.$container).jstree({
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

    FILTER.prototype.initYear = function() {

        var self = this;
    
        var rangeMonths$ = $('#filter_year', self.$container);

        rangeMonths$.rangeSlider(Config.filter_region);

        var vals = rangeMonths$.rangeSlider("values");
        self.selection.year_list = _.range(vals.min, vals.max+1).join();

        rangeMonths$.on('valuesChanged', function(e, sel) {
            self.selection.year_list = _.range(sel.values.min, sel.values.max+1).join();
        });

        self.rangeYear = $("#range").data("ionRangeSlider");
    };


    FILTER.prototype.getSelection = function() {
        return self.selection;
    };

    FILTER.prototype.reset = function() {
        self.rangeYear.reset();
    };

    return FILTER;
});