define([
    'jquery', 'underscore', 'bootstrap', 'handlebars', 'jstree', 'rangeslider',
    'Config',
    'Codelists',
    'text!../../html/region/filter.html',
    'text!../../html/country/filter.html',
    'amplify'
], function ($, _, bootstrap, Handlebars, jstree, rangeslider,
             Config,
             Codelists,
             tmplFilterRegion,
             tmplFilterCountry) {
    'use strict';

    function FILTER(opts) {

        opts = opts || {};

        var self = this;

        self.opts = _.defaults(opts, {
            isCountry: false,
            container: '',
            onSubmit: $.noop
        });

        self.selection = {
            year: null,
            year_list: [],
            commodity_code: null,
            trade_flow_code: null,
            reporter_code: null
        };

        var tmplFilter = (self.opts.isCountry) ? tmplFilterCountry : tmplFilterRegion;
        self.$container = (self.opts.container instanceof jQuery) ? self.opts.container : $(self.opts.container);
        self.$container.append(Handlebars.compile(tmplFilter)());

        self.$container.find('.filter_submit').on('click', function (e) {
            e.preventDefault();
            self.opts.onSubmit(self.selection);
        });

        if (self.opts.isCountry) {
            self.initPartners();
            self.initCommodities();
            self.initYear();
            self.initFlow();
        } else {
            self.initCommodities();
            self.initYear();
            self.initFlow();
        }
    };


    FILTER.prototype.initFlow = function () {

        var self = this;

        self.radioComm$ = $('input[name="trade_flow_code"]:radio', self.$container);

        self.radioComm$.on('change', function (e, data) {
            e.preventDefault();
            self.selection.trade_flow_code = $(e.target).val();
        });

        self.selection.trade_flow_code = self.radioComm$.val();
    };


    FILTER.prototype.initCommodities = function () {
        var self = this;
        var treeComm$ = $(self.opts.filters.commodity, self.$container);

        self.listComm = treeComm$.jstree({
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

    FILTER.prototype.initPartners = function () {
        var self = this;
        var partnerComm$ = $(self.opts.filters.partner, self.$container);

        self.listpartner = $(self.opts.filters.partner, self.$container).jstree({
            core: {
                multiple: false,
                themes: {
                    icons: false
                },
                data: Codelists.countries
            },
            plugins: ["wholerow", "checkbox"],
        }).on('changed.jstree', function (e, data) {
            e.preventDefault();
            self.selection.reporter_code = data.selected[0];
            if (self.opts.isCountry) {
                amplify.publish('partner.changed', data.selected[0])
            }
        });
    }


    FILTER.prototype.initYear = function () {

        var self = this;

        self.rangeMonths$ = $(self.opts.filters.year, self.$container);

        self.rangeMonths$.rangeSlider(Config.rangeslider_config);

        var vals = self.rangeMonths$.rangeSlider("values");
        self.selection.year_list = _.range(vals.min, vals.max + 1).join();

        self.rangeMonths$.on('valuesChanged', function (e, sel) {
            self.selection.year_list = _.range(sel.values.min, sel.values.max + 1).join();
        });

        self.rangeYear = self.rangeMonths$.data("ionRangeSlider");
    };


    FILTER.prototype.getSelection = function () {
        var self = this;
        return self.selection;
    };

    FILTER.prototype.reset = function () {
        var self = this;
        self.rangeYear.reset();
    };


    FILTER.prototype.reinitTradeFlowRadio = function () {
        var self = this;

        self.selection.trade_flow_code === 'IMP' ?
            self.radioComm$[1].checked = true :
            self.radioComm$[0].checked = true;
    }

    FILTER.prototype.reinitSidebar = function (template, urlImages) {
        var self = this;
        if (self.opts.isCountry) {
            self._redrawSidebarCountry(template, urlImages)
        } else {
            self._redrawSidebarRegion(template)
        }
    }

    FILTER.prototype._redrawSidebarCountry = function (template, urlImages) {

        var self = this;
        var regionSidebar = $('#overview_region')
        if (regionSidebar.length > 0) {
            $('#overview_region').remove();
            $('body').prepend(template);
        }

        if (!self.$urlImages) {
            self.$urlImages = urlImages;
        } else {
            self.$urlImages = (self.$urlImages != urlImages) ? self.$urlImages : urlImages;
        }
        $('#gdp_country').attr("src", urlImages + 'gdp.png');
        $('#balance_country').attr("src", urlImages + 'balance.png');
        $('#comm_country').attr("src", urlImages + 'gdp.png');

    }

    FILTER.prototype._redrawSidebarRegion = function (template) {

        var regionSidebar = $('#overview_country')
        if (regionSidebar) {
            $('#overview_country').remove();
            $('body').prepend(template);
        }
    }


    return FILTER;
});