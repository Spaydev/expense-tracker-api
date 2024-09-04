// โหลด controller และ model ที่เกี่ยวข้อง
const authCtr = require('../controllers/auth.ctr');

const { registerSchema ,loginSchema } = require('./schema/auth.schema');

async function AuthRoutes(fastify, options ) {
  fastify.post('/login',{schema: loginSchema } , authCtr.login);
  fastify.post('/register',{schema: registerSchema }, authCtr.register);
  fastify.post('/generate_ec_keypair',{ preHandler: [ ] },authCtr.generateECKeyPair)
  fastify.get('/generate_key_random',{ preHandler: []},authCtr.generateKeyRandom);
}

module.exports = AuthRoutes;


