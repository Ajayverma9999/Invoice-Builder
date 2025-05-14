import passport from 'passport';
import User from '../features/User/user';
import jwt from 'jsonwebtoken';

const requireLocalAuth = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json(info);
    }
    req.user = user;
    next();
  })(req, res, next);
};

const requireUserAuth = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

    let token = req.headers['x-auth-token'];
    let decoder = jwt.verify(token, secretOrKey);
    if (decoder) {
    let reqUser = await User.findById({_id:decoder.id},{role:1}).populate('role')
      if (reqUser){
        req.user = reqUser;
        next();
      }
      else{
        next(err)
      }
    }
  } catch (err) {
    logger.error(err.message, {metadata: err});
  }
}


module.exports = { requireLocalAuth, requireUserAuth };
