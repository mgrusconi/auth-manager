'use strict';

/**
 * App Router
 *
 * @module
 * @author Marcelo Rusconi <mgrusconi@gmail.com>
 */

const Router = require('express');
const controller = require('./app-controller');

const router = new Router();

/**
 * @swagger
 * /app/healthcheck:
 *   get:
 *     tags:
 *       - API v1
 *     summary: APP Health Check
 *     description: Method that returns the health of the application.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-key
 *         in: header
 *         description: API key
 *         required: true
 *         type: string
 *         format: string
 *         default: 2fvTdG53VCp6z8ZbV66h
 *       - name: user-token
 *         in: header
 *         description: User Token JWT
 *         type: string
 *         format: string
 *         default:
 *     responses:
 *       200:
 *         description: app!
 *         schema:
 *           $ref: ''
 */

router.route('/healthcheck').get((...args) => controller.healthCheck(...args));

/**
 * @swagger
 * definitions:
 *   invite:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         default: "manningblankenship@quotezart.com"
 *         description: e-mail User
 *       password:
 *         type: string
 *         default: "somePaswword"
 *         description: e-mail User
 */

/**
 * @swagger
 * /app/user:
 *   post:
 *     tags:
 *       - API v1
 *     summary: Login with User email.
 *     description: Method that allows the user to identify.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Profile
 *         required: true
 *         schema:
 *           $ref: '#/definitions/invite'
 *       - name: x-key
 *         in: header
 *         description: API key
 *         required: true
 *         type: string
 *         format: string
 *         default: 2fvTdG53VCp6z8ZbV66h
 *     responses:
 *       200:
 *         description: Profile created!
 */
router.route('/user').post((...args) => controller.inviteUser(...args));

/**
 * @swagger
 * definitions:
 *   registerservice:
 *     type: object
 *     required:
 *       - id_client
 *       - app_name
 *       - email
 *       - password
 *     properties:
 *       id_client:
 *         type: string
 *         default: "sdf4ds56f564sdf"
 *         description: Client ID
 *       app_name:
 *         type: string
 *         default: "Model 155"
 *         description: Application Name
 *       end_date:
 *         type: date
 *         default: "2018-05-01"
 *         description: End Date of License
 *       email:
 *         type: string
 *         default: "manningblankenship@quotezart.com"
 *         description: e-mail User
 *       password:
 *         type: string
 *         default: "somePaswword"
 *         description: e-mail User
 */

/**
 * @swagger
 * /app/registerservice:
 *   post:
 *     tags:
 *       - API v1
 *     summary: Login with User email.
 *     description: Method that allows the user to identify.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Profile
 *         required: true
 *         schema:
 *           $ref: '#/definitions/registerservice'
 *       - name: x-key
 *         in: header
 *         description: API key
 *         required: true
 *         type: string
 *         format: string
 *         default: 2fvTdG53VCp6z8ZbV66h
 *     responses:
 *       200:
 *         description: Profile created!
 */
router.route('/registerservice').post((...args) => controller.registerService(...args));

/**
 * @swagger
 * definitions:
 *   invite:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         default: "manningblankenship@quotezart.com"
 *         description: e-mail User
 *       password:
 *         type: string
 *         default: "somePaswword"
 *         description: e-mail User
 */

/**
 * @swagger
 * /app/permissions/{id_app}/{id_user}:
 *   get:
 *     tags:
 *       - API v1
 *     summary: TODO
 *     description: TODO.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_app
 *         in: path
 *         description: TODO
 *         required: true
 *         type: integer
 *         default: 1
 *       - name: id_user
 *         in: path
 *         description: TODO
 *         required: true
 *         type: string
 *         default: 1
 *       - name: x-key
 *         in: header
 *         description: API key
 *         required: true
 *         type: string
 *         format: string
 *         default: 2fvTdG53VCp6z8ZbV66h
 *       - name: user-token
 *         in: header
 *         description: User Token JWT
 *         type: string
 *         format: string
 *         default:
 *     responses:
 *       200:
 *         description: app!
 *         schema:
 *           $ref: ''
 */
router.route('/permissions/:id_app/:id_user').get((...args) => controller.getPermissions(...args));



module.exports = router;