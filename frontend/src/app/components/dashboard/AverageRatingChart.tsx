'use client';
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Row = { offer: string; avg: number; count: number };

export default function AverageRatingChart({ data }: { data: Row[] }) {
  // We'll show top 10 offers (already limited on backend)
  const top = data.slice(0, 10).map(d => ({ name: d.offer, avg: d.avg }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={top}>
          <XAxis type="number" domain={[0,5]} />
          <YAxis dataKey="name" type="category" width={300} />
          <Tooltip />
          <Bar dataKey="avg" fill="#0d47a1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}