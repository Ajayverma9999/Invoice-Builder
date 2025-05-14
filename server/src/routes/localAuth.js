import { response, Router } from 'express';
import Joi from 'joi';
import faker from 'faker';
import { requireLocalAuth } from '../middleware/requireLocalAuth';
import { registerSchema } from '../services/validators';
import requireJwtAuth from '../middleware/requireJwtAuth';
import 'dotenv/config'
import { checkpermission, apiReq } from '../helper/common';
import logger from '../services/logger';
import User from '../features/User/user';

const router = Router();

router.post('/login', requireLocalAuth, (req, res) => {

  const token = req.user.generateJWT((req.body?.appversion ? req.body.appversion : ''));
  let me = req.user.toJSON();
  me.token = token;
  let headers = req.headers;

  if (!me.status) {
    return res.status(500).json({
      'status': 0,
      'message': "You can not login. Contact with admin."
    });
  }

  if (headers['user-agent'] !== undefined) {
    if (headers['user-agent'] == 'game_user' && me.role.id != 3) {

      return res.status(500).json({
        'status': 0,
        'message': "Only Customers can login in game."
      });
    }
  }

  if ((me.role.slug == 'admin') || (me.role.slug == 'customer')) {
    response.message = "Successfully Login";
    response.status = 1;
  }
  res.json({ token: token, me: me, message: response.message, status: response.status });

});

// logout
router.post('/logout', requireJwtAuth, async (req, res) => {
  

  let headers = req.headers;

  if (headers['x-auth-token'] !== undefined) {
    req.user.token = '';
  }

  await req.user.save();
  // req.logout();
  res.json({
    'status': 1,
    'message': "Logged Out Successfully."
  });
});

export default router;
