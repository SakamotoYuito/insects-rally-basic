import Layout from "pages/layout";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "utils/firebase";
import { useAuthContext } from "components/Header/loginObserver";
import { ChartComponent } from "components/Chart";

const Home = () => {
  const [currentAnsweredNum, setCurrentAnsweredNum] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [docId, setDocId] = useState("");
  const { userInfo } = useAuthContext();
  const uid = userInfo?.uid;

  useEffect(() => {
    const usersCollectionRef = uid
      ? query(collection(db, "userStatus"), where("uid", "==", uid))
      : query(collection(db, "userStatus"), where("uid", "==", ""));
    const unsubscribe = onSnapshot(usersCollectionRef, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        setCurrentAnsweredNum(doc.data().answered);
        setCurrentPoints(doc.data().points);
        setDocId(doc.id);
      });
    });
    return () => {
      unsubscribe();
    };
  }, [uid]);

  return (
    <Layout>
      <h1>ホーム</h1>
      <ChartComponent answered={currentAnsweredNum} />
    </Layout>
  );
};

export default Home;
