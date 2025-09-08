import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatCard({ title, value, icon, trend = 'neutral' }: StatCardProps) { 
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return ( 
    <div className="bg-white rounded-xl border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700 shadow-theme-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center dark:bg-gray-700">
          <span className="text-2xl">{icon}</span>
        </div>
        <span className={`text-lg font-semibold ${trendColors[trend]}`}>
          {trendIcons[trend]}
        </span>
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </h3>
      </div>
    </div>
  ); 
}