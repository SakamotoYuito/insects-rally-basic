import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import styles from "./style.module.scss";

type Props = {
  answered: number;
};

export const ChartComponent = ({ answered }: Props) => {
  const colors = ["#00C49F", "#FF8042"];
  const data = [
    { name: "クリア済み", value: answered },
    { name: "未クリア", value: 39 - answered },
  ];
  return (
    <div className={styles.container}>
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
