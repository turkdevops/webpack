/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("./ChunkGraph")} ChunkGraph */
/** @typedef {import("./Dependency")} Dependency */
/** @typedef {import("./DependencyTemplates")} DependencyTemplates */
/** @typedef {import("./InitFragment")} InitFragment */
/** @typedef {import("./Module")} Module */
/** @typedef {import("./ModuleGraph")} ModuleGraph */
/** @typedef {import("./RuntimeTemplate")} RuntimeTemplate */

/**
 * @typedef {Object} DependencyTemplateContext
 * @property {RuntimeTemplate} runtimeTemplate the runtime template
 * @property {DependencyTemplates} dependencyTemplates the dependency templates
 * @property {ModuleGraph} moduleGraph the module graph
 * @property {ChunkGraph} chunkGraph the chunk graph
 * @property {Set<string>} runtimeRequirements the requirements for runtime
 * @property {Module} module current module
 * @property {InitFragment[]} initFragments mutable array of init fragments for the current module
 */

class DependencyTemplate {
	/**
	 * @abstract
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		throw new Error("DependencyTemplate.apply must be overriden");
	}
}

module.exports = DependencyTemplate;
