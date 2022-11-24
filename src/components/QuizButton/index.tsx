import { useState, useEffect } from "react";
import { useAuthContext } from "components/Header/loginObserver";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "utils/firebase";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import { Button } from "react-bootstrap";
import { writeUserLog, UserLog } from "utils/writeLog";

export const QuizButton = () => {
  const [isReadQr, setIsReadQr] = useState(false);
  const [quizState, setQuizState] = useState(0);
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

  const handleOnClick = async () => {
    if (uid !== undefined) {
      const userLog: UserLog = {
        uid: uid,
        state: "answer-start",
        place: "",
      };
      await writeUserLog(userLog);
    }
    router.push({
      pathname: "/quiz",
      query: { area: quizState },
    });
  };

  return (
    <div className={styles.container}>
      {isReadQr === true && quizState === 1 && (
        <>
          <h3>39問のクイズに答えて「生き物博士」を目指そう!</h3>
          <Button className={styles.button} onClick={handleOnClick}>
            クイズに挑戦!
          </Button>
        </>
      )}
      {isReadQr === true && quizState > 1 && quizState < 40 && (
        <>
          <h3>39問のクイズに答えて「生き物博士」を目指そう!</h3>
          <Button className={styles.button} onClick={handleOnClick}>
            次のクイズに挑戦!
          </Button>
        </>
      )}
      {isReadQr === true && quizState === 40 && (
        <h3>ご参加ありがとうございました</h3>
      )}
    </div>
  );
};
