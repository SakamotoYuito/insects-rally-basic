import { useState, useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useAuthContext } from "components/Header/loginObserver";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "utils/firebase";
import styles from "./style.module.scss";

type Props = {
  answered: number;
};

type UserStatus = "生き物好き" | "生き物ハンター" | "生き物研究家";

export const ChartComponent = ({ answered }: Props) => {
  const [userStatus, setUserStatus] = useState<UserStatus>("生き物好き");
  const { userInfo } = useAuthContext();
  const uid = userInfo?.uid;
  const colors = ["#FF8042", "#FFFFFF"];
  const data = [
    { name: "クリア済み", value: answered },
    { name: "未クリア", value: 39 - answered },
  ];

  useEffect(() => {
    (async () => {
      if (uid !== undefined) {
        const collectionRef = uid
          ? query(collection(db, "userStatus"), where("uid", "==", uid))
          : query(collection(db, "userStatus"), where("uid", "==", ""));
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.docs.map((doc) => {
          const userData = doc.data();
          setUserStatus(userData.status);
        });
      }
    })();
  }, [uid]);
  return (
    <div className={styles.container}>
      <div className={styles.status}>
        <h3>ステータス：{userStatus}</h3>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={300} height={300}>
          <Pie
            dataKey="value"
            data={data}
            innerRadius={40}
            outerRadius={80}
            fill="#82ca9d"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div>
        <h2>{answered} / 39</h2>
      </div>
    </div>
  );
};
