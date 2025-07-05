
// Simulate a user registration
export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return fake user data
  return {
    id: "fake_user_id_123",
    name,
    email,
    password, // Include password to use the variable
    token: "fake_jwt_token",
  };
};

// You can add more dummy API functions later