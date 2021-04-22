module.exports = (api) => {
	const plugins = [];
	if (!api.env("production")) {
		plugins.push("@prefresh/babel-plugin");
	}
	return {
		presets: [
			[
				"@babel/preset-env",
				{
					corejs: { version: "3.10" },
					useBuiltIns: "usage",
				},
			],
			["@babel/preset-react", { runtime: "automatic", importSource: "preact" }],
			["@babel/preset-typescript", { jsxPragma: "h" }],
		],
		plugins: plugins,
	};
};
