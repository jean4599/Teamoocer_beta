var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry:'./src/app.js',
	output:{path: './public', filename:'bundle.js'},
	watch:true,
	module: {
		loaders: [
			{ test: /.js$/, exclude: /node_modules/, loader: 'babel-loader'},
			{ test: /.(png|jpg|gif)$/, loader: 'file'},
			{ test: /.css$/,loader: "style!css" },
			{ test: /.less/,loader: 'style-loader!css-loader!less-loader'},
			{
				test: /.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query:
				{
				presets:['react','es2015']
				}
			},
		]
	},
	resolve:{
		extensions:['','.js','.json']
	},
	plugins: [
	new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
	new webpack.NoErrorsPlugin(),
	new webpack.HotModuleReplacementPlugin(),

	new webpack.optimize.DedupePlugin()
	],
	babel: {
	"plugins": [["import", {
			    "libraryName": "antd",
			    "libraryDirectory": "lib",   // default: lib
			    "style": true
			  }]]
	}
};