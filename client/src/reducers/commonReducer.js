import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  allApi,
  multiFileUpload,
  messages,
  postApi,
  postApiFile,
} from "../helpers/apiStructure";
import { coupons, rewardSiteBaseUrl } from "../const";

const initialState = {
  localStorageCartItem: !!localStorage.getItem("cartItem")
    ? JSON.parse(localStorage.getItem("cartItem"))
    : [],
  getDashBoardData: [],
  getHomePageSettingList: [],
  getAttributesData: [],
  getCheckoutDeatilsData: [],
  getUsersData: [],
  usersBlank: [],
  getCouponsData: [],
  applyCouponData: [],
  dashboardRecordData: [],
  getCategoriesData: [],
  getServicesData: [],
  getServicesFrontEndData:[],
  getSocialMediaSettingsData: [],
  getBannersData: [],
  getFaqData: [],
  getSettingsData: [],
  getSettingData: [],
  getBrandsData: [],
  getBrandsFrontEndData: [],
  getReviewsData: [],
  getTaxgstsData: [],
  getTransactionsData: [],
  getZipcodesData: [],
  getCartlistData: [],
  getProductsData: [],
  getSingleProductData: [],
  getNewProductData: [],
  productsListData: [],
  plansListData:[],
  plansData:[],
  productsBlank: [],
  productRatingData: [],
  getAllStatesList: [],
  fetchAddressData: [],
  getCustEnblProductsList: [],
};

var baseUrl = "http://localhost:3000";

if (window.location.host) {
  baseUrl = window.location.protocol + "//" + window.location.host;
}
//reset products list
export const resetProductList = createAsyncThunk(
  "resetProductList",
  async (data) => {
    return [];
  }
);
//resetplans list
export const resetplansList = createAsyncThunk(
  "resetplansList",
  async (data) => {
    return [];
  }
); 
export const resetplans = createAsyncThunk(
  "resetplans",
  async (data) => {
    return [];
  }
); 


//resetUser list
export const resetUsersList = createAsyncThunk(
  "resetUsersList",
  async (data) => {
    return [];
  }
);
export const getDashBoard = createAsyncThunk("getDashBoard", async (data) => {
  const result = await allApi(`${baseUrl}/api/admin/dashboard`, "get");
  return result;
});
//Home page settings
export const getHomePageSetting = createAsyncThunk(
  "getHomePageSetting",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/home`, "get");
    return result;
  }
);
// social media settings
export const getSocialMediaSettings = createAsyncThunk(
  "getSocialMediaSettings",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/social`, "post", body);
    return result;
  }
);
export const updateSocialMediaSettings = createAsyncThunk(
  "updateSocialMediaSettings",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/socialmedia/edit`,
      "post",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
//admin dashboard
export const dashboardRecord = createAsyncThunk(
  "dashboardRecord",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/counter/reports`,
      "post",
      body
    );
    return result;
  }
);
// users manage
export const getUsers = createAsyncThunk("getUsers", async (body) => {
  const result = await postApi(`${baseUrl}/api/users`, "post", body);
  return result;
});
export const getUsersExport = createAsyncThunk("getUsersExport", async (body) => {
  const result = await postApi(`${baseUrl}/api/users/forcsv`, "post", body);
  return result;
});




