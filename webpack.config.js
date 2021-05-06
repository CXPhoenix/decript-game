const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: "./src/js/project.js",
	output: {
		filename: "project.bundle.js",
		path: path.resolve(__dirname,"public","js")
	},
    optimization: {
        minimize: true,
    },
    mode: 'production'
}