define(function() {

    var FX_CDN = '//fenixrepo.fao.org/cdn/js/';

    return {

        paths: {

            Config:     "config/config",
            Codelists:     "config/codelists",
            
            tableHandler: "./js/common/TableHandler",
            chartsHandler: "./js/common/ChartsHandler",

            i18n:        FX_CDN + "requirejs/plugins/i18n/2.0.4/i18n",
            text:        FX_CDN + "requirejs/plugins/text/2.0.12/text",
            jquery:      FX_CDN + "jquery/2.1.1/jquery.min",
            chosen:      FX_CDN + "chosen/1.2.0/chosen.jquery.min",
            domready:    FX_CDN + "requirejs/plugins/domready/2.0.1/domReady",
            bootstrap:   FX_CDN + "bootstrap/3.3.4/js/bootstrap.min",
            highcharts:  FX_CDN + "highcharts/4.0.4/js/highcharts",
            underscore:  FX_CDN + "underscore/1.7.0/underscore.min",
            handlebars:  FX_CDN + "handlebars/2.0.0/handlebars.min",
            sweetAlert:  FX_CDN + 'sweet-alert/0.4.2/sweet-alert',
            amplify:     FX_CDN + "amplify/1.1.2/amplify.min",
            jstree:      FX_CDN + "jstree/3.0.8/dist/jstree.min",
            modernizr:   FX_CDN + "modernizr/2.8.3/dist/Modernizr.min",            
            rangeslider: FX_CDN + "jquery.rangeslider/5.7.0/jQRangeSlider-min",
            //bootstrapslider: FX_CDN + "bootstrap.slider/4.9.1/dist/bootstrap-slider.min",
            bootstrapslider: FX_CDN + "bootstrap.slider/4.9.1/js/bootstrap-slider",

            WDSClient: 'submodule/fenix-ui-common/js/WDSClient',
            'fx-ui-table': 'submodule/fenix-ui-common/html/table.html',

            //fenix-ui-map
            'leaflet':                FX_CDN + 'leaflet/0.7.3/leaflet',
            'jquery-ui':              FX_CDN + 'jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
            'jquery.power.tip':       FX_CDN + 'jquery.power.tip/1.2.0/jquery.powertip.min',
            'jquery.hoverIntent':     FX_CDN + 'jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',
            'import-dependencies':    FX_CDN + 'FENIX/utils/import-dependencies-1.0',
            'jquery.i18n.properties': FX_CDN + 'jquery/1.0.9/jquery.i18n.properties-min',
            'fenix-ui-map':           'submodule/fenix-ui-map/dist/fenix-ui-map.min',
            'fenix-ui-map-config':    'submodule/fenix-ui-map/dist/fenix-ui-map-config',

            //fenix-ui-chart-creator
            'fx-c-c/html':      'submodule/fenix-ui-chart-creator/src/html',            
            'fx-c-c/start':     'submodule/fenix-ui-chart-creator/src/js/start',
            'fx-c-c/config':    'submodule/fenix-ui-chart-creator/config',
            'fx-c-c/adapters':  'submodule/fenix-ui-chart-creator/src/js/adapters',
            'fx-c-c/creators':  'submodule/fenix-ui-chart-creator/src/js/creators',
            'fx-c-c/templates': 'submodule/fenix-ui-chart-creator/src/js/templates'            
        },

        shim: {
            bootstrap: ["jquery"],
            highcharts: ['jquery'],
            chosen: ['jquery'],
            amplify: ['jquery'],
            underscore: {
                exports: '_'
            },
            handlebars: {
                exports: 'Handlebars'
            },
            rangeslider: ['jquery', 'jquery-ui'],
            bootstrapslider: ['jquery','jquery-ui','bootstrap','modernizr'],

            WDSClient: ['jquery'],
            'jquery-ui': ['jquery'],
            'jquery.hoverIntent': ['jquery'],
            'jquery.power.tip': ['jquery'],
            'jquery.i18n.properties': ['jquery'],
            'jquery.hoverIntent': ['jquery'],
            'fenix-ui-map': {
                deps: [
                    'jquery',
                    'jquery-ui',
                    'leaflet',
                    'chosen',               
                    'jquery.power.tip',
                    'jquery.i18n.properties',
                    'import-dependencies',
                    'jquery.hoverIntent',
                    'fenix-ui-map-config'                    
                ]
            }
        }
    };
});