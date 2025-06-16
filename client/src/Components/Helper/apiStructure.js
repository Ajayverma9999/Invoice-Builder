import { toast } from "react-toastify";

export const messages = async (msg, apiStatus) => {
  if (apiStatus === 1) {
    toast.success(msg + " 😊", {
      style: { color: "#fff" },
    });
  } else {
    toast.error(msg + " 😔", {
      style: { backgroundColor: "red", color: "#fff" },
    });
  }
};

export const postApi = async (api, type, body, successMsg) => {
  const res = await fetch(api, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("x-auth-token"),
    },
    body: JSON.stringify(body),
    // redirect: "follow",
  });
  return await res.json();
};

export const allApi = async (api, type, successMsg) => {
  const res = await fetch(api, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("x-auth-token"),
    },
  });
  return await res.json();
};

export const postApiFile = async (api, type, userDetails) => {
  const formData = new FormData();
  Object.entries(userDetails).map(([key, value]) => {
    formData.append(key, value);
  });
  const myHeaders = new Headers();
  myHeaders.append("x-auth-token", localStorage.getItem("x-auth-token"));
  const res = await fetch(api, {
    method: type,
    body: formData,
    headers: myHeaders,
  });
  return await res.json();
};

export const multiFileUpload = async (api, type, userDetails) => {
  const formData = new FormData();
  formData.append("product", userDetails?.product);
  formData.append("defaultImage", userDetails?.defaultImage);
  userDetails?.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  const myHeaders = new Headers();
  myHeaders.append("x-auth-token", localStorage.getItem("x-auth-token"));
  const res = await fetch(api, {
    method: type,
    body: formData,
    headers: myHeaders,
  });
  return await res.json();
};

export const fileWithObjArray = async (api, type, userDetails) => {
  const formData = new FormData();
  Object.entries(userDetails).map(([key, value]) => {
    formData.append(key, value);
  });
  const myHeaders = new Headers();
  myHeaders.append("x-auth-token", localStorage.getItem("x-auth-token"));
  const res = await fetch(api, {
    method: type,
    body: formData,
    headers: myHeaders,
  });
  return await res.json();
};
