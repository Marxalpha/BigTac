// app/services/aws/authService.js
import { Auth } from "aws-amplify";

export async function signUp(username, password) {
  try {
    await Auth.signUp({
      username,
      password,
    });
    console.log("User signed up successfully!");
  } catch (error) {
    console.log("Error signing up:", error.message);
  }
}

export async function signIn(username, password) {
  try {
    await Auth.signIn(username, password);
    console.log("User signed in successfully!");
  } catch (error) {
    console.log("Error signing in:", error.message);
  }
}
