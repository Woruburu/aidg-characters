//@ts-ignore
import PreactRefreshPlugin from "@prefresh/webpack";
import CopyPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import * as webpack from "webpack";

module.exports = (env: { production: boolean }): webpack.Configuration => {
	process.env["NODE_ENV"] = env.production ? "production" : "development";
	return {
		entry: path.resolve(__dirname, "src", "index.tsx"),

		target: env.production ? "browserslist" : "web",

		output: {
			filename: !env.production ? "site.js" : "site.[contenthash].js",
			path: path.resolve(__dirname, "dist"),
			clean: true,
		},

		module: {
			rules: [
				{
					test: /\.(tsx?|jsx?)$/,
					use: {
						loader: "babel-loader",
					},
					exclude: /node_modules/,
				},
				{
					test: /\.(c|sa|sc)ss$/i,
					use: [
						env.production ? MiniCssExtractPlugin.loader : "style-loader",
						"css-loader",
						"sass-loader",
					],
				},
			],
		},

		resolve: {
			extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
			alias: {
				react: "preact/compat",
				"react-dom/test-utils": "preact/test-utils",
				"react-dom": "preact/compat",
			},
			modules: [path.resolve(__dirname, "src"), "node_modules"],
		},

		devServer: {
			contentBase: "./dist",
			historyApiFallback: true,
			hot: true,
		},

		mode: env.production ? "production" : "development",

		devtool: env.production ? "source-map" : "eval-source-map",

		plugins: [
			new MiniCssExtractPlugin({
				filename: !env.production ? "[name].css" : "[name].[contenthash].css",
				chunkFilename: !env.production ? "[id].css" : "[id].[contenthash].css",
			}),
			new HtmlWebpackPlugin({
				publicPath: "/",
			}),
			new PreactRefreshPlugin(),
			new ForkTsCheckerWebpackPlugin({
				typescript: {
					diagnosticOptions: {
						semantic: true,
						syntactic: true,
					},
				},
			}),
			new CopyPlugin({
				patterns: [{ from: path.resolve(__dirname, "characters"), to: "characters" }],
			}),
		],

		performance: {
			maxEntrypointSize: 300000,
		},
	};
};
