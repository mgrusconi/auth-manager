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

const request = Promise.promisifyAll(require('request'));

class AppController {

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
  async inviteUser(req, res, next) {
    const key = config.security.private_key;

    const headers = {
      'Content-Type': 'application/json',
      'authorization': await this.getToken()
    };

    const payload = {
      user_id: "",
      connection: config.security.connection,
      email: req.body.email,
      password: req.body.password,
      user_metadata: {},
      email_verified: false,
      verify_email: true,
      app_metadata: {}
    }


      request.post({
        headers: headers,
        uri: config.security.auth_url + 'api/v2/users',
        body: JSON.stringify(payload),
        method: 'POST'
      }, async (err, rs) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(rs.statusCode).json(rs);
      });

  }

  /**
   * Método que permite al usuario identificarse.
   * Method that allows the user to identify.
   *
   * @param \ req, res, next
   * @return \Json
   */
  async login(req, res, next) {
    const token = await this.getToken();
    const key = config.security.private_key;
    const createToken = (user) => {
      let token = jwt.sign(user, key, {
        expiresIn: 60 * 60 * 5
      });
      return token;
    };

    request.getAsync({
      url: config.resources.users,
      method: 'GET'
    }).then((doc) => {
      let rs = JSON.parse(doc.body);
      let authUser = rs.clients.filter((user) => {
        if (user.email == req.body.email) {
          return user;
        }
      });

      if (authUser.length > 0) {
        return res.status(200).json({ 'user_token': createToken(authUser[0]), 'token': token });
      } else {
        return res.status(404).json({ 'message': 'User not Found' });
      }
    }).catch(err => next(err));
  }

}

module.exports = new AppController;