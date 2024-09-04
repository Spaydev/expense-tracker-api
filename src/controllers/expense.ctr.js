const ExpenseModel = require("../models/expense.model");
const { paginate  ,getDateRange, aggregatePaginate} = require("../utils/common.utils");
const { default: mongoose } = require('mongoose');
const { ObjectId } = mongoose.Types
exports.getOneById = async (req, reply) => {
  try {
    const result =  await ExpenseModel.findById(req.params.id);
    return reply.code(200).send({ 
      success:true,
      data: result
    }); 
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
exports.getMeExpense = async (req, reply) => {
  try {   
    const userId = req.user.payload._id
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let { startDate, endDate } = await getDateRange(req.query.startDate, req.query.endDate);
    const pipline = [
      {
        '$match': {
          'userId':new  ObjectId(userId), 
          'active': true, 
          'deleted': false,
          'date': {
            '$gt': startDate, 
            '$lt': endDate
          }
        }
      },{
        '$lookup': {
          'from': 'categories', 
          'localField': 'categoryId', 
          'foreignField': '_id', 
          'as': 'category'
        }
      }, {
        '$unwind': {
          'path': '$category', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'title': {
            '$first': '$title'
          }, 
          'amount': {
            '$first': '$amount'
          }, 
          'date': {
            '$first': '$date'
          }, 
          'notes': {
            '$first': '$notes'
          }, 
          'userId': {
            '$first': '$userId'
          }, 
          'category': {
             '$first': '$category'
          }, 
          'active': {
            '$first': '$active'
          }, 
          'deleted': {
            '$first': '$deleted'
          }, 
          'createdAt': {
            '$first': '$createdAt'
          }, 
          'updatedAt': {
            '$first': '$updatedAt'
          }
        }
      },{
        '$sort': {
          'date': -1
        }
      }
    ]
    const { pagination , documents } = await aggregatePaginate(ExpenseModel, pipline, page, limit, {});
    return reply.code(200).send({ 
      success:true,
      pagination,
      data: documents
    });
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
exports.create = async (req, reply) => {
  try {   
    req.body.userId = req.user.payload._id
    const created = await ExpenseModel.create(req.body);
    return reply.code(200).send({ 
      success:true,
      data: created,
      message:"ok"
    });
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
exports.update = async (req, reply) => {
  try {   
    const updated = await ExpenseModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true } );
    return reply.code(200).send({ 
      success:true,
      data: updated
    }); 
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
exports.delete = async (req, reply) => {
  try {
    const deleted = await ExpenseModel.findByIdAndUpdate(req.params.id, { $set:{ active:false , deleted:true }}, { new: true, runValidators: true } );
    return reply.code(200).send({ 
      success:true,
      data: deleted
    });
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
exports.summaryOfEexpenses = async (req, reply) => {
  try {   
    const userId = req.user.payload._id
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let { startDate, endDate } = await getDateRange(req.query.startDate, req.query.endDate);    
    const pipline = [
      {
        '$match': {
          'userId': new ObjectId(userId), 
          'active': true, 
          'deleted': false,
          'date': {
            '$gt': startDate, 
            '$lt': endDate
          }
        }
      }, {
        '$lookup': {
          'from': 'categories', 
          'localField': 'categoryId', 
          'foreignField': '_id', 
          'as': 'category'
        }
      }, {
        '$unwind': {
          'path': '$category', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': '$category._id', 
          'category': {
            '$first': '$category'
          }, 
          'totalAmount': {
            '$sum': '$amount'
          }
        }
      }, {
        '$sort': {
          'totalAmount': -1
        }
      }
    ]
    
    const { pagination , documents } = await aggregatePaginate(ExpenseModel, pipline, page, limit, {});
    return reply.code(200).send({ 
      success:true,
      pagination,
      data: documents
    });
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

