/*global requirejs*/
requirejs(['./paths'], function (paths) {

	paths.baseUrl = './';

	requirejs.config(paths);

	requirejs([
		'jquery','underscore','bootstrap','handlebars',
		'WDSClient',
		'fx-c-c/start',
		'Config'
	], function ($, _, bootstrap, Handlebars,
		WDSClient,
		FXChart,
		Config
	) {

		var wdsClient = new WDSClient(Config.wds_config);

		wdsClient.retrieve({
			payload: {
			    query: Config.queries.test
			},
			success: function(resp) {
			    console.log(resp);
			}
		});

	});
});