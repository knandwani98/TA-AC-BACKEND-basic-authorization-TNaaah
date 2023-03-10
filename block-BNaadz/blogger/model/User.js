var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 6, maxlength: 10 },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.password || this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      this.password = hashed;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.compare = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

module.exports = mongoose.model("User", userSchema);
