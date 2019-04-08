require("dotenv").config();
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const user = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "must has email"]
  },
  password: {
    type: String,
    required: [true, "fill your password"]
  },
  name: {
    type: String,
    required: [true, "must fill your name"]
  },
  task: [{ type: Schema.Types.ObjectId, ref: "Todo" }]
});

user.pre("save", function(next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(+process.env.SALT, function(err, salt) {
    if (err) next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// user.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

const todo = new Schema({
  owned_id: { type: Schema.Types.ObjectId, ref: "User" },
  task: {
    type: String,
    required: [true, "please fill your taks"]
  },
  done: { type: Boolean, default: false }
});

const User = mongoose.model("User", user);
const Todo = mongoose.model("Todo", todo);

module.exports = { User, Todo };
