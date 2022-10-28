import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "pages/layout";
import MyRadioForm from "components/Form/RadioForm";
import MyTextForm from "components/Form/TextForm";
import Check from "assets/icon/check.svg";
import Cross from "assets/icon/cross.svg";
import styles from "./style.module.scss";
import { GetServerSideProps } from "next";
import { adminDB } from "utils/server";
import Button from "react-bootstrap/Button";
import { useAuthContext } from "components/Header/loginObserver";

// http://localhost:3000/quiz?area=A-1

type Props = {
  quiz: QuizDataForDisplay[];
};

type QuizDataForDisplay = {
  id: number;
  type: "radioImage" | "radioText" | "form";
  sentence: string;
  choices: string[];
  answer: number;
  hint: string;
  place: string;
  point: number;
  status: "unanswered" | "accept" | "correct" | "incorrect";
  areaSymbol: string;
  areaId: number;
};

const Quiz = (props: Props) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | number>("");
  const [currentQuizNumber, setCurrentQuizNumber] = useState<number>(1);

  const buttonStr = "回答する";
  const router = useRouter();

  const propsData = props.quiz[currentQuizNumber - 1];

  const quizNumber = propsData.areaId;
  const type = propsData.type;
  const sentence = propsData.sentence;
  const choices = propsData.choices;
  const correctNumber = propsData.answer;
  const correctAnswer = choices[correctNumber - 1];
  const hint = propsData.hint;
  const areaSymbol = propsData.areaSymbol;
  const point = propsData.point;
  const { userInfo } = useAuthContext();
  const uid = userInfo?.uid;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    setIsAnswered(true);
    if (correctAnswer === userAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const toNextQuiz = () => {
    setCurrentQuizNumber(currentQuizNumber + 1);
    setIsCorrect(null);
    setIsAnswered(false);
  };

  const pushLoading = (isCorrect: boolean) => {
    const answerResult = isCorrect === true ? "correct" : "incorrect";
    router.push({
      pathname: "loading",
      query: {
        status: "answer",
        quizId: quizNumber,
        place: areaSymbol,
        point: point,
        answer: answerResult,
        uid: uid,
      },
    });
  };

  const rechallenge = () => {
    setIsCorrect(null);
    setIsAnswered(false);
  };

  return (
    <Layout>
      <div className={styles.title}>
        <h1>問題{quizNumber}</h1>
        <div className={styles.clearMark}>
          {isCorrect === true && isAnswered === true && (
            <Image src={Check} alt="クリア" />
          )}
          {isCorrect === false && isAnswered === true && (
            <Image src={Cross} alt="ミス" />
          )}
        </div>
      </div>
      <p className={styles.sentence}>{sentence}</p>
      {type === "radioText" && isCorrect === null && isAnswered === false && (
        <MyRadioForm
          labels={choices}
          buttonStr={buttonStr}
          onSubmit={(e) => handleSubmit(e)}
          answer={userAnswer}
          onChange={(e) => setUserAnswer(e.currentTarget.value)}
        />
      )}
      {type === "form" && isCorrect === null && isAnswered === false && (
        <MyTextForm
          validated={validated}
          label="回答"
          type="text"
          placeHolder="回答"
          feedback="回答を入力してください"
          onSubmit={(e) => {
            e !== undefined ? handleSubmit(e) : null;
          }}
          onChange={(e) => {
            e !== undefined ? setUserAnswer(e.currentTarget.value) : null;
          }}
          buttonStr="回答する"
          error="もう一度入力してください"
        />
      )}
      {isCorrect === true && isAnswered === true && (
        <>
          <div className={styles.correct}>
            <p className={styles.announce}>正解です</p>
            <h2 className={styles.answer}>正解：{correctAnswer}</h2>
          </div>
          <div className={styles.button}>
            {currentQuizNumber < 5 ? (
              <Button onClick={() => toNextQuiz()}>次のクイズ</Button>
            ) : (
              <Button onClick={() => pushLoading(true)}>報酬を受け取る</Button>
            )}
          </div>
        </>
      )}
      {isCorrect === false && isAnswered === true && (
        <>
          <div className={styles.incorrect}>
            <p className={styles.announce}>ざんねん…不正解です…</p>
            <h2 className={styles.answer}>ヒント：{hint}</h2>
          </div>
          <div className={styles.button}>
            <Button onClick={() => rechallenge()}>もう一度</Button>
          </div>
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const quizDataList: object[] = [];
  const area = context.query.area;
  const querySnapshot = await adminDB
    .collection("quiz")
    .where("areaSymbol", "==", area)
    .orderBy("areaId")
    .get();
  querySnapshot.forEach((doc) => {
    const quizData = doc.data();
    quizDataList.push(quizData);
  });
  return {
    props: {
      quiz: quizDataList,
    },
  };
};

export default Quiz;
