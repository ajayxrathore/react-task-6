import app from './config.js';
import { getAuth } from "firebase/auth";

export const auth = getAuth(app);


