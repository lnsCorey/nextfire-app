import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      console.log('user:', user.uid);
      const ref = firestore.collection('users').doc(user.uid);
      console.log('ref:', ref);
      
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
        console.log('username', username);
        
      });

    } else {
      setUsername(null);
    }
    
    return unsubscribe;
  }, [user]);

  return { user, username };
}
