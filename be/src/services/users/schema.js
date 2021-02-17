const { Schema, model } = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
  },
  { timestamps: true }
)

UserSchema.statics.findByCredentials = async function (username, password) {
  //find if that user exists in dv
  const user = await this.findOne({ username })

  if (user) {
    // compare the provieded pass with the one in db
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) return user
    else return null
  } else return null
}

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.pre("save", async function (next) {
  const user = this
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  next()
})

module.exports = model("User", UserSchema)
