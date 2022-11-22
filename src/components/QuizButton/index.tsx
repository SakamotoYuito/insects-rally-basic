import { useState, useEffect } from "react";
import { useAuthContext } from "components/Header/loginObserver";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "utils/firebase";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import { Button } from "react-bootstrap";

export const QuizButton = () => {
  const [isReadQr, setIsReadQr] = useState(false);
  const [quizState, setQuizState] = useState(1);
  const router = useRouter();

  const { userInfo } = useAuthContext();
  const uid = userInfo?.uid;

  useEffect(() => {
    if (uid !== undefined) {
      (async () => {
        const collectionRef = uid
          ? query(collection(db, "userStatus"), where("uid", "==", uid))
          : query(collection(db, "userStatus"), where("uid", "==", ""));
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.docs.map((doc) => {
          const userData = doc.data();
          setIsReadQr(userData.qr);
          setQuizState(userData.lastQuizNumber + 1);
        });
      })();
    }
  }, [uid]);

  const handleOnClick = () => {
    router.push({
      pathname: "/quiz",
      query: { area: quizState },
    });
  };

  return (
    <div className={styles.container}>
      {isReadQr === false && (
        <div className={styles.start}>
          <h3>
            QRコードを読み込んで
            <br />
            生き物クイズに挑戦!
          </h3>
        </div>
      )}
      {isReadQr === true && quizState === 0 && (
        <Button className={styles.button} onClick={handleOnClick}>
          クイズに挑戦!
        </Button>
      )}
      {isReadQr === true && quizState > 0 && (
        <Button className={styles.button} onClick={handleOnClick}>
          次のクイズに挑戦!
        </Button>
      )}
    </div>
  );
};
