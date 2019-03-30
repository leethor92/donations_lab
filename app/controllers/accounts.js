<<<<<<< HEAD
'use strict';

const Boom = require('boom');
const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Accounts = {
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view('main', { title: 'Welcome to Donations' });
    }
  },
  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view('signup', { title: 'Sign up for Donations' });
    }
  },
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('signup', {
            title: 'Sign up error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = 'Email address is already registered';
          throw new Boom(message);
        }

        const hash = await bcrypt.hash(payload.password, saltRounds);

        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hash
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect('/home');
      } catch (err) {
        return h.view('signup', { errors: [{ message: err.message }] });
      }
    }
  },
  showLogin: {
    auth: false,
    handler: function(request, h) {
      return h.view('login', { title: 'Login to Donations' });
    }
  },
  login: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('login', {
            title: 'Sign in error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = 'Email address is not registered';
          throw new Boom(message);
        }
        if (!await user.comparePassword(password)) {
          const message = 'Password mismatch';
          throw new Boom(message);
        } else {
          request.cookieAuth.set({ id: user.id });
          return h.redirect('/home');
        }
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  showSettings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        return h.view('settings', { title: 'Donation Settings', user: user });
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('settings', {
            title: 'Update settings error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        bcrypt.hash(userEdit.password, saltRounds, function(err, hash) {
          user.password = hash;
        })
        await user.save();
        return h.redirect('/settings');
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },
  logout: {
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  }
};

module.exports = Accounts;
=======
'use strict';

const Accounts = {
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view('main', { title: 'Welcome to Donations' });
    }
  },
  showSignup: {
    handler: function(request, h) {
      return h.view('signup', { title: 'Sign up for Donations' });
    }
  },
  signup: {
    handler: function(request, h) {
      const user = request.payload;
      this.users[user.email] = user;
      this.currentUser = user;
      return h.redirect('/home');
    }
  },

  showLogin: {
    handler: function(request, h) {
      return h.view('login', { title: 'Login to Donations' });
    }
  },
  login: {
    handler: function(request, h) {
      const user = request.payload;
      if ((user.email in this.users) && (user.password === this.users[user.email].password)) {
        this.currentUser = this.users[user.email];
        return h.redirect('/home');
      }
      return h.redirect('/');
    }
  },
  logout: {
    handler: function(request, h) {
      return h.redirect('/');
    }
  }
};

module.exports = Accounts;
>>>>>>> 182f41e5dd3a29994700914bf4669b8399493433
