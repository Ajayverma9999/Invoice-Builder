import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { allApi, messages, postApi } from "../helpers/apiStructure";

const initialState = {
  getCatsFrontEndData: [],
  getBrandsFrontendData: [],
  getBannerFrontendData: [],
  getCountProductData: [],
  getLatestReviewsData: [],
  getPagesList: [],
  getFaqFrontEndData:[],
  getReviewsFrontEndData:[],
  getSinglePageData: [],
  childCategoriesFrontEndData: [],
};

var baseUrl = "http://localhost:3000";

if (window.location.host) {
  baseUrl = window.location.protocol + "//" + window.location.host;
}

// brands
export const getBrandsFrontend = createAsyncThunk(
  "getBrandsFrontend",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/frontend/brands`, "get");
    return result;
  }
);
// banners
export const getBannerFrontend = createAsyncThunk(
  "getBannerFrontend",
  async (data) => {
    const result = await allApi(`${baseUrl}/api/frontend/banners`, "get");
    return result;
  }
);
//home page
export const getLatestReviews = createAsyncThunk(
  "getLatestReviews",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/letest/reviews`, "post", body);
    return result;
  }
);
// FrontEnd Categories manage
export const getCategoriesFrontEnd = createAsyncThunk(
  "getCategoriesFrontEnd",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/frontend/categories`,
      "post",
      body
    );
    return result;
  }
);


export const getReviewsFrontEnd = createAsyncThunk(
  "getReviewsFrontEnd",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/frontend/reviews`,
      "post",
      body
    );
    return result;
  }
);

// FAQ
export const getFaqFrontEnd = createAsyncThunk(
  "getFaqFrontEnd",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/faq/list`,
      "get",
      body
    );
    return result;
  }
);
export const getChildCategoriesFrontEnd = createAsyncThunk(
  "getChildCategoriesFrontEnd",
  async (body) => {
    const result = await postApi(`${baseUrl}/api/childcategorys`, "post", body);
    return result;
  }
);
// pages
export const addNewPage = createAsyncThunk("addNewPage", async (body) => {
  const result = await postApi(`${baseUrl}/api/page/add`, "post", body);
  await messages(result?.message, result?.status);
  return result;
});
export const getSinglePage = createAsyncThunk("getSinglePage", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/page/${body?.slug}`,
    "post",
    body
  );
  return result;
});
export const getPages = createAsyncThunk("getPages", async (data) => {
  const result = await allApi(`${baseUrl}/api/pages`, "get");
  return result;
});
export const deletePage = createAsyncThunk("deletePage", async (data) => {
  const result = await allApi(`${baseUrl}/api/page/${data}`, "delete");
  await messages(result?.message, result?.status);
  return result;
});
export const updatePage = createAsyncThunk("updatePage", async (body) => {
  const result = await postApi(
    `${baseUrl}/api/page/edit/${body?.id}`,
    "put",
    body
  );
  await messages(result?.message, result?.status);
  return result;
});
// get count product
export const getCountProduct = createAsyncThunk(
  "getCountProduct",
  async (body) => {
    const result = await postApi(
      `${baseUrl}/api/getproduct/limits`,
      "post",
      body
    );
    return result;
  }
);

const frontEnd = createSlice({
  name: "frontEnd",
  initialState,
  reducers: {},
  extraReducers: {
    [getCategoriesFrontEnd.fulfilled]: (state, action) => {
      state.getCatsFrontEndData = action.payload?.list;
    },
    [getFaqFrontEnd.fulfilled]: (state, action) => {
      state.getFaqFrontEndData = action.payload;
    },
    [getReviewsFrontEnd.fulfilled]: (state, action) => {
      state.getReviewsFrontEndData = action.payload?.list;
    },
    [getChildCategoriesFrontEnd.fulfilled]: (state, action) => {
      state.childCategoriesFrontEndData = action.payload?.list;
    },
    [getPages.fulfilled]: (state, action) => {
      state.getPagesList = action.payload?.list;
    },
    [getSinglePage.fulfilled]: (state, action) => {
      state.getSinglePageData = action.payload?.page;
    },
    [getLatestReviews.fulfilled]: (state, action) => {
      state.getLatestReviewsData = action.payload?.list;
    },
    [getBrandsFrontend.fulfilled]: (state, action) => {
      state.getBrandsFrontendData = action.payload;
    },
    [getBannerFrontend.fulfilled]: (state, action) => {
      state.getBannerFrontendData = action.payload;
    },
    [getCountProduct.fulfilled]: (state, action) => {
      state.getCountProductData = action.payload;
    },
  },
});

export default frontEnd.reducer;
