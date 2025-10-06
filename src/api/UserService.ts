import { useContext } from "react";
import { UserRegistrationData } from "../components/UserContext";

const API = process.env.EXPO_PUBLIC_APP_URL + "/Messenger";

export const checkContactNumber = async (
  countryCode: string,
  contactNo: string
) => {
  const data = {
    countryCode: countryCode,
    contactNo: contactNo,
  };

  const response = await fetch(API + "/UserVerification", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    let response = {
      status: false,
      msg: "Contact number verification failed.",
    };
    return JSON.stringify(response);
  }
};

export const createNewAccount = async (
  userRegistrationData: UserRegistrationData
) => {
  const data = {
    firstName: userRegistrationData.firstName,
    lastName: userRegistrationData.lastName,
    countryCode: userRegistrationData.countryCode,
    contactNo: userRegistrationData.contactNo,
  };

  const response = await fetch(API + "/UserController", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    let response = {
      status: false,
      msg: "User registration failed.",
    };
    return JSON.stringify(response);
  }
};

export const uploadProfileImage = async (userId: string, imageUri: string) => {
  let formData = new FormData();
  formData.append("userId", userId);
  formData.append("profileImage", {
    uri: imageUri,
    type: "image/png",
    name: "profile.png",
  } as any);

  const response = await fetch(API + "/UserProfileController", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    return await response.json();
  } else {
    let response = {
      status: false,
      msg: "Profile image uploading failed.",
    };
    return JSON.stringify(response);
  }
};
