const categoryCtr = require('../controllers/category.ctr');
const { createSchema ,  } = require('./schema/category.schema');

async function ExpenseRoutes(fastify, options) {

  fastify.get('/getOneById/:id',{ preHandler: [fastify.authenticate]} , categoryCtr.getOneById);
  fastify.get('/getMany',{ preHandler: [fastify.authenticate]} , categoryCtr.getMany);
  fastify.post('/create',{ schema:createSchema , preHandler: [fastify.authenticate]} , categoryCtr.create);
  fastify.put('/update/:id',{ schema:createSchema , preHandler: [fastify.authenticate]} , categoryCtr.update);
  fastify.delete('/delete/:id',{ preHandler: [fastify.authenticate]} , categoryCtr.delete);

}

module.exports = ExpenseRoutes;