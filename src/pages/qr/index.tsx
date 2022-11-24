import { useRouter } from "next/router";
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "utils/firebase";
import { useAuthContext } from "components/Header/loginObserver";
import Layout from "pages/layout";

const QrCode = () => {
  const router = useRouter();
  const { userInfo } = useAuthContext();
  const uid = userInfo?.uid;
  (async () => {
    if (uid !== undefined) {
      const collectionRef = query(
        collection(db, "userStatus"),
        where("uid", "==", uid)
      );
      const querySnapshot = await getDocs(collectionRef);
      const [docId] = querySnapshot.docs.map((doc) => {
        return doc.id;
      });
      await updateDoc(doc(db, "userStatus", docId), {
        qr: true,
      });
    }
  })();

  setTimeout(() => {
    router.push("/");
  }, 2000);

  return (
    <Layout>
      <div>
        <h2>ロード中…</h2>
      </div>
    </Layout>
  );
};

export default QrCode;
