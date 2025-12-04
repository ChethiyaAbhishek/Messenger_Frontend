// Name Validations
export const validateFirstName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "First name is requried!";
  }
  return null;
};
export const validateLastName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Last name is requried!";
  }
  return null;
};

// Password Validation
export const validatePassword = (password: string): string | null => {
  if (!password || password.trim().length < 8) {
    return "Password is requried with minimum of 8 characters!";
  }
  return null;
};

// Country Code Validation
export const validateCountryCode = (countryCode: string): string | null => {
  const regex = /^\+[1-9]\d{0,3}$/;
  if (!countryCode) {
    return "Country code is required.";
  }
  if (!regex.test(countryCode)) {
    return "Enter a valid country code.";
  }

  return null;
};

// Contact Number Validation
export const validateContactNo = (contactNo: string): string | null => {
  const regex = /^[1-9][0-9]{6,14}$/;
  if (!contactNo) {
    return "Contact Number is required.";
  }
  if (!regex.test(contactNo)) {
    return "Enter a valid contact number.";
  }

  return null;
};

// Profile Image Validation
export const validateProfileImage = (
  image: {
    uri: string;
    type?: string;
    fileSize?: number;
  } | null
): string | null => {
  if (!image) {
    return "Profile image is required.";
  }
  if (
    image.type &&
    !["image/jpeg", "image/jpg", "image/png"].includes(image.type)
  ) {
    return "Select a valid image type (JPEG, JPG, PNG)";
  }
  if (image.fileSize && image.fileSize > 10 * 1024 * 1024) {
    // 10MB
    return "Profile image must be less than 5MB";
  }
  return null;
};

// Group Name Validation
export const validateGroupName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Group name is requried!";
  }
  return null;
};
