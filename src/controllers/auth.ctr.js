const crypto = require("crypto");
const fs = require("fs");
const UserModel = require("../models/user.model");
const { hashPassword , checkUserPassword , signTokenKeyWithUserId , signTokenKey , refreshToken } = require("../utils/common.utils");

exports.login = async (req, reply) => {
  try {
    const { email , password } = req.body
    let existingUser = await UserModel.findOne({ email:email });
    if(existingUser){
      const check = await checkUserPassword( email , password);
      if(check.status){
        existingUser.password = undefined
        return reply.code(200).send({ 
          success:false,
          data: {
            user:existingUser,
            ...await signTokenKeyWithUserId(existingUser._id)
          },
        });
      }else{
        return reply.code(404).send({ 
          success:false,
          message:check.message,
        });
      }
    }else{
      return reply.code(404).send({ 
        success:false,
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      success: false,
      errors: [
        {
          code: 500,
          message: "Server 500 Error",
        },
      ],
    });
  }
};
exports.register = async (req, reply) => {
  try {
    const existingUser = await UserModel.findOne({ email:req.body.email });
    if (existingUser) {
      return reply.code(400).send({ 
        success:false,
        message: 'Email already exists' 
      });
    }else{
      req.body.password = await hashPassword(req.body.password);
      let createUser = await UserModel.create(req.body);
      createUser.password = undefined
      return reply.code(301).send({ 
        success:true,
        data: {
          user:createUser,
          ... await signTokenKeyWithUserId(createUser._id)
        },
      });
    }
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      success: false,
      errors: [
        {
          code: 500,
          message: "Server 500 Error",
        },
      ],
    });
  }
};

exports.authRefreshToken = async (req, reply) => {
  try {
    const token = req.query.refreshToken || ''
    const getNewToken = await refreshToken(token);
    if(getNewToken && getNewToken.token){
      return reply.code(200).send({ 
        success:true,
        data:getNewToken ,
      });
    }else{
      return reply.code(400).send({ 
        success:false,
        data:{} ,
        message:"Invalid refresh token"
      });
    }
    
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      success: false,
      errors: [
        {
          code: 500,
          message: "Server 500 Error",
        },
      ],
    });
  }
};
exports.generateECKeyPair = async (req, reply) => {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
      namedCurve: "secp521r1",
    });
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    fs.writeFileSync(
      "private-key.pem",
      this.privateKey.export({ format: "pem", type: "pkcs8" })
    );
    fs.writeFileSync(
      "public-key.pem",
      this.publicKey.export({ format: "pem", type: "spki" })
    );
    reply.code(201).send({
      success: true,
      response: {
        message: "Generate EC (Elliptic Curve) Key Pair Sussess",
      },
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      success: false,
      response: {
        data: [],
      },
      errors: [
        {
          code: 500,
          message: "Server 500 Error",
        },
      ],
    });
  }
};
exports.generateKeyRandom = async (req, reply) => {
  try {
    const { length } = req.query;
    key = await crypto.randomBytes(parseInt(length || 16)).toString('hex');;
    reply.code(201).send({
      success: true,
      response: {
        data: key,
      },
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      success: false,
      response: {
        data: [],
      },
      errors: [
        {
          code: 500,
          message: "Server 500 Error",
        },
      ],
    });
  }
};
