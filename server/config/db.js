'use strict';

/**
 * Modulo que contiene las configuraciones de Base de datos.
 * Module containing the databases configuration.
 *
 * @module
 * @author Marcelo G. Rusconi <mgrusconi@gmail.com>
 */

module.exports = {
  database:{
    mysql: {
      host: '172.17.0.1',
      port: 3306,
      database: 'auth_manager',
      user: 'root',
      password: 'root'
    }
  }
};
