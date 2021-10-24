import { firestore, auth, increment } from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

// Allows user to approval or like a post
export default function Approval({ postRef }) {
  // Listen to approval document for currently logged in user
  const approvalRef = postRef.collection('approvals').doc(auth.currentUser.uid);
  const [approvalDoc] = useDocument(approvalRef);

  // Create a user-to-post relationship
  const addApproval = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(postRef, { approvalCount: increment(1) });
    batch.set(approvalRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeApproval = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { approvalCount: increment(-1) });
    batch.delete(approvalRef);

    await batch.commit();
  };

  return approvalDoc?.exists ? (
    <button onClick={removeApproval}>&#10062; Remove Approval</button>
  ) : (
    <button onClick={addApproval}>&#9989; Approval</button>
  );
}