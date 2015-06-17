/*global requirejs*/
requirejs(['./paths'], function (paths) {

    requirejs.config(paths);

    requirejs([
    	//'fx-flude-ui/start',
    	'WDSClient'
    ], function (
    	//Module,
    	WDSClient
    ) {
        
/*  var m = new Module();
        m.init();
*/
		var wdsClient = new WDSClient({
			datasource: 'DEMO_FENIX'
		});

		wdsClient.retrieve({
			payload: {
			    query: 'SELECT year FROM ecotrade_region_trade'
			},
			outputType: 'object',
			success: function(resp) {
			    console.log(resp);
			}
		});

    });
});