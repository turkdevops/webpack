/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Florent Cailhol @ooflorent
*/

"use strict";

const InitFragment = require("../InitFragment");
const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../DependencyTemplates")} DependencyTemplates */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../RuntimeTemplate")} RuntimeTemplate */
/** @typedef {import("../util/createHash").Hash} Hash */

/**
 * @param {string[]|null} path the property path array
 * @returns {string} the converted path
 */
const pathToString = path =>
	path !== null && path.length > 0
		? path.map(part => `[${JSON.stringify(part)}]`).join("")
		: "";

class ProvidedDependency extends ModuleDependency {
	constructor(request, identifier, path, range) {
		super(request);
		this.identifier = identifier;
		this.path = path;
		this.range = range;
	}

	/**
	 * Update the hash
	 * @param {Hash} hash hash to be updated
	 * @param {ChunkGraph} chunkGraph chunk graph
	 * @returns {void}
	 */
	updateHash(hash, chunkGraph) {
		super.updateHash(hash, chunkGraph);
		hash.update(this.identifier);
		hash.update(this.path ? this.path.join(",") : "null");
	}

	serialize(context) {
		const { write } = context;
		write(this.identifier);
		write(this.path);
		write(this.range);
		super.serialize(context);
	}

	deserialize(context) {
		const { read } = context;
		this.identifier = read();
		this.path = read();
		this.range = read();
		super.deserialize(context);
	}
}

makeSerializable(
	ProvidedDependency,
	"webpack/lib/dependencies/ProvidedDependency"
);

class ProvidedDependencyTemplate extends ModuleDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{
			runtimeTemplate,
			moduleGraph,
			chunkGraph,
			initFragments,
			runtimeRequirements
		}
	) {
		const dep = /** @type {ProvidedDependency} */ (dependency);
		initFragments.push(
			new InitFragment(
				`/* provided dependency */ var ${
					dep.identifier
				} = ${runtimeTemplate.moduleExports({
					module: moduleGraph.getModule(dep),
					chunkGraph,
					request: dep.request,
					runtimeRequirements
				})}${pathToString(dep.path)};\n`,
				InitFragment.STAGE_PROVIDES,
				1,
				`provided ${dep.identifier}`
			)
		);
		source.replace(dep.range[0], dep.range[1] - 1, dep.identifier);
	}
}

ProvidedDependency.Template = ProvidedDependencyTemplate;

module.exports = ProvidedDependency;
