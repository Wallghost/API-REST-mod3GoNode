const express = require('express');
const requireDir = require('require-dir');
const authMiddleware = require('./middlewares/auth');

const routes = express.Router();

const controllers = requireDir('./controllers');


/**
 * Auth
 */
routes.post('/signup', controllers.authController.signup);
routes.post('/signin', controllers.authController.signin);

/**
 * ===========
 * Auth routes
 */

 routes.use(authMiddleware);

/**
 * User
 */
// Mesmo tendo um método de edição, não precisamos indicar com o id do usuário à ser editado
// por que já temos ele pelo middleware de autenticação
routes.get('/users/me', controllers.userController.me);
routes.put('/users', controllers.userController.update);
routes.get('/feed', controllers.userController.feed);

/**
 * Follows
 */
routes.post('/follow/:id', controllers.followController.follow);
routes.delete('/unfollow/:id', controllers.followController.unfollow);

/** 
 *  Tweets
 */
 routes.post('/tweets', controllers.tweetController.create);
 routes.delete('/tweets/:id', controllers.tweetController.destroy);

/**
 * Likes
 */
routes.post('/like/:id', controllers.likeController.toggle);

module.exports = routes;