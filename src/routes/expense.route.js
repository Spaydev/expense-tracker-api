const expenseCtr = require('../controllers/expense.ctr');
const { createSchema  } = require('./schema/expense.schema');

async function ExpenseRoutes(fastify, options) {

  fastify.get('/getOneById/:id',{ preHandler: [fastify.authenticate] } , expenseCtr.getOneById);
  fastify.get('/getMeExpense',{ preHandler: [fastify.authenticate] } , expenseCtr.getMeExpense );
  fastify.post('/create',{ schema:createSchema , preHandler: [fastify.authenticate] }, expenseCtr.create);
  fastify.put('/update/:id',{schema:createSchema , preHandler: [fastify.authenticate]} , expenseCtr.update);
  fastify.delete('/delete/:id',{preHandler: [fastify.authenticate]} , expenseCtr.delete);
  fastify.get('/summaryOfExpenses',{preHandler: [fastify.authenticate]} , expenseCtr.summaryOfEexpenses);

}

module.exports = ExpenseRoutes;