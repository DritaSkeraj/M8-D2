const UserModel = require("./users/schema")
const atob = require("atob")

const basicAuthMiddleware = async (req, res, next) => {
  // the request should have authorization header
  if (!req.headers.authorization) {
    const error = new Error("Please provide a basic authentication")
    error.httpStatusCode = 401
    next(error)
  } else {
    const [username, password] = atob(
      // we're destructuring username and pass from req
      // Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
      req.headers.authorization.split(" ")[1]
    ).split(":")

    const user = await UserModel.findByCredentials(username, password)
    if (!user) {
      const error = new Error("Wrong credentials provided")
      error.httpStatusCode = 401
      next(error)
    } else {
      // lets us access the user from every route 
      // where this middleware is used by saying req.user
      // very handy ;)
      req.user = user
    }

    next()
  }
}

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    const err = new Error("Admins Only!")
    err.httpStatusCode = 403
    next(err)
  }
}

module.exports = {
  basic: basicAuthMiddleware,
  adminOnly: adminOnlyMiddleware,
}
