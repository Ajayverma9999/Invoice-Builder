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

  // if( me.token && me.role.id != 1) {
  //   return res.status(500).json({
  //                'status' : 0,
  //                'message' : "Already login in other system."
  //              });  
  // }


  // if(me.role.id == 3 && me.token ) {
  //   let updateTime = new Date(me.updatedAt);
  //   let currentTime = new Date();

  //       let diffInSeconds = ( currentTime - updateTime) / 1000;

  //       if( diffInSeconds < (60*30) ) {
  //         return res.status(500).json({
  //           'status' : 0,
  //           'message' : "Already login in other system."
  //         });  
  //       }
  // }

  if ((me.role.slug == 'admin') || (me.role.slug == 'customer')) {
    response.message = "Successfully Login";
    response.status = 1;
  }
  return res.json({ token: token, me: me, message: response.message, status: response.status });

});



//Print Game Login

router.post('/login/print', requireLocalAuth, (req, res) => {
  const token = req.user.generateJWT((req.body?.appversion ? req.body.appversion : ''));
  let me = req.user.toJSON();
  me.token = token;
  const lcgame = process.env.PRINT_LC;
  const fiftycards = process.env.CARDSFIFTYTWO_GAME_PRINT;
  const spinToWinGame = process.env.SPIN_TO_WIN_GAME_ID_PRINT;

  let headers = req.headers;

  if (!me.status) {
    return res.status(500).json({
      'status': 0,
      'message': "You can not login. Contact with admin."
    });
  }

  let checked = 1;
  if (me.games.includes(lcgame) || me.games.includes(fiftycards) || me.games.includes(spinToWinGame)) {
    checked = 0;
  }

  if (checked) {
    return res.status(500).json({
      'status': 0,
      'message': "You are not Allowed to play. Please Contact Admin"
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

  res.json({ token, me });
});

/*
router.post('/register', async (req, res, next) => {
  const { error } = Joi.validate(req.body, registerSchema);
  if (error) {
    return res.status(422).send({ message: error.details[0].message });
  }

  const { email, password, name, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send({ message: 'Email is in use' });
    }

    try {
      const newUser = await new User({
        provider: 'email',
        email,
        password,
        username,
        name,
        avatar: faker.image.avatar(),
      });

      newUser.registerUser(newUser, (err, user) => {
        if (err) throw err;
        res.json({ message: 'Register success.' }); // just redirect to login
      });
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
});


*/

// logout
router.post('/logout', requireJwtAuth, (req, res) => {

  let checkWeb = 0;

  let headers = req.headers;

  if (headers['userlogin'] !== undefined) {
    if (headers['userlogin'] == 'weblogin') {
      checkWeb = 1;

    }
  }

  if (checkWeb) {
    req.user.webtoken = '';
  } else {
    req.user.token = '';
  }

  req.user.save();
  // req.logout();
  return res.json({
    'status': 1,
    'message': "Logged Out Successfully."
  });
});


//  pcdeal login api 

router.post('/pcdeal/login', requireJwtAuth, async (req, res) => {
  let response = {
    message: "issue in pcdeal login",
    status: 0
  }
  try {
    let url = "https://www.pcdealsindia.com/api/processlogin";

    let data = {
      "email": req.body.email,
      "password": req.body.password
    }

    let resp = await apiReq(url, 'POST', JSON.stringify(data))
    if (resp.data.data.length) {
      let connected = await User.findOne({ pcdealUserId: resp.data.data[0]?.customers_id, pcdealUserEmail: resp.data.data[0]?.email })
      if (!connected) {

        let user = await User.updateOne({ _id: req.user.id }, { $set: { pcdealUserId: resp.data.data[0]?.customers_id, pcdealUserEmail: resp.data.data[0]?.email } })
        if (user.n) {
          response.message = "connect With Pcdeals"
          response.status = 1
        }
      } else {
        response.message = `${resp.data.data[0]?.customers_id} Already connected`
        response.status = 0
      }
    } else {
      response.message = "Invalid User"
      response.status = 0
    }
    return res.json(response)
  }
  catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    if ((Object.values(err)[1] == 'MongoError') && (Object.values(err)[3] == 11000) && ((Object.values(err)[4].email == 1))) {
      let value = Object.values(err)[5].email ? Object.values(err)[5].email : Object.values(err)[5].phone
      response.message = value + "\n already registered"
    }

    return res.json(response);

  }
})

router.post('/pcdeal/user/profile', requireJwtAuth, async (req, res) => {
  let response = {
    message: "issue in pcdeal user profile",
    status: 0
  }

  try {
    let url = "https://www.pcdealsindia.com/api/profile"
    let data = {
      "customers_id": req.user.pcdealUserId
    }

    let resp = await apiReq(url, 'GET', JSON.stringify(data))

    if (resp.data != null && resp.data.length || resp.data.data) {
      let data = {
        "firstname": resp.data?.data?.customers_firstname,
        "lastname": resp.data?.data?.customers_lastname,
        "phone": resp.data?.data?.customers_telephone,
        "dob": resp.data?.data?.customers_dob,
        "state": resp.data?.address_book?.entry_state,
        "city": resp.data?.address_book?.entry_city,
        "PinCode": resp.data?.address_book?.entry_postcode,
        "gstno": resp.data?.data?.gst_no,
        "entry_company": resp.data?.address_book?.entry_company
      }

      response.message = "successfully Fatch Address"
      response.status = parseInt(resp.data.success)
      response.address = data
    } else {
      response.status = 0
      response.message = "Address Not ound"
    }

    return res.json(response)
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;
  }
})


export default router;
