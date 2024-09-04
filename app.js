const fastify = require('fastify')({ logger: false });
const fs = require('fs');
require('dotenv').config();
const fastifyJwt = require('@fastify/jwt');
const routes = require('./src/routes/index.route');
const middleware = require('./src/middlewares/middleware');
const MongoConnect = require('./config/database');
const fastifyCors = require('@fastify/cors')

const PRIVATE_KEY = fs.readFileSync('private-key.pem', 'utf8');
const PUBLICK_KEY = fs.readFileSync('public-key.pem', 'utf8');
const MONGO_URL_CONNECT = process.env.DATABASE_URL 

async function startServer() {
  const port = process.env.SERVER_PORT || 3001  
  await MongoConnect(MONGO_URL_CONNECT);
  await fastify.register(middleware);
  await fastify.register(fastifyCors,{origin: "*"});
  await fastify.register(fastifyJwt, {
    secret: {
        private:PRIVATE_KEY,
        public:PUBLICK_KEY,
        options: { algorithms: ['ES512'] }
    }, 
  });
  await fastify.register(require('@fastify/swagger'), {
    openapi: {
        info: {
        title: 'GO BASE API',
        description: 'Testing API Docs',
        version: '0.0.1',
        },
        components: {
            securitySchemes:{
                bearerAuth: {
                    type: 'http',
                    scheme: "bearer",
                    bearerFormat:"JWT"
                },
            }
        },
        security: [{ bearerAuth: [] }],
    }
  })
  await fastify.register(require('@fastify/swagger-ui'), {
      routePrefix: '/docs',
      uiHooks: {
          onRequest: function (request, reply, next) { next() },
          preHandler: function (request, reply, next) { next() }
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
      transformSpecificationClone: true
  })  
  await fastify.register(routes);
  await fastify.ready();
  await fastify.listen({ port:port , host: '0.0.0.0' }, (err, address) => {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      console.log("Running on port : "+address);
  })
}
startServer();
