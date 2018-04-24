'use strict';

/**
 * Modulo que contiene la configuracion genérica.
 * Module containing the generics configs.
 *
 * @module
 * @author Marcelo G. Rusconi <mgrusconi@gmail.com>
 */

const packageJson = require('../../package.json');

module.exports = {
  path: 'app',
  routes: 'modules/**/*-routing.js',
  title: 'Auth Manager',
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description
};
