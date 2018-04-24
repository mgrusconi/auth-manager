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
 * definitions:
 *   invite:
 *     type: object
 *     required:
 *       - email
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



module.exports = router;