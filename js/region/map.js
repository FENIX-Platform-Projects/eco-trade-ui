define([
    'jquery','underscore','bootstrap','handlebars','jstree',
    'Config',
    'text!html/region/map.html',
    'fenix-ui-map'
], function (
    $, _, bootstrap, Handlebars, jstree,
    Config,
    tmplMap,
    FXMAP
) {
    'use strict';

    function MAP(opts) {

        opts = opts || {};

        var self = this;

        self.o = _.defaults(opts, {
            selection: {
                year_list: [],
                commodity_code: null,
                trade_flow_code: null
            },
            selectedCountries: [],
            cl: {
                indicators: null
            }
        });

        self.map = null;

        self.$container = (self.o.container instanceof jQuery) ? self.o.container : $(self.o.container);
        self.$container.append( Handlebars.compile(tmplMap)() );

        self.initMap('#map_partners_region');
    };

    MAP.prototype.renderData = function(selection) {

        selection.partner_code = '1';
        selection.commodity_code = 'AGR';
        selection.year_list = selection.year_list;
        
        wdsClient.retrieve({
            payload: {
                query: Config.queries.region_year,
                queryVars: selection
            },
            success: function(data) {
                console.log('RESP WDS', data);
            }
        });        
        selection = selection || this.o.selection;
    };

    MAP.prototype.initMap = function(id) {
        var layers = 'fenix:gaul0_faostat_3857',
            joinColumn = 'gaul0',
            joinLabel = 'faost_n';

        this.map = new FM.Map(id, {
            plugins: {
                zoomcontrol: 'topright',
                zoomResetControl: false,
                controlloading: false,
                mouseposition: false,
                disclaimerfao: false,
                fullscreen: false,
                geosearch: false
            },
            guiController: {
                overlay: false,
                baselayer: false,
                wmsLoader: false
            }
        });
        this.map.createMap();

        this.map.addLayer(new FM.layer({
            layers: 'fenix:gaul0_line_3857',
            layertitle: 'Country Boundaries',
            urlWMS: 'http://fenix.fao.org/geoserver',
            opacity: '0.9',
            zindex: '500',
            lang: 'en'
        }));

        this.o.l_highlight_countries = new FM.layer({
            layers: layers,
            layertitle: '',
            urlWMS: 'http://fenix.fao.org/geoserver',
            zindex: '550',
            style: 'highlight_polygon',
            cql_filter: "gaul0 IN ('0')",
            hideLayerInControllerList: true,
            lang: 'en'
        });
        this.map.addLayer(this.o.l_highlight_countries);
    };

    MAP.prototype.resetCountries = function() {
        this.o.selectedCountries = [];
        this.highlightCountries(this.o.selectedCountries);
        this.map.map.setView([0,0], 1);
    };

    MAP.prototype.highlightCountries = function(countryCodes) {

        if (countryCodes.length > 0)
            this.o.l_highlight_countries.layer.cql_filter = "gaul0 IN ('" + countryCodes.join("','") + "')";
        else
            this.o.l_highlight_countries.layer.cql_filter = "gaul0 IN ('0')";

        this.o.l_highlight_countries.redraw();
    };

    MAP.prototype.updateJoinLayer = function(resetCountries) {
        var indicator = this.$indicator.val();
        // remove cached layer

        this.map.removeLayer(this.o.joinlayer);

        // clean joindata array
        this.o.joinlayer.layer.joindata = [];

        var codes = []
        data.forEach(_.bind(function(d) {
            if (d[indicator] != null && d[indicator] != 0) {
                var p = {};
                p[d['Country']] = d[indicator];
                codes.push(d['Country']);
                this.o.joinlayer.layer.joindata.push(p);
            }
        }, this));

        if (this.o.joinlayer.layer.joindata.length > 0) {
            this.o.joinlayer = new FM.layer(this.o.joinlayer.layer);
            this.map.addLayer(this.o.joinlayer);
            // TODO: add check for maximum number of codes?

            // handle dropdown selection
            if (codes.length < 200)
                this.zoomTo(codes);
        }
        else {
            // reset values
            this.resetCountries();

            swal({title: i18n.error, type: 'error', text: i18n.data_not_available_current_selection});
        }
    };

    MAP.prototype.zoomTo = function(codes) {
        this.map.zoomTo("country", "gaul0", codes);
    };

    return MAP;
});