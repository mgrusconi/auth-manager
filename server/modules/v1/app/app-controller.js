'use strict';


/**
 * AppController
 *
 * NodeJS version ES6
 * @category Assessment
 * 
 * @module
 * @author   Marcelo Rusconi <mgrusconi@gmail.com>
 *
 */


const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const config = require('../../../config/');
const mysql = require('mysql2/promise');

const request = Promise.promisifyAll(require('request'));

class AppController {

  /**
   * Método que retorna la salud de la aplicacion.
   * Method that returns the application health.
   *
   * @param \ req, res
   * @return \Json
   */
  async healthCheck(req, res, next) {

    this.registerService();

    return res.status(200).json({ 'health-check': 'ok' });
  }

  /**
   * Método que retorna una coneccion MySQL.
   * Method that returns a MySQL connection.
   *
   * @return \MySQL Connection
   */
  getConnection() {

    return mysql.createConnection({
      host: config.database.mysql.host,
      user: config.database.mysql.user,
      password: config.database.mysql.password,
      database: config.database.mysql.database,
      Promise: Promise
    });

  }

  /**
   * Método que permite al usuario identificarse.
   * Method that allows the user to identify.
   *
   * @param \ req, res, next
   * @return \Json
   */
  getToken(req, res, next) {
    const key = config.security.private_key;
    const headers = {
      'Content-Type': 'application/json',
    };

    const credentials = {
      client_id: config.security.client_id,
      client_secret: config.security.client_secret,
      audience: config.security.audience,
      grant_type: "client_credentials"
    }
    return new Promise(resolve => {
      request.post({
        headers: headers,
        uri: config.security.auth_url + 'oauth/token',
        body: JSON.stringify(credentials),
        method: 'POST'
      }, async (err, rs) => {
        if (err) {
          resolve({
            code: 500,
            msg: err
          });
        }

        const resBody = JSON.parse(rs.body)
        const token = resBody.token_type + ' ' + resBody.access_token;
        resolve(token);

      });
    });
  }

  /**
   * Método que permite al usuario identificarse.
   * Method that allows the user to identify.
   *
   * @param \ req, res, next
   * @return \Json
   */
  async inviteUser(data) {
    const key = config.security.private_key;

    const headers = {
      'Content-Type': 'application/json',
      'authorization': await this.getToken()
    };

    const payload = {
      user_id: "",
      connection: config.security.connection,
      name: data.email,
      email: data.email,
      password: data.password,
      user_metadata: {},
      email_verified: true,
      verify_email: false,
      app_metadata: {}
    }

    return new Promise(resolve => {
      request.post({
        headers: headers,
        uri: config.security.auth_url + 'api/v2/users',
        body: JSON.stringify(payload),
        method: 'POST'
      }, async (err, rs) => {
        if (err) {
          resolve({
            code: 500,
            msg: err
          });
        }
        const body = rs.body;
        resolve({
          code: rs.statusCode,
          msg: rs
        });

      });
    });

  }

  /**
   * Método que retorna una coneccion MySQL.
   * Method that returns a MySQL connection.
   *
   * @return \MySQL Connection
   */
  async registerService(req, res, next) {

    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute('SELECT * FROM users WHERE `email` = ?', [req.body.email]);
      let invited;
      let user_data;
      let id_user;
      const group_name = 'default';

      if (rows.length === 0) {
        invited = await this.inviteUser(req.body);
        user_data = JSON.parse(invited.msg.body);
        id_user = user_data.user_id;
        await connection.execute(
          'INSERT INTO users (id_user, name, email, active) VALUES (? , ?, ?, ?)',
          [id_user, user_data.email, user_data.email, 1]
        );
      } else {
        invited = { code: 201, body: rows };
        user_data = rows[0];
        id_user = user_data.id_user;
      }

      if (invited && invited.code === 201 || invited.code === 409) {

        const app = await connection.execute('INSERT INTO apps (name, id_client) VALUES (? , ?)', [req.body.app_name, req.body.id_client]);
        const group = await connection.execute('INSERT INTO groups (name, active) VALUES (? , ?)', [group_name, 1]);

        await connection.execute('INSERT INTO app_group (id_app, id_group) VALUES (? , ?)', [app[0].insertId, group[0].insertId]);
        await connection.execute(
          'INSERT INTO roles_and_responsibilities (id_user, id_group, id_rol, active) VALUES (? , ?, ?, ?)',
          [id_user, group[0].insertId, 1, 1]
        );
        await connection.execute('INSERT INTO licenses (id_app, end_date, active) VALUES (? , ?, ?)', [app[0].insertId, req.body.end_date, 1]);
        connection.end();
        
        const service = {
          id_client: req.body.id_client,
          app: {
            id: app[0].insertId,
            name: req.body.app_name
          },
          group: {
            id: group[0].insertId,
            name: group_name
          },
          user: {
            id: id_user,
            mail: user_data.email
          }
        };

        return res.status(200).json(service);
      } else {
        return res.status(invited.code).json(invited);
      }

    } catch (err) {
      return res.status(500).json({
        err: err,
        msg: 'Error in Register Service'
      });
    }

  }

}

module.exports = new AppController;