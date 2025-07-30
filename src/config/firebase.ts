import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, query, where, getDocs, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Your Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBoZfS4rJ-XmBMlwaEcr8Uu4U9Iyvy7eQk",
  authDomain: "therakind-78b40.firebaseapp.com",
  projectId: "therakind-78b40",
  storageBucket: "therakind-78b40.firebasestorage.app",
  messagingSenderId: "103160358356",
  appId: "1:103160358356:web:ea9d4b251c71a8a996a241",
  measurementId: "G-FGCNYQ1SNZ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string, role: 'client' | 'therapist') => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(result.user, {
      displayName: name
    });
    
    // Send email verification
    await sendEmailVerification(result.user);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      role,
      createdAt: new Date(),
      isVerified: false,
      emailVerified: false
    });
    
    return result.user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const resendEmailVerification = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
    }
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
};

export const confirmPasswordResetWithCode = async (oobCode: string, newPassword: string) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: any) => {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// File upload functions
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Session management functions
export const createSession = async (sessionData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const updateSession = async (sessionId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'sessions', sessionId), {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

export const getSessions = async (userId: string, role: 'client' | 'therapist') => {
  try {
    const field = role === 'client' ? 'clientId' : 'therapistId';
    const q = query(
      collection(db, 'sessions'),
      where(field, '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting sessions:', error);
    throw error;
  }
};

export const getTherapists = async () => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'therapist'),
      where('isVerified', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting therapists:', error);
    throw error;
  }
};

// Feedback functions
export const createFeedback = async (feedbackData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
};

export const getFeedback = async (therapistId: string) => {
  try {
    const q = query(
      collection(db, 'feedback'),
      where('therapistId', '==', therapistId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
};

export { auth, db, storage }; 