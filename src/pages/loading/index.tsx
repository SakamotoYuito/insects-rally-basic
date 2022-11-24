import { useRouter } from "next/router";
import Layout from "pages/layout";
import { adminDB } from "utils/server";
import { GetServerSideProps } from "next";
import { writeUserLog, writePlaceLog, UserLog, PlaceLog } from "utils/writeLog";
import { ParsedUrlQuery } from "querystring";

type Props = {
  congestion: number;
  currentUids: string[];
};

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

  await adminDB
    .collection("userStatus")
    .doc(userDocData.id)
    .update({
      answered: userDocData.data.answered + 1,
      points: userDocData.data.points + 1,
      lastQuizNumber: userDocData.data.lastQuizNumber + 1,
    });

  return {
    props: {},
  };
};

export default Loading;
