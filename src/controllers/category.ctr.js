const CategoryModel = require("../models/category.model");
const { paginate } = require("../utils/common.utils");

exports.getOneById = async (req, reply) => {
  try { 
    const result =  await CategoryModel.findById(req.params.id);
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
exports.getMany = async (req, reply) => {
  try {   
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = {}
    const { pagination , documents } = await paginate(CategoryModel, query, page, limit, {});
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
    const created = await CategoryModel.create(req.body);
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
    const updatedCate = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true } );
    return reply.code(200).send({ 
      success:true,
      data: updatedCate
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
    const updatedCate = await CategoryModel.findByIdAndUpdate(req.params.id, { $set:{ active:false , deleted:true }}, { new: true, runValidators: true } );
    return reply.code(200).send({ 
      success:true,
      data: updatedCate
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