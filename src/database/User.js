var schems = require("mongodb");

var Schema = schems.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});
var Auth = (module.exports = schems.model("auth", Schema));
module.exports.get = function (callback, limit) {
  Auth.find(callback).limit(limit);
};
