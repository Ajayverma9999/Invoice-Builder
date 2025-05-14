import passport from 'passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import Joi from 'joi';

import User from '../features/User/user';
import { loginSchema } from './validators';

const passportLogin = new PassportLocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  async (req, username, password, done) => {
    
    // const { error } = Joi.validate(req.body, loginSchema);
    
    
    // if (error) {
    //   return done(null, false, { message: error.details[0].message });
    // }

    try {
      
      let filters = {};

      filters.$or = [
        { email: username }, 
        { phone: username }
      ]

      filters.softDelete = false;
      filters.status = true;


      const user = await User.findOne(filters).populate('role');

      if (!user) {
        return done(null, false, { message: 'Username does not exists.' ,status :0});
      }

      if(user.status == false ){
        return done(null, false, { message: 'You are blocked by admin.' ,status :0 }); 
      }

      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  },
);

passport.use(passportLogin);
