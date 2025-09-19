import app from './config.js';
import { getFirestore } from 'firebase/firestore';

export const db = getFirestore(app);
