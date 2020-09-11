import ts from "@wessberg/rollup-plugin-ts";
import packageJson from "./package.json";

export default {
	input: "src/index.ts",
	output: [
		{
			file: packageJson.main,
			format: "esm",
			sourcemap: true
		}
	],
	context: "window",
	treeshake: true,
	plugins: [
		ts({
			tsconfig: "tsconfig.build.json"
		})
	],
	external: [
		...(packageJson.devDependencies == null ? [] : Object.keys(packageJson.devDependencies)),
		...(packageJson.dependencies == null ? [] : Object.keys(packageJson.dependencies))
	]
};
