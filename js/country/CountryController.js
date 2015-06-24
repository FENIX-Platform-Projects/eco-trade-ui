define([
    'jquery', 'underscore', 'bootstrap', 'handlebars',
    'Config',
    'WDSClient',
    './../common/filter',
    '../common/map',
    '../common/ChartsHandler',
    'text!../../html/country/sidebar.html',
    'amplify',
], function ($, _, bootstrap, Handlebars,
             Config,
             WDSClient,
             Filter,
             regionMap,
             ChartsHandler,
             SidebarTmpl) {

    'use strict'

    var filter;

    function CountryController(containers){
        this.$containers = containers;
    };

    CountryController.prototype.init = function(){
        var self = this;
        self.$tmpl = SidebarTmpl;

        var rmap, chartsHandler

        self.filter = new Filter({
            container: self.$containers.container,
            filters: self.$containers.filters,
            isCountry: true,
            onSubmit: function (selection) {
                
                console.log('selection',selection)
                
                rmap.renderSelection(selection);

                chartsHandler.renderCharts(selection, Config.wds_config, true);
            }
        });

        rmap = new regionMap({
            container: self.$containers.container,
            isCountry: true,
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

        amplify.subscribe( "partner.changed", function(code){
            self.$imageUrl = self.$containers.sidebar_img[code]
            self.reinitFilterValues( self.$imageUrl)
        });

        self.filter.reinitSidebar(self.$tmpl, self.$containers.sidebar_img[1])
    };

    CountryController.prototype.reinitFilterValues = function(urlImages){

        var self = this;
        var urlImg = (typeof urlImages !== "undefined" && urlImages != null)?urlImages: self.$imageUrl;
        this.filter.reinitSidebar( this.$tmpl,  urlImg);
        this.filter.reinitTradeFlowRadio();
    }


    return CountryController;
})
