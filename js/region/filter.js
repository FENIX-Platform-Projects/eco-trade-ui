define([
    'jquery','underscore','bootstrap','handlebars','jstree','rangeslider',
    'Config',
    'text!html/region/filter.html',
], function (
    $, _, bootstrap, Handlebars, jstree, rangeslider,
    Config,
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
            year_list: []
        };

        self.$container = (self.opts.container instanceof jQuery) ? self.opts.container : $(self.opts.container);
        self.$container.append( Handlebars.compile(tmplFilter)() );

        self.$container.find('.filter_submit').on('click', function(e) {
            e.preventDefault();

            console.log(self.selection);

            self.opts.onSubmit(self.selection);
        });

        self.initYear();
    };

    FILTER.prototype.initYear = function(target) {

        var self = this;
    
        var rangeMonths$ = $('#filter_year', self.$container);

        rangeMonths$.rangeSlider(Config.filter_region);

        rangeMonths$.on('valuesChanged', function(e, sel) {

            self.selection.year_list = _.range(sel.values.min, sel.values.max+1);

            console.log('valuesChanged',self.selection);
        });

        var vals = rangeMonths$.rangeSlider("values");

        self.selection.year_list = _.range(vals.min, vals.max);

        self.slider = $("#range").data("ionRangeSlider");
    };


    FILTER.prototype.getSelection = function() {
        return self.selection;
    };

    FILTER.prototype.reset = function() {
        self.slider.reset();
    };

    return FILTER;
});