// loginwith gmail
export const logingmail = createAsyncThunk("logingmail", async (body) => {
  const result = await postApi(`${baseUrl}/api/genearte/otp`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const verifyOTPgmail = createAsyncThunk("verifyOTPgmail", async (body) => {
  const result = await postApi(`${baseUrl}/api/verify/otp`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});

//login with google
export const loginWithGoogle = createAsyncThunk("loginWithGoogle", async (body) => {
  const result = await postApi(`${baseUrl}/auth/google`, "post", body);
  return result;
});
// Login
export const Login = createAsyncThunk("Login", async (body) => {
  const result = await postApi(`${baseUrl}/api/user/otp/signup`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
//forgot password
export const sendVerificationCode = createAsyncThunk(
  "sendVerificationCode",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/email/otp`, "post", body);
    await messages(result?.message, result?.status);
    return result;
  }
);
export const verifyOTP = createAsyncThunk("verifyOTP", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/user/forgetPassword`,
    "post",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});
export const passwordChanges = createAsyncThunk(
  "passwordChanges",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/user/password/change`,
      "post",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
//upload products
export const uploadProducts = createAsyncThunk(
  "uploadProducts",
  async (body) => {
    const result = await postApiFile(`${baseUrl}/api/product/upload`, "post", body);
    await messages(result?.message, result?.status);
    return result;
  }
);
//upload Users
export const uploadUsers = createAsyncThunk(
  "uploadUsers",
  async (body) => {
    const result = await postApiFile(`${baseUrl}/api/users/upload`, "post", body);
    await messages(result?.message, result?.status);
    return result;
  }
);
export const addFaq  = createAsyncThunk("addFaq ", async (body) => {
  const result = await postApi(`${baseUrl}/api/faq/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});

export const getFaq = createAsyncThunk("getFaq", async (data) => {
const result = await allApi(`${baseUrl}/api/faq`, "get");
return result;
});
export const deleteFaq = createAsyncThunk("deleteFaq", async (data) => {
const result = await allApi(`${baseUrl}/api/faq/${data}`, "delete");
await messages(result?.message, result?.status);
return result;
});
export const updateFaq = createAsyncThunk("updateFaq", async (body) => {
const result = await postApi(
  `${baseUrl}/api/faq/edit/${body?.id}`,
  "put",
  body
);
await messages(result?.message, result?.status);
return result;
});


// Banners manage
export const addBanner = createAsyncThunk("addBanner", async (body) => {
  const result = await postApiFile(`${baseUrl}/api/banner/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getBanners = createAsyncThunk("getBanners", async (data) => {
  const result = await allApi(`${baseUrl}/api/banners`, "get");
  return result;
});
export const deleteBanner = createAsyncThunk("deleteBanner", async (data) => {
  const result = await allApi(`${baseUrl}/api/banner/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
export const updateBanner = createAsyncThunk("updateBanner", async (body) => {
  const result = await postApiFile(
    `${baseUrl}/api/banner/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});
// brands manage
export const addBrand = createAsyncThunk("addBrand", async (body) => {
  const result = await postApiFile(`${baseUrl}/api/brand/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getBrands = createAsyncThunk("getBrands", async (data) => {
  const result = await allApi(`${baseUrl}/api/brands`, "get");
  return result;
});
export const getBrandsFrontEnd = createAsyncThunk("getBrandsFrontEnd", async (data) => {
  const result = await allApi(`${baseUrl}/api/frontend/brands`, "get");
  return result;
}); 
export const deleteBrand = createAsyncThunk("deleteBrand", async (data) => {
  const result = await allApi(`${baseUrl}/api/brand/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
export const updateBrand = createAsyncThunk("updateBrand", async (body) => {
  const result = await postApiFile(
    `${baseUrl}/api/brand/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});



// plans 



export const CreatePlans = createAsyncThunk("CreatePlans", async (body) => {
  const result = await postApi(`${baseUrl}/api/plans/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const updateplans= createAsyncThunk("updateplans", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/plans/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});
// export const addProductImages = createAsyncThunk(
//   "addProductImages",
//   async (body) => {
//     const result = await multiFileUpload(
//       `${baseUrl}/api/product/updateimage`,
//       "post",
//       body
//     );
//     await messages(result?.message, result?.status);
//     result?.status === 1 && (window.location.href = baseUrl + `/product-list`);
//     result?.status === 1 && localStorage.removeItem("productId");
//     localStorage.removeItem("uploadProductimg");
//     localStorage.removeItem("newProductapiStatus");
//     return result;
//   }
// );

export const plans= createAsyncThunk("plans", async (body) => {
  const result = await postApi(`${baseUrl}/api/plans`, "post", body);
  return result;
});

export const plansList = createAsyncThunk("plansList", async (body) => {
  const result = await postApi(`${baseUrl}/api/backend/plans`, "post", body);
  return result;
});
export const plansExport = createAsyncThunk("plansExport", async (body) => {
  const result = await postApi(`${baseUrl}/api/plans`, "post", body);
  return result;
});
export const plansListExport = createAsyncThunk("productsListExport", async (body) => {
  const result = await postApi(`${baseUrl}/api/backend/plans`, "post", body);
  return result;
});
// export const similarproductions = createAsyncThunk(
//   "similarproductions",
//   async (body) => {
//     const result = await postApi(
//       `${baseUrl}/api/similarproductions`,
//       "post",
//       body
//     );
//     return result;
//   }
// );
export const deletePlans = createAsyncThunk("deletePlans", async (data) => {
  const result = await allApi(`${baseUrl}/api/plans/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});

// Create Product
export const CreateProduct = createAsyncThunk("CreateProduct", async (body) => {
  const result = await postApi(`${baseUrl}/api/product/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const updateProduct = createAsyncThunk("updateProduct", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/product/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});
export const addProductImages = createAsyncThunk(
  "addProductImages",
  async (body) => {
    const result = await multiFileUpload(
      `${baseUrl}/api/product/updateimage`,
      "post",
      body
    );
    await messages(result?.message, result?.status);
    result?.status === 1 && (window.location.href = baseUrl + `/product-list`);
    result?.status === 1 && localStorage.removeItem("productId");
    localStorage.removeItem("uploadProductimg");
    localStorage.removeItem("newProductapiStatus");
    return result;
  }
);
export const productsList = createAsyncThunk("productsList", async (body) => {
  const result = await postApi(`${baseUrl}/api/backend/products`, "post", body);
  return result;
});
export const productsListExport = createAsyncThunk("productsListExport", async (body) => {
  const result = await postApi(`${baseUrl}/api/products/forcsv`, "post", body);
  return result;
});
export const similarproductions = createAsyncThunk(
  "similarproductions",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/similarproductions`,
      "post",
      body
    );
    return result;
  }
);
export const deleteProduct = createAsyncThunk("deleteProduct", async (data) => {
  const result = await allApi(`${baseUrl}/api/product/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
//customize Offer
export const addUpdateCustomizeOffers = createAsyncThunk("addUpdateCustomizeOffers", async (body) => {
  const result = await postApi(`${baseUrl}/api/customize/offer/update`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getCustomizeOffers = createAsyncThunk("getCustomizeOffers", async (data) => {
  const result = await allApi(`${baseUrl}/api/customize/offers`, "get");
  return result;
});
// setting manage
export const addSetting = createAsyncThunk("addSetting", async (body) => {
  const result = await postApi(`${baseUrl}/api/setting/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getSettings = createAsyncThunk("getSettings", async (data) => {
  const result = await allApi(`${baseUrl}/api/settings`, "get");
  return result;
});
export const getSetting = createAsyncThunk("getSetting", async (body) => {
  const result = await postApi(`${baseUrl}/api/setting`, "post", body);
  return result;
});
export const getOpenSetting = createAsyncThunk("getOpenSetting", async (body) => {
  const result = await postApi(`${baseUrl}/api/settings/forcustomer`, "post", body);
  return result;
});
export const deleteSetting = createAsyncThunk("deleteSetting", async (data) => {
  const result = await allApi(`${baseUrl}/api/setting/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
export const updateSetting = createAsyncThunk("updateSetting", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/setting/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});
// Review manage
export const addReview = createAsyncThunk("addReview", async (body) => {
  const result = await postApi(`${baseUrl}/api/review/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
// export const getReviews = createAsyncThunk("getReviews", async (data) => {
//   const result = await allApi(`${baseUrl}/api/reviews`, "get");
//   return result;
// });
export const getReviews= createAsyncThunk("getReviews", async (body) => {
  const result = await postApi(`${baseUrl}/api/reviews`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const deleteReview = createAsyncThunk("deleteReview", async (data) => {
  const result = await allApi(`${baseUrl}/api/review/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
export const updateReview = createAsyncThunk("updateReview", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/review/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});
// taxgsts manage
export const addTaxgst = createAsyncThunk("addTaxgst", async (body) => {
  const result = await postApi(`${baseUrl}/api/taxgst/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getTaxgsts = createAsyncThunk("getTaxgsts", async (data) => {
  const result = await allApi(`${baseUrl}/api/taxgsts`, "get");
  return result;
});
export const deleteTaxgst = createAsyncThunk("deleteTaxgst", async (data) => {
  const result = await allApi(`${baseUrl}/api/taxgst/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
export const updateTaxgst = createAsyncThunk("updateTaxgst", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/taxgst/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});
// Transaction manage
export const addTransaction = createAsyncThunk(
  "addTransaction",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/transaction/add`,
      "post",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
export const getTransactions = createAsyncThunk(
  "getTransactions",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/transactions`, "get");
    return result;
  }
);
export const deleteTransaction = createAsyncThunk(
  "deleteTransaction",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/transaction/${data}`, "delete");
    await messages(result?.message, result?.status);
    return result;
  }
);
export const updateTransaction = createAsyncThunk(
  "updateTransaction",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/transaction/edit/${body?.id}`,
      "put",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
//checkout
export const getCheckoutDeatils = createAsyncThunk(
  "getCheckoutDeatils",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/checkout`, "get");
    return result;
  }
);
// cart manage
export const addCart = createAsyncThunk("addCart", async (body) => {
  const result = await postApi(`${baseUrl}/api/cart/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getCartlist = createAsyncThunk("getCartlist", async (data) => {
  const result = await allApi(`${baseUrl}/api/cartlist`, "get");
  return result;
});
export const deleteCart = createAsyncThunk("deleteCart", async (data) => {
  const result = await allApi(`${baseUrl}/api/cart/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
export const updateCart = createAsyncThunk("updateCart", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/cart/edit/${body?.id}`,
    "put",
    body
  );
  // await messages(result?.message, result?.status);
  return result;
});
export const emptyCartlist = createAsyncThunk("emptyCartlist", async (data) => {
  const result = await allApi(`${baseUrl}/api/cart/empty`, "get");
  return result;
});
// product wise rating
export const getProductRating = createAsyncThunk(
  "getProductRating",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/reviewbyproducts`,
      "post",
      body
    );
    return result;
  }
);
// Product manage
export const getProducts = createAsyncThunk("getProducts", async (body) => {
  const result = await postApi(`${baseUrl}/api/products`, "post", body);
  return result;
});
export const getSingleProduct = createAsyncThunk(
  "getSingleProduct",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/getproduct`, "post", body);
    return result;
  }
);
// zipcodes manage
export const addZipcode = createAsyncThunk("addZipcode", async (body) => {
  const result = await postApi(`${baseUrl}/api/zipcode/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getZipcodes = createAsyncThunk("getZipcodes", async (data) => {
  const result = await allApi(`${baseUrl}/api/zipcodes`, "get");
  return result;
});
// Categories manage  getServicesData
export const addCategorie = createAsyncThunk("addCategorie", async (body) => {
  const result = await postApiFile(`${baseUrl}/api/category/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getCategories = createAsyncThunk("getCategories", async (body) => {
  const result = await postApi(`${baseUrl}/api/categories`, "post", body);
  return result;
});
export const deleteCategorie = createAsyncThunk(
  "deleteCategorie",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/category/${data}`, "delete");
    await messages(result?.message, result?.status);
    return result;
  }
);
export const updateCategorie = createAsyncThunk(
  "updateCategorie",
  async (body) => {
    const result = await postApiFile(
      `${baseUrl}/api/category/edit/${body?.id}`,
      "put",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);

// coupons
export const addCoupon = createAsyncThunk("addCoupon", async (body) => {
  const result = await postApi(`${baseUrl}/api/coupon/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const applyCoupon = createAsyncThunk("applyCoupon", async (body) => {
  const result = await postApi(`${baseUrl}/api/coupon/apply`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getCoupons = createAsyncThunk("getCoupons", async (data) => {
  const result = await allApi(`${baseUrl}/api/coupons`, "get");
  return result;
});
export const deleteCoupon = createAsyncThunk("deleteCoupon", async (data) => {
  const result = await allApi(`${baseUrl}/api/coupon/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
export const updateCoupon = createAsyncThunk("updateCoupon", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/coupon/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});

// Services manage  

export const addServices = createAsyncThunk("addServices", async (body) => {
  const result = await postApiFile(`${baseUrl}/api/service/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getServices = createAsyncThunk("getServices", async (body) => {
  const result = await postApi(`${baseUrl}/api/service`, "get", body);
  return result;
});
export const getServicesFrontEnd = createAsyncThunk("getServicesFrontEnd", async (body) => {
  const result = await postApi(`${baseUrl}/api/frontend/service`, "get", body);
  return result;
});
export const deleteServices = createAsyncThunk(
  "deleteServices",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/service/delete/${data}`, "post");
    await messages(result?.message, result?.status);
    return result;
  }
);
export const updateServices= createAsyncThunk(
  "updateServices",
  async (body) => {
    const result = await postApiFile(
      `${baseUrl}/api/service/edit/${body?.id}`,
      "put",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);







// Attributes manage
export const addAttribute = createAsyncThunk(
  "updateAttribute",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/attribute/add`, "post", body);
    await messages(result?.message, result?.status);
    return result;
  }
);
export const getAttributes = createAsyncThunk("getAttributes", async (data) => {
  const result = await allApi(`${baseUrl}/api/attributes`, "get");
  return result;
});
export const deleteAttribute = createAsyncThunk(
  "deleteAttribute",
  async (data) => {
    const result = await allApi(
      `${baseUrl}/api/attribute/${data}`,
      "delete",
      "Record is deleted successfully."
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
export const updateAttribute = createAsyncThunk(
  "updateAttribute",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/attribute/edit/${body?.id}`,
      "put",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
//all states
export const getAllStates = createAsyncThunk("getAllStates", async (data) => {
  const result = await allApi(`${baseUrl}/api/states`, "get");
  return result;
});
// myprofile manage
export const getMyProfile = createAsyncThunk("getMyProfile", async (data) => {
  const result = await allApi(`${baseUrl}/api/user/profile`, "get");
  return result;
});
export const editMyProfile = createAsyncThunk("editMyProfile", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/user/profile/edit`,
    "post",
    body,
    "Updated successfully."
  );
  await messages(result?.message, result?.status);
  return result;
});
// update profile form admin side
export const editProfileByAdmin = createAsyncThunk(
  "editProfileByAdmin",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/user/edit/${body?.id}`,
      "put",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
export const adminLogin = createAsyncThunk("adminLogin", async (body) => {
  const result = await postApi(`${baseUrl}/auth/login`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const userLogOut = createAsyncThunk("userLogOut", async (body) => {
  const result = await postApi(
    `${baseUrl}/auth/logout`,
    "post",
    body,
    "Your are logout successfully."
  );
  await messages(result?.message, result?.status);
  return result;
});
const userReducer = createSlice({
  name: "details",
  initialState,
  reducers: {
    increaseLocalItem: (state) => {
      state.localStorageCartItem += 1;
    },
  },
  extraReducers: {
    [resetProductList.fulfilled]: (state, action) => {
      state.productsListData = [];
    },
    [resetplansList.fulfilled]: (state, action) => {
      state.plansListData = [];
    },
    [resetplans.fulfilled]: (state, action) => {
      state.plansData = [];
    },
    [resetUsersList.fulfilled]: (state, action) => {
      state.getUsersData = [];
    },
    [getHomePageSetting.fulfilled]: (state, action) => {
      state.getHomePageSettingList = action.payload;
    },
    [getAllStates.fulfilled]: (state, action) => {
      state.getAllStatesList = action.payload;
    },
    [getSocialMediaSettings.fulfilled]: (state, action) => {
      state.getSocialMediaSettingsData = action.payload?.socialAccounts;
    },
    [getDashBoard.fulfilled]: (state, action) => {
      state.getDashBoardData = action.payload;
    },
    [getAttributes.fulfilled]: (state, action) => {
      state.getAttributesData = action.payload;
    },
    [CreateProduct.fulfilled]: (state, action) => {
      state.getNewProductData = action.payload?.product?.id;
      action.payload?.product?.id.length > 0 &&
        localStorage.setItem("productId", action.payload?.product?.id);
      action.payload?.status === 1 &&
        localStorage.setItem("newProductapiStatus", action.payload?.status);
    },
    [productsList.fulfilled]: (state, action) => {
      state.productsListData = [
        ...state.productsListData,
        ...action.payload?.list,
      ];
      state.productsBlank = action.payload?.list;
    },
    [productsListExport.fulfilled]: (state, action) => {
      state.productsListExportData = action.payload?.list;
    },

    [plansList.fulfilled]: (state, action) => {
      state.plansListData = [
        ...state.plansListData,
        ...action.payload?.list,
      ];
      state.productsBlank = action.payload?.list;
    },
    [plansListExport.fulfilled]: (state, action) => {
      state.plansListExportData = action.payload?.list;
    },
    [plans.fulfilled]: (state, action) => {
      state.plansData = [
        ...state.plansData,
        ...action.payload?.list,
      ];
      state.productsBlank = action.payload?.list;
    },
    [plansExport.fulfilled]: (state, action) => {
      state.plansExportData = action.payload?.list;
    },
    [getCoupons.fulfilled]: (state, action) => {
      state.getCouponsData = action.payload;
    },
    [applyCoupon.fulfilled]: (state, action) => {
      state.applyCouponData = action.payload;
      action.payload?.status === 1 &&
        localStorage.setItem("couponCode", action.payload?.status);
      action.payload?.status === 1 &&
        localStorage.setItem("couponAmount", action.payload?.coupon?.amount);
    },
    
    [similarproductions.fulfilled]: (state, action) => {
      state.similarproductionsData = action.payload;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.getUsersData = [...state.getUsersData, ...action.payload?.list];
      state.usersBlank = action.payload?.list;
    },
    [getUsersExport.fulfilled]: (state, action) => {
      state.getUsersExportList = action.payload?.list;
    },
    [sendVerificationCode.fulfilled]: (state, action) => {
      action.payload?.status === 1 &&
        localStorage.setItem("sendVerificationCode", action.payload?.status);
    },
    [verifyOTP.fulfilled]: (state, action) => {
      action.payload?.status === 1 &&
        localStorage.setItem("verifyOTP", action.payload?.status);
    },
    [passwordChanges.fulfilled]: (state, action) => {
      action.payload?.status === 1 &&
        localStorage.setItem("passwordChanges", action.payload?.status);
    },
    [dashboardRecord.fulfilled]: (state, action) => {
      state.dashboardRecordData = action.payload?.list;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.getCategoriesData = action.payload;
    },
    [getServices.fulfilled]: (state, action) => {
      state.getServicesData = action.payload;
    },
    [getServicesFrontEnd.fulfilled]: (state, action) => {
      state.getServicesFrontEndData = action.payload;
    },
    [getBanners.fulfilled]: (state, action) => {
      state.getBannersData = action.payload;
    },
    [getFaq.fulfilled]: (state, action) => {
      state.getFaqData = action.payload;
    },
    [getBrands.fulfilled]: (state, action) => {
      state.getBrandsData = action.payload;
    },
    [getBrandsFrontEnd.fulfilled]: (state, action) => {
      state.getBrandsFrontEndData = action.payload;
    },
    [getCheckoutDeatils.fulfilled]: (state, action) => {
      state.getCheckoutDeatilsData = action.payload;
    },
    [getSettings.fulfilled]: (state, action) => {
      state.getSettingsData = action.payload;
    },
    [getSetting.fulfilled]: (state, action) => {
      state.getSettingData = action.payload;
    },
    [getOpenSetting.fulfilled]: (state, action) => {
      state.getSettingData = action.payload;
    },
    [getReviews.fulfilled]: (state, action) => {
      state.getReviewsData = action.payload;
    },
    [getTaxgsts.fulfilled]: (state, action) => {
      state.getTaxgstsData = action.payload;
    },
    [getTransactions.fulfilled]: (state, action) => {
      state.getTransactionsData = action.payload;
    },
    [getZipcodes.fulfilled]: (state, action) => {
      state.getZipcodesData = action.payload;
    },
    [getCartlist.fulfilled]: (state, action) => {
      state.getCartlistData = action.payload;
    },
    [getProducts.fulfilled]: (state, action) => {
      state.getProductsData = action.payload;
    },
    [getCustomizeOffers.fulfilled]: (state, action) => {
      state.getCustomizeOffersData = action.payload?.offers;
    },
    [getProductRating.fulfilled]: (state, action) => {
      state.productRatingData = action.payload?.list;
    },
    [getSingleProduct.fulfilled]: (state, action) => {
      state.getSingleProductData = action.payload;
     },
    [getMyProfile.fulfilled]: (state, action) => {
      state.getMyProfileData = action.payload;
    },
    [editMyProfile.pending]: (state, action) => {
      state.editMyProfileMsg = "Please Wait......";
    },
    [editMyProfile.fulfilled]: (state, action) => {
      state.editMyProfileMsg = "Your profile is edit successfully.";
    },
    [editMyProfile.rejected]: (state, action) => {
      state.editMyProfileMsg = action?.error?.message;
    },
    [loginWithGoogle.fulfilled]: (state, action) => {
      if (action.payload.status === 1) {
        localStorage.setItem("x-auth-token", action.payload.token);
        localStorage.setItem("userRole", action.payload?.user?.role?.name);
        localStorage.setItem("slug", action.payload?.user?.role?.slug);
        localStorage.setItem("username", action.payload?.user?.email);
      }
    },
    [adminLogin.fulfilled]: (state, action) => {
      if (action.payload.status === 1) {
        localStorage.setItem("x-auth-token", action.payload.token);
        localStorage.setItem("userRole", action.payload?.me?.role?.name);
        localStorage.setItem("slug", action.payload?.me?.role?.slug);
        localStorage.setItem("username", action.payload?.me?.email);
      }
    },
    [addProductImages.fulfilled]: (state, action) => {
      localStorage.setItem("uploadProductimg", action.payload?.status);
    },
  },
});

export const { increaseLocalItem } = userReducer.actions;
export default userReducer.reducer;
