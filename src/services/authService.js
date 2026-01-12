import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

/* SIGN UP */
export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/* LOGIN */
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/* LOGOUT */
export const logoutUser = () => signOut(auth);
