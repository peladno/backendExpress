const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const config = require("../../config");
const URL = config.mongoLocal.connection;
const product = require("../../model/product.model");

mongoose
  .connect(URL)
  .then(console.log("Base de datos Mongoose conectada"))
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

const getAll = async () => {
  try {
    const searched = await product.find();
    return searched;
  } catch (err) {
    console.log(err);
  }
};

const save = async (obj) => {
  const newProduct = new product(obj);
  const saved = await newProduct.save();
  return saved;
};

const getByID = async (id) => {
  try {
    const search = await product.find({ _id: new ObjectId(id) });
    if (search.length === 0) {
      return { error: "product not found" };
    } else {
      return search;
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await product.deleteOne({ _id: new ObjectId(id) });
    if (deleted.length === 0) {
      return { error: "product not found" };
    } else {
      return deleted;
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteAll = async () => {
  try {
    const deleted = await product.deleteMany({});
    if (deleted.length === 0) {
      return { error: "product not found" };
    } else {
      return deleted;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getAll, save, deleteAll, deleteById, getByID };
