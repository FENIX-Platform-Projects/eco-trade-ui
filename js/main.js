/*global requirejs*/
requirejs(['./paths'], function (paths) {

	paths.baseUrl = './';

	requirejs.config(paths);

	requirejs([
		'jquery','underscore','bootstrap','handlebars',
		'Config',
		'WDSClient',
		'js/region/filter'
	], function ($, _, bootstrap, Handlebars,
		Config,		
		WDSClient,
		regionFilter
	) {


		var filter = new regionFilter({
			container: '#page_region'
		});

		/*

		var wdsClient = new WDSClient(Config.wds_config);

		wdsClient.retrieve({
			payload: {
			    query: Config.queries.test
			},
			success: function(resp) {
			    console.log(resp);
			}
		});
*/
	});
});