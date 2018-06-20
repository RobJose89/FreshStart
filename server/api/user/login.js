const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().required().error(() => ({ message: 'You must enter an email in the valid form eg name@domain.com' })),
  password: Joi.string().required().error(() => ({ message: 'You must enter a password' })),
});
class AuthError extends Error {}
module.exports = function userLogin({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, userLoginSchema)
      .then(({ email, password }) =>
        connectToMongo().then((db) =>
          db.collection('users')
            .findOne({ email: email.toLowerCase() })
              .then((data) => {
                if (data === null) {
                  throw new AuthError('User not found');
                }
                return data;
              })
              .then(({ _id, password: hashedPassword, isApi }) =>
                bcrypt.compare(password, hashedPassword)
                  .then((isMatching) => {
                    if (!isMatching) throw new AuthError('Passwords are not matching');
                  })
                  .then(() =>
                    db.collection('users').updateOne(
                      { _id: ObjectId(_id) },
                      { $set: { lastLogin: new Date() } }
                    )
                  )
                  .then(() =>
                    res.json({
                      code: 200,
                      message: 'Signing in successfully',
                      response: {
                        token: jwt.sign(
                          {
                            isApi,
                          },
                          process.env.API_KEY,
                          {
                            expiresIn: isApi ? '1h' : '1d',
                          }
                        ),
                      },
                    })
                  )
              )
          )
      )
      .catch((err) => {
        if (err instanceof AuthError) {
          res.json({
            code: 401,
            error: 'You have entered a bad email or password. Check the data.',
          });
          return;
        }
        throw err;
      })
      .catch(handleError(res));
};
