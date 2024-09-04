const fs = require('fs');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model')
const PRIVATE_KEY = fs.readFileSync('private-key.pem', 'utf8');
const fastify = require('fastify');
const jwt = require('jsonwebtoken');

exports.hashPassword = async(password) => {
    try {
      const saltRounds = 10;
      const genSalt =  await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, genSalt)
      return hashedPassword
    } catch (error) {
        console.log(error);
    }
};
exports.checkUserPassword = async(email , password) => {
    try {
      const findUser = await UserModel.findOne({ $or:[{ "email":email }] , active:true , deleted:false  }).select('+password');
      if(!findUser){
        return {
          message:"Invalid username or password",
          status:false
        }
      }
      const match = await bcrypt.compare(password,findUser.password);
      if(match) {
          const userId = findUser._id.toString();
          return {
            userId:userId,
            status:true,
          }
      }else{
          return {
              message:"Invalid username or password",
              status:false
          }
      }
    } catch (error) {
        console.log(error);
        return {
            check:false
        }
    }
}

exports.signTokenKey = async(payload) => {
  try {
    const user = await UserModel.findById(userId)
    const token = await fastify.jwt.sign({ payload:user }, PRIVATE_KEY, { algorithm: 'ES512' , expiresIn:'60m' });
    const refreshToken  = await fastify.jwt.sign({ payload:user }, PRIVATE_KEY, { algorithm: 'ES512' , expiresIn:'5d' });
    return {
      token,
      refreshToken,
    }
  } catch (error) {
      console.log(error);
  }
};
exports.refreshToken = async(refreshToken) => {
  let success = false
  let message = '' 
  try {    
      const decoded = jwt.verify(refreshToken, publicKey, { algorithms: ['ES512'] });
      const userId = decoded.payload._id
      return await signTokenKeyWithUserId(userId);
  } catch (err) {
      success = false, 
      message = "Invalid refresh token"
  }
  return {
      success,
      message
  }
};
exports.signTokenKeyWithUserId = async(userId) => {
  try {
      const user = await UserModel.findById(userId)
      const token =  jwt.sign({ payload:user }, PRIVATE_KEY, { algorithm: 'ES512' , expiresIn:'1d' });
      const refreshToken  =  jwt.sign({ payload:user }, PRIVATE_KEY, { algorithm: 'ES512' , expiresIn:'5d' });
      return {
        token,
        refreshToken,
      }
  } catch (error) {
      console.log(error);
      return {
          success:false
      }
  }
};

exports.paginate = async(model, query = {}, page = 1, limit = 10, options = {}) => {
  try {
    const skip = (page - 1) * limit;
    query = { ...query, active: true, delete: false };
    const documents = await model.find(query)
      .skip(skip)
      .limit(limit)
      .sort(options.sort || {})
      .populate(options.populate || '')
      .exec();

    const totalDoc = await model.countDocuments(query);
    const totalPages = Math.ceil(totalDoc / limit);

    return {
      pagination:{
        currentPage: page,
        totalPages,
        totalDoc,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      documents
    };
  } catch (error) {
    throw new Error(`Pagination error: ${error.message}`);
  }
}

exports.aggregatePaginate = async(model, pipeline = [], page = 1, limit = 10, options = {}) =>{
  try {
    const skip = (page - 1) * limit;
    const paginatedPipeline = [...pipeline,{ $skip: skip },{ $limit: limit }];
    const documents = await model.aggregate(paginatedPipeline).exec();
    const countPipeline = [...pipeline, { $count: 'totalDocuments' }];
    const countResult = await model.aggregate(countPipeline).exec();
    const totalDoc = countResult[0] ? countResult[0].totalDocuments : 0;
    const totalPages = Math.ceil(totalDoc / limit);
    return {
      pagination:{
        currentPage: page,
        totalPages,
        totalDoc,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      documents
    };
  } catch (error) {
    throw new Error(`Aggregation Pagination error: ${error.message}`);
  }
}

exports.getDateRange = async(startDate, endDate) => {
  const today = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(today.getMonth() - 3);

  return {
    startDate: startDate ? new Date(startDate) : defaultStartDate,
    endDate: endDate ? new Date(endDate) : today
  };
}

