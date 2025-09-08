'use client';
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Props = {
  distribution: Record<string, number>;
};

// Nouvelles couleurs plus contrastées
const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // green-500  
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6'  // violet-500
];

// Fonction pour formatter le tooltip
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Afficher le pourcentage seulement s'il est supérieur à 5%
  if (percent > 0.05) {
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }
  return null;
};

export default function RatingDistributionChart({ distribution }: Props) {
  const data = [1, 2, 3, 4, 5].map(i => ({
    rating: `⭐ ${i}`,
    count: distribution[String(i)] ?? 0,
    percentage: ((distribution[String(i)] ?? 0) / Object.values(distribution).reduce((a, b) => a + b, 0)) * 100
  })).filter(item => item.count > 0); // Filtrer les notes avec 0 occurrence

  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">
            {payload[0].payload.rating}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Nombre: {payload[0].value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Pourcentage: {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {entry.value}: {data[index]?.count || 0}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="count"
            nameKey="rating"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="#1F2937"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Affichage du total */}
      <div className="text-center mt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total: {total} feedbacks
        </p>
      </div>
    </div>
  );
}