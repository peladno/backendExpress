const contenedorMongo = require("../../contenedores/mongoDB");
const UserModel = require("../../model/login.model");

class UserDaoMongo extends contenedorMongo {
  constructor() {
    super(UserModel);
  }
}

module.exports = UserDaoMongo;