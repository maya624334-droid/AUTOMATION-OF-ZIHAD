import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, BOOTSTRAP_ADMIN_EMAIL, handleFirestoreError, OperationType } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (fullName: string, email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  updateUserBio: (displayName: string, bio?: string) => Promise<void>;
  removeUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check admin status: bootstrap email or admin document
        const isBootstrapAdmin = user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
        let hasAdminDoc = false;

        try {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminSnap = await getDoc(adminDocRef);
          if (adminSnap.exists()) {
            hasAdminDoc = true;
          } else if (isBootstrapAdmin) {
            // Auto-bootstrap document for future checks
            await setDoc(adminDocRef, {
              email: user.email,
              role: 'superadmin',
              createdAt: new Date().toISOString(),
            });
            hasAdminDoc = true;
          }
        } catch {
          // Fall back gracefully to email check
          hasAdminDoc = isBootstrapAdmin;
        }

        setIsAdmin(isBootstrapAdmin || hasAdminDoc);

        // Fetch user profile
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', user.uid), newProfile);
            setUserProfile(newProfile);
          }
        } catch (e) {
          console.warn('Could not fetch user profile:', e);
          setUserProfile({
            uid: user.uid,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (fullName: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: fullName });
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        displayName: fullName,
        email: email,
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${cred.user.uid}`);
      }
      setUserProfile(newProfile);
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const sendResetEmail = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserBio = async (displayName: string, bio?: string) => {
    if (!currentUser) return;
    await updateProfile(currentUser, { displayName });
    const updated: UserProfile = {
      ...(userProfile || { uid: currentUser.uid, email: currentUser.email || '', createdAt: new Date().toISOString() }),
      displayName,
      bio: bio || '',
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      setUserProfile(updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const removeUserAccount = async () => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) {
      console.warn('Error removing user doc:', e);
    }
    await deleteUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        signIn,
        signUp,
        logOut,
        sendResetEmail,
        updateUserBio,
        removeUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
