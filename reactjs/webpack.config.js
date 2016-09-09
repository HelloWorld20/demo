var webpack = require('webpack')

module.exports = {
	entry: './app/main.js',
	output: {
		path: __dirname,
		filename: 'app.js'
	},
	loaders: [{
		test: /\.css$/,
		loader: ['style', 'css'],
	}],
	watch: true,
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['react', 'es2015']
				}
			}
		]
	},
	externals: {
      react: 'window.React'
    }
}