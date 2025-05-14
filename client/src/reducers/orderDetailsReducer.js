import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { allApi, messages, postApi } from "../helpers/apiStructure";

const initialState = {
  zipcodeCityStateData: [],
  userAddressList: [],
  getUserAddress: [],
  shippingCostData: [],
  userOrdersList: [],
  userOrdersBlank: [],
  getUserProfileList: [],
  adminOrdersData: [],
  adminOrdersBlank: [],
  singleOrderData: [],
  getProductReviewsList: [],
  postApiEmailTemplateList: [],
  userReviewsList: [],
  getEmailTemplatesList: [],
  userProductLikedData: [],
  userSignUpStatus: "",
  userAddressStatus: "",
};

var baseUrl = "http://localhost:3000";

if (window.location.host) {
  baseUrl = window.location.protocol + "//" + window.location.host;
}
//reset admin orders list
export const resetAdminOrderList = createAsyncThunk(
  "resetAdminOrderList",
  async (data) => {
    return [];
  }
);
//Email template
export const getEmailTemplates = createAsyncThunk(
  "getEmailTemplates",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/emailTemplates`, "post", body);
    return result;
  }
);
export const postApiEmailTemplate = createAsyncThunk(
  "postApiEmailTemplate",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/template`, "post", body);
    return result;
  }
);
export const updateEmailTemplate = createAsyncThunk(
  "updateEmailTemplate",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/emailTemplate/edit/${body.id}`,
      "put",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
// zip code manage
export const zipcodeCityState = createAsyncThunk(
  "zipcodeCityState",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/zipcode/citystate`,
      "post",
      body
    );
    return result;
  }
);
// admin Order
export const adminOrders = createAsyncThunk("adminOrders", async (body) => {
  const result = await postApi(`${baseUrl}/api/admin/orders`, "post", body);
  return result;
});
export const adminOrdersExport = createAsyncThunk("adminOrdersExport", async (body) => {
  const result = await postApi(`${baseUrl}/api/orders/forcsv`, "post", body);
  return result;
});
export const updateOrderStatus = createAsyncThunk(
  "updateOrderStatus",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/admin/order/status/${body.id}`,
      "put",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
// single order details
export const singleOrder = createAsyncThunk("singleOrder", async (orderid) => {
 const result = await allApi(`${baseUrl}/api/order/detail/${orderid}`, "get");
  return result;
});

export const userSignUp = createAsyncThunk("userSignUp", async (body) => {
  const result = await postApi(`${baseUrl}/api/user/signup`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getUserProfile = createAsyncThunk(
  "getUserProfile",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/user/profile`, "get");
    return result;
  }
);
export const userProfileUpdate = createAsyncThunk(
  "userProfileUpdate",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/user/profile/edit`,
      "post",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
//user product review
export const addUserProductReview = createAsyncThunk(
  "addUserProductReview",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/review/add`, "post", body);
    await messages(result?.message, result?.status);
    return result;
  }
);
export const userReviews = createAsyncThunk("userReviews", async (body) => {
  const result = await postApi(`${baseUrl}/api/user/review`, "post", body);
  return result;
});
export const getProductReviews = createAsyncThunk(
  "getProductReviews",
  async (data) => {
    const result = await allApi(
      `${baseUrl}/api/reviews/product/${data.product}`,
      "get"
    );
    return result;
  }
);
//reorder
export const createReOrder = createAsyncThunk(
  "createReOrder",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/order/recreate`, "post", body);
    await messages(result?.message, result?.status);
    return result;
  }
);
// Order
export const orderCreate = createAsyncThunk("orderCreate", async (body) => {
  const result = await postApi(`${baseUrl}/api/order/create`, "post", body);
  await messages(result?.message, result?.status);

  var script = document.createElement('script');
    script.onload = function () {
      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
        "orderId": result.orderId, 
        "token": result.txnToken,
        "tokenType": "TXN_TOKEN",
        "amount": result.amount
        },
        "handler": {
        "notifyMerchant": function(eventName,data){
        console.log("notifyMerchant handler function called");
        if(eventName == 'APP_CLOSED') {
          // Todo delete order if asked
          ///result.orderId
          console.log('clossed',data);
        }
        console.log("eventName => ",eventName);
        console.log("data => ",data);
        }
        }
        };
        if(window.Paytm && window.Paytm.CheckoutJS){
        window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
        // initialze configuration using init method
        window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
        // after successfully updating configuration, invoke JS Checkout
        window.Paytm.CheckoutJS.invoke();
        }).catch(function onError(error){
        console.log("error => ",error);
        });
        });
        }
    };
  // await messages(result?.message, result?.status);
  // await messages(result?.message, result?.status);
  script.src = result.url;

document.head.appendChild(script); 
  //result?.status === 1 && (window.location.href = result?.paymenturl ? result?.paymenturl : thankyou);
  return result;
});
export const userOrders = createAsyncThunk("userOrders", async (body) => {
  const result = await postApi(`${baseUrl}/api/orders`, "post", body);
  return result;
});
// User address
export const userAddress = createAsyncThunk("userAddress", async (body) => {
  const result = await postApi(`${baseUrl}/api/user/address/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const updateUserAddress = createAsyncThunk(
  "updateUserAddress",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/user/address/edit`,
      "put",
      body
    );
    await messages(result?.message, result?.status);
    return result;
  }
);
export const getUserAddress = createAsyncThunk(
  "getUserAddress",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/user/address`, "get");
    return result;
  }
);
export const deleteUserAddress = createAsyncThunk(
  "deleteUserAddress",
  async (data) => {
    const result = await allApi(
      `${baseUrl}/api/user/address/${data?.addresskey}`,
      "delete"
    );
    return result;
  }
);
// shipping
export const shippingCost = createAsyncThunk("shippingCost", async (body) => {
  const result = await postApi(`${baseUrl}/api/shipping/cost`, "post", body);
  return result;
});
//user cart
export const userCartDetails = createAsyncThunk(
  "userCartDetails",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/carts`, "post", body);
    return result;
  }
);
const userReducer = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {},
  extraReducers: {
    [resetAdminOrderList.fulfilled]: (state, action) => {
      state.adminOrdersData = [];
      state.userOrdersList = [];
    },
    [getEmailTemplates.fulfilled]: (state, action) => {
      state.getEmailTemplatesList = action.payload.list;
    },
    [postApiEmailTemplate.fulfilled]: (state, action) => {
      state.postApiEmailTemplateList = action.payload?.list;
    },
    [zipcodeCityState.fulfilled]: (state, action) => {
      state.zipcodeCityStateData = action.payload?.zipcode;
    },
    [userAddress.fulfilled]: (state, action) => {
      action.payload.status === 1 &&
      localStorage.setItem("username", action.payload?.user?.email);
      localStorage.setItem("userRole", action.payload?.user?.role?.name);
      localStorage.setItem("slug", action.payload?.user?.role?.slug);
      localStorage.setItem("signUpstatus", action.payload.status);
      localStorage.setItem("userAddress", action.payload.status);
      state.userAddressStatus = action.payload.status;
      state.userAddressList = action.payload;
    },
    [getUserAddress.fulfilled]: (state, action) => {
      state.getUserAddressList = action.payload?.address;
    },
    [shippingCost.fulfilled]: (state, action) => {
      state.shippingCostData = action.payload;
    },
    [userSignUp.fulfilled]: (state, action) => {
      // localStorage.setItem("username", action.payload?.me?.email);
      // localStorage.setItem("userRole", action.payload?.me?.role?.name);
      localStorage.setItem("x-auth-token", action.payload.token);
      localStorage.setItem("slug", action.payload?.me?.role?.slug);
      localStorage.setItem("signUpstatus", action.payload.status);
      state.userSignUpStatus = action.payload.status;
    },
    [userOrders.fulfilled]: (state, action) => {
      state.userOrdersList = [...state.userOrdersList, ...action.payload.list];
      state.userOrdersBlank = action.payload.list;
    },
    [singleOrder.fulfilled]: (state, action) => {
      state.singleOrderData = action.payload.order;
    },
    [getUserProfile.fulfilled]: (state, action) => {
      state.getUserProfileList = action.payload?.user;
    },
    [adminOrders.fulfilled]: (state, action) => {
      state.adminOrdersData = [
        ...state.adminOrdersData,
        ...action.payload?.list,
      ];
      state.adminOrdersBlank = action.payload?.list;
    },
    [adminOrdersExport.fulfilled]: (state, action) => {
      state.adminOrdersExportList = action.payload?.list;
    },
    [getProductReviews.fulfilled]: (state, action) => {
      state.getProductReviewsList = action.payload?.list;
    },
    [userReviews.fulfilled]: (state, action) => {
      state.userReviewsList = action.payload?.list;
    },
    [userCartDetails.fulfilled]: (state, action) => {
      state.userCartDetailsList = action.payload.carts
    },
    [orderCreate.fulfilled]: (state, action) => {
      state.orderCreateUrl = action.payload?.paymenturl;
    },
  },
});

export default userReducer.reducer;
