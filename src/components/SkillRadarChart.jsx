import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { skill: "Communication", rating: 80 },
  { skill: "Time Management", rating: 70 },
  { skill: "Values Enhancement", rating: 90 },
  { skill: "Teamwork", rating: 60 },
  { skill: "Critical Thinking", rating: 70 },
  { skill: "Leadership", rating: 80 },
];

const SkillRadarChart = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center rounded-lg py-8 px-4 ">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Skill Analysis
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#ddd" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#333", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: "#555", fontSize: 10 }}
          />
          <Radar
            name="User Skills"
            dataKey="rating"
            stroke="#4188ff"
            fill="#4188ff"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
