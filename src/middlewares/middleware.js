const UserModel = require('../models/user.model');
const fp = require('fastify-plugin');


async function authenticate(req, reply) {
    try {
        await req.jwtVerify();
    } catch (err) {
        if(err.message === 'Authorization token expired'){
            
            reply.status(413).send({ 
                isTokenExpired:true,
                success: false, 
                message: err.message
            });
        }else{
            reply.status(401).send({ 
                success: false, 
                message: "Unauthorized"
            });
        }
    }
}

function authorize() {
    return async (req, reply) => {
        try {
            const { _id  } = req.user.payload
            const findUser = await UserModel.findById(_id);
            if (!findUser || findUser == null) {
                reply.status(401).send({ success: false, message: 'Unauthorized User' });
                return;
            }
            if (!findUser || findUser.active == false || findUser.deleted == true) {
                reply.status(401).send({ success: false, message: 'User Account is not enabled' });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = fp(async function (fastify) {
    fastify.decorate('authenticate', authenticate);
    fastify.decorate('authorize', authorize);
});