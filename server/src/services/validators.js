import Joi from 'joi';

// Login validation
export const loginSchema = Joi.object().keys({
  password: Joi.string().trim().required(),
  appversion: Joi.string().trim()
});


// Add user validation
export const addUserSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  email: Joi.string().email(),
  phone: Joi.required(),
  password: Joi.string().trim().required()

}).options({ allowUnknown: true });


export const userSchema = Joi.object().keys(
  {
    provider: Joi.string().default('phone'),
    firstName: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string().required(),
    phone: Joi.string().required().trim(),
    email: Joi.string().required().trim(),
    wallet: Joi.string().default(0),
    role: Joi.string(),
    address: Joi.object(),
    image: Joi.string(),
    userPermission: Joi.array()
  })
export const categorySchema = Joi.object().keys({
  slug: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  description: Joi.string(),
  image: Joi.string(),
  parent: Joi.string().default(null),
  showinmenu: Joi.string(),
})

export const couponsSchema = Joi.object().keys(
  {
    code: Joi.string().required(),
    type: Joi.string().default("amount"),
    description: Joi.string(),
    categories: Joi.string().required(),
    products: Joi.string().required(),
    users: Joi.string().required(),
    used: Joi.number().default(0),
    limit: Joi.number().default(0),
    cartValue: Joi.number().default(0),
    amount: Joi.string().required(),
    validupto: Joi.date(),
  }
)

export const attributeSchema = Joi.object().keys(
  {
    name: Joi.string().required(),
    description: Joi.string(),
    slug: Joi.string(),
  }
)

export const bannerSchema = Joi.object().keys(
  {
    title: Joi.string(),
    description: Joi.string(),
    button: Joi.string().default(''),
    buttonLink: Joi.string().default(''),
    image: Joi.string().required(),
    slug: Joi.string(),
  }
)

export const emailSchema = Joi.object().keys(
  {
    subject: Joi.string(),
    description: Joi.string(),
    slug: Joi.string(),
  }
)

export const productSchema = Joi.object().keys(
  {
    name: Joi.string().required(),
    slug: Joi.string().required().lowercase(),
    sku: Joi.string().required().lowercase(),
    attributes: Joi.string(),
    description: Joi.string().default(''),
    showsimilarproductions: Joi.string().default(true),
    tax_class: Joi.string(),
    categories: Joi.string(),
    brand: Joi.string(),
    tags: Joi.string(),
    mrp: Joi.number(),
    sale: Joi.number(),
    price: Joi.number(),
    minqty: Joi.number(),
    maxqty: Joi.number(),
    weight: Joi.number(),
    productType: Joi.string(),
    productOptions: Joi.array(),
    quantity: Joi.number().default(0),
    warranty: Joi.string(),
    warranty_procedure: Joi.string(),
    images: Joi.array(),
    metaTitle: Joi.string(),
    metaDescription: Joi.string(),
    metaTags: Joi.string(),
    metaSchema: Joi.string(),
    hotSelling: Joi.boolean(),
    avgRating: Joi.number().default(0),
    usersRating: Joi.number().default(0),
  }
)

export const orderValidation = Joi.object().keys(
  {
    items: Joi.array().required(),
    totalmrpprice: Joi.number().required(),
    totalsaleprice: Joi.number().required(),
    mode: Joi.string().trim().required(),
    totalquantity: Joi.number().required(),
    shippingAddress: Joi.object().required()
  }
)
// Add game validation
export const gameSchema = Joi.object().keys({
  name: Joi.string().trim().required(),
  status: Joi.boolean().required(),
});

// Update game status
export const updateStatus = Joi.object().keys({
  status: Joi.boolean().required(),
});

// Add betting type
export const addBettingType = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string().required(),
  winning_x: Joi.number().required(),
  game: Joi.string().required(),
  status: Joi.boolean().required()
});

// Update betting type
export const updateBettingType = Joi.object().keys({
  description: Joi.string(),
  winning_x: Joi.number(),
  status: Joi.boolean()
});

// Update betting type
export const updateBetting = Joi.object().keys({
  token: Joi.array(),
  amount: Joi.number(),
});


// Insert betting
export const insertRouletteBetting = Joi.object().keys({
  user: Joi.string(),// temp added

  name: Joi.string().trim().required(),
  amount: Joi.number().required().min(1),
  numbers: Joi.array().required(),
  betting_type: Joi.string().trim().required(),
  tokens: Joi.array()
});

// Add user validation
export const addUsersSchema = Joi.object().keys({
  username: Joi.string().min(5).max(50).required(),
  password: Joi.string().min(5).max(255).required(),
  phone: Joi.string().min(10).max(10).required(),
  email: Joi.string().min(5).max(50)
}).options({ allowUnknown: true });