import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { MusicalAttributes } from '../types';

interface Props {
  data: MusicalAttributes;
  colors: string[];
}

const AttributeChart: React.FC<Props> = ({ data, colors }) => {
  const chartData = [
    { subject: 'Energy', A: data.energy, fullMark: 100 },
    { subject: 'Dance', A: data.danceability, fullMark: 100 },
    { subject: 'Joy', A: data.valence, fullMark: 100 },
    { subject: 'Acoustic', A: data.acousticness, fullMark: 100 },
    { subject: 'Future', A: data.futurism, fullMark: 100 },
  ];

  const primaryColor = colors[0] || '#8884d8';
  const accentColor = colors[1] || '#82ca9d';

  return (
    <div className="w-full h-64 animate-float">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Space Grotesk' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Attributes"
            dataKey="A"
            stroke={primaryColor}
            strokeWidth={2}
            fill={primaryColor}
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttributeChart;