const User = require('../models/user.model');
const validator = require('validator');

module.exports.index = (request, response) => {
  response.json({
    message: "Hello World"
  });
}

module.exports.createUser = (req, res) => {
  User.findOne({
      $or: [{
          name: req.body.name
        },
        {
          email: req.body.email
        }
      ]
    })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.name === req.body.name) {
          return res.status(400).json({
            errors: {
              name: 'Username must be unique and at least 3 characters long.'
            }
          });
        } else if (existingUser.email === req.body.email) {
          return res.status(400).json({
            errors: {
              email: 'Email address must be unique and valid.'
            }
          });
        }
      }

      if (req.body.role === 'teacher') {
        User.findOne({
            role: 'teacher'
          })
          .then(existingTeacher => {
            if (existingTeacher) {
              return res.status(400).json({
                errors: {
                  role: 'There can only be one of us, prepare to die.'
                }
              });
            }
            User.create(req.body)
              .then(user => res.json(user))
              .catch(err => {
                if (err.name === 'ValidationError') {
                  const validationErrors = Object.values(err.errors).map(error => error.message);
                  return res.status(400).json({
                    errors: validationErrors
                  });
                }
                console.error(err);
                res.status(500).json({
                  message: 'Internal server error'
                });
              });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({
              message: 'Internal server error'
            });
          });
      } else {
        User.create(req.body)
          .then(user => res.json(user))
          .catch(err => {
            if (err.name === 'ValidationError') {
              const validationErrors = Object.values(err.errors).map(error => error.message);
              return res.status(400).json({
                errors: validationErrors
              });
            }
            console.error(err);
            res.status(500).json({
              message: 'Internal server error'
            });
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: 'Internal server error'
      });
    });
}

module.exports.getAllUsers = (request, response) => {
  User.find({})
    .then(users => {
      response.json(users);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({
        message: 'Internal server error'
      });
    });
}

module.exports.getUser = (request, response) => {
  User.findOne({
      _id: request.params.id
    })
    .then(user => {
      if (!user) {
        return response.status(404).json({
          message: 'User not found'
        });
      }
      response.json(user);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({
        message: 'Internal server error'
      });
    });
}

