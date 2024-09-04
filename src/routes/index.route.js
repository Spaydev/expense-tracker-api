const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const expenseRoute = require('./expense.route');

async function indexRoutes(fastify, options) {
    fastify.register(authRoute, { prefix: '/api/v1/auth' });
    fastify.register(userRoute, { prefix: '/api/v1/user' });  
    fastify.register(categoryRoute, { prefix: '/api/v1/category' });  
    fastify.register(expenseRoute, { prefix: '/api/v1/expense' });  

}

module.exports = indexRoutes;