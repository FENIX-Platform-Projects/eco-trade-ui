define([
    'jquery', 'underscore', 'bootstrap', 'handlebars',
    'Config',
    'WDSClient',
    '../common/filter',
    '../common/map',
    '../common/ChartsHandler',
    'text!../../html/region/sidebar.html'],
    function ($, _, bootstrap, Handlebars,
             Config,
             WDSClient,
             Filter,
             regionMap,
             ChartsHandler,
             SidebarTmpl) {

    'use strict'

    function RegionController(regionContainers){
        this.$containers = regionContainers;
    };

    RegionController.prototype.init = function(){

        var self = this;
        self.$tmpl = SidebarTmpl;
        var rmap, chartsHandler
        $(self.$containers.container).show()

        self.filter = new Filter({
            container: self.$containers.container,
            filters: self.$containers.filters,
            isCountry: false,
            onSubmit: function (selection) {
                rmap.renderSelection(selection);
                
                rmap.updateLayer(selection);

                chartsHandler.renderCharts(selection, Config.wds_config, false);
            }
        });

        rmap = new regionMap({
            container: self.$containers.container,
            selection: {
                year: Config.rangeslider_config.defaultValues.min,
                year_list: _.range(Config.rangeslider_config.defaultValues.min, Config.rangeslider_config.defaultValues.max).join(),
                trade_flow_code: 'EXP',
                commodity_code: 'AGR'
            }
        });

        chartsHandler = new ChartsHandler({
            container: self.$containers.container,
            queries: Config.queries
        });

        $('body').prepend(self.$tmpl);
    };

    RegionController.prototype.reinitFilterValues = function(){

        var self = this;
        self.filter.reinitSidebar( self.$tmpl);
        self.filter.reinitTradeFlowRadio();
    }

    return RegionController;
})
