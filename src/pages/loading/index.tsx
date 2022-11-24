import { useRouter } from "next/router";
import Layout from "pages/layout";
import { adminDB } from "utils/server";
import { GetServerSideProps } from "next";

const Loading = () => {
  const router = useRouter();

  setTimeout(() => {
    router.push("/");
  }, 3000);

  return (
    <Layout footer={false}>
      <div>
        <h2>データ更新中</h2>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryPram = context.query;
  const uid = queryPram.uid as string;
  const quizId = Number(queryPram.quizId as string);

  const userQuerySnapshot = await adminDB
    .collection("userStatus")
    .where("uid", "==", uid)
    .get();
  const [userDocData] = userQuerySnapshot.docs.map((doc) => {
    return {
      data: doc.data(),
      id: doc.id,
    };
  });

  userDocData.data.quiz[quizId - 1] = "answered";
  const userStatus = setUserStatus(userDocData.data);

  const userQuizState = userDocData.data.quiz[quizId - 1];

  const updateAnswered =
    userDocData.data.answered < 39 && userQuizState === "unanswered"
      ? userDocData.data.answered + 1
      : userDocData.data.answered;

  const updateLastQuizNumber =
    userDocData.data.lastQuizNumber < 39 && userQuizState === "unanswered"
      ? userDocData.data.lastQuizNumber + 1
      : userDocData.data.lastQuizNumber;

  await adminDB
    .collection("userStatus")
    .doc(userDocData.id)
    .update({
      answered: updateAnswered,
      points: userDocData.data.points + 1,
      lastQuizNumber: updateLastQuizNumber,
      quiz: userDocData.data.quiz,
      status: userStatus,
    });

  return {
    props: {},
  };
};

const setUserStatus = (data: FirebaseFirestore.DocumentData) => {
  if (data.answered >= 19 && data.answered < 38) {
    return "生き物ハンター";
  } else if (data.answered >= 38) {
    return "生き物研究家";
  } else {
    return "生き物好き";
  }
};

export default Loading;