module.exports.updateUser = (request, response) => {
  const {
    id
  } = request.params;
  const {
    name,
    email,
    password,
    imgUrl,
    role,
  } = request.body;


  User.findById(id)
    .then((userBeingUpdated) => {
      if (!userBeingUpdated) {
        return response.status(404).json({
          message: 'User not found'
        });
      }

      if (name && name.length < 3) {
        return response.status(400).json({
          errors: {
            name: 'Name must be at least 3 characters long.',
          },
        });
      }

      if (name !== userBeingUpdated.name || email !== userBeingUpdated.email) {
        User.findOne({
          $or: [{
            name
          }, {
            email
          }],
          _id: {
            $ne: id
          }, // Exclude the current user being updated
        }).then((existingUser) => {
          if (existingUser) {
            const errors = {};

            if (existingUser.name === name) {
              errors.name = 'Name must be unique.';
            }

            if (existingUser.email === email) {
              errors.email = 'Email must be unique.';
            }

            if (Object.keys(errors).length > 0) {
              return response.status(400).json({
                errors
              });
            }
          }


          if (role === 'teacher') {
            User.findOne({
                role: 'teacher',
                _id: {
                  $ne: id
                }
              }) 
              .then((existingTeacher) => {
                if (existingTeacher) {
                  return response.status(400).json({
                    errors: {
                      role: 'There can only be one teacher.',
                    },
                  });
                }

                if (password && password.length < 8) {
                  return response.status(400).json({
                    errors: {
                      password: 'Password must be at least 8 characters long.',
                    },
                  });
                }

                if (imgUrl && !validator.isURL(imgUrl, {
                    protocols: ['http', 'https'],
                    require_protocol: true
                  })) {
                  return response.status(400).json({
                    errors: {
                      imgUrl: 'Invalid profile picture URL.',
                    },
                  });
                }


                User.findByIdAndUpdate(id, request.body, {
                    new: true
                  })
                  .then((updatedUser) => {
                    if (!updatedUser) {
                      return response.status(404).json({
                        message: 'User not found'
                      });
                    }
                    response.json(updatedUser);
                  })
                  .catch((err) => {
                    console.error(err);
                    response.status(500).json({
                      message: 'Internal server error'
                    });
                  });
              })
              .catch((err) => {
                console.error(err);
                response.status(500).json({
                  message: 'Internal server error'
                });
              });
          } else {

            if (password && password.length < 8) {
              return response.status(400).json({
                errors: {
                  password: 'Password must be at least 8 characters long.',
                },
              });
            }

            if (imgUrl && !validator.isURL(imgUrl, {
                protocols: ['http', 'https'],
                require_protocol: true
              })) {
              return response.status(400).json({
                errors: {
                  imgUrl: 'Invalid profile picture URL.',
                },
              });
            }


            User.findByIdAndUpdate(id, request.body, {
                new: true
              })
              .then((updatedUser) => {
                if (!updatedUser) {
                  return response.status(404).json({
                    message: 'User not found'
                  });
                }
                response.json(updatedUser);
              })
              .catch((err) => {
                console.error(err);
                response.status(500).json({
                  message: 'Internal server error'
                });
              });
          }
        });
      } else {

        if (role === 'teacher') {
          User.findOne({
              role: 'teacher',
              _id: {
                $ne: id
              }
            })
            .then((existingTeacher) => {
              if (existingTeacher) {
                return response.status(400).json({
                  errors: {
                    role: 'There can only be one teacher.',
                  },
                });
              }


              if (password && password.length < 8) {
                return response.status(400).json({
                  errors: {
                    password: 'Password must be at least 8 characters long.',
                  },
                });
              }

              if (imgUrl && !validator.isURL(imgUrl, {
                  protocols: ['http', 'https'],
                  require_protocol: true
                })) {
                return response.status(400).json({
                  errors: {
                    imgUrl: 'Invalid profile picture URL.',
                  },
                });
              }


              User.findByIdAndUpdate(id, request.body, {
                  new: true
                })
                .then((updatedUser) => {
                  if (!updatedUser) {
                    return response.status(404).json({
                      message: 'User not found'
                    });
                  }
                  response.json(updatedUser);
                })
                .catch((err) => {
                  console.error(err);
                  response.status(500).json({
                    message: 'Internal server error'
                  });
                });
            })
            .catch((err) => {
              console.error(err);
              response.status(500).json({
                message: 'Internal server error'
              });
            });
        } else {

          if (password && password.length < 8) {
            return response.status(400).json({
              errors: {
                password: 'Password must be at least 8 characters long.',
              },
            });
          }

          if (imgUrl && !validator.isURL(imgUrl, {
              protocols: ['http', 'https'],
              require_protocol: true
            })) {
            return response.status(400).json({
              errors: {
                imgUrl: 'Invalid profile picture URL.',
              },
            });
          }


          User.findByIdAndUpdate(id, request.body, {
              new: true
            })
            .then((updatedUser) => {
              if (!updatedUser) {
                return response.status(404).json({
                  message: 'User not found'
                });
              }
              response.json(updatedUser);
            })
            .catch((err) => {
              console.error(err);
              response.status(500).json({
                message: 'Internal server error'
              });
            });
        }
      }
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({
        message: 'Internal server error'
      });
    });
};


module.exports.deleteUser = (request, response) => {
  User.findOneAndDelete({
      _id: request.params.id
    })
    .then(deletedUser => {
      if (!deletedUser) {
        return response.status(404).json({
          message: 'User not found'
        });
      }

      if (deletedUser.role === 'teacher') {
        User.findOneAndUpdate({
            _id: {
              $ne: deletedUser._id
            },
            role: 'student'
          }, {
            role: 'teacher'
          }, {
            new: true
          })
          .then(newTeacher => {
            if (newTeacher) {
              response.json(newTeacher);
            } else {
              response.status(400).json({
                message: 'No eligible users to assign as a teacher'
              });
            }
          })
          .catch(err => {
            console.error(err);
            response.status(500).json({
              message: 'Internal server error'
            });
          });
      } else {
        response.json({
          message: 'User deleted successfully'
        });
      }
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({
        message: 'Internal server error'
      });
    });
}
