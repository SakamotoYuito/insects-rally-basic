import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "utils/firebase";
import { useMemo, useState, useEffect } from "react";
import { useAuthContext } from "components/Header/loginObserver";

const RadarChartComponent = () => {
  const { userInfo } = useAuthContext();
  const uid = userInfo?.uid;
  const initGraphData = useMemo(() => {
    return [
      {
        subject: "森林",
        value: 0,
        fullMark: 10,
      },
      {
        subject: "水辺",
        value: 0,
        fullMark: 10,
      },
      {
        subject: "野原",
        value: 0,
        fullMark: 10,
      },
    ];
    // eslint-disable-next-line
  }, [uid]);

  const [graphValue, setGraphValue] = useState(initGraphData);

  useEffect(() => {
    const usersCollectionRef = uid
      ? query(collection(db, "userStatus"), where("uid", "==", uid))
      : query(collection(db, "userStatus"), where("uid", "==", ""));
    onSnapshot(usersCollectionRef, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        initGraphData[0].value = doc.data().chartData.mt;
        initGraphData[1].value = doc.data().chartData.rv;
        initGraphData[2].value = doc.data().chartData.gd;
        setGraphValue(initGraphData);
      });
    });
  }, [initGraphData, uid]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart
        data={graphValue}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <PolarGrid />
        <PolarAngleAxis stroke="#FFFFFF" dataKey="subject" />
        <PolarRadiusAxis domain={[0, 10]} />
        <Radar
          name="図鑑完成度"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartComponent;
