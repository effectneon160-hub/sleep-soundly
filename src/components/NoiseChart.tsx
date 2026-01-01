import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DecibelReading } from '@/types/sleep';
import { format } from 'date-fns';

interface NoiseChartProps {
  readings: DecibelReading[];
  height?: number;
}

export function NoiseChart({ readings, height = 200 }: NoiseChartProps) {
  const chartData = useMemo(() => {
    return readings.map(r => ({
      time: r.timestamp,
      decibel: r.decibel,
      formattedTime: format(new Date(r.timestamp), 'HH:mm')
    }));
  }, [readings]);

  const getColor = (value: number) => {
    if (value > 50) return 'hsl(0 72% 51%)';
    if (value > 30) return 'hsl(45 93% 58%)';
    return 'hsl(142 76% 46%)';
  };

  if (readings.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="decibelGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(174 72% 56%)" stopOpacity={0.6} />
            <stop offset="50%" stopColor="hsl(174 72% 56%)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(174 72% 56%)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        
        <XAxis 
          dataKey="formattedTime" 
          stroke="hsl(215 20% 55%)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        
        <YAxis 
          stroke="hsl(215 20% 55%)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          ticks={[0, 30, 50, 100]}
        />
        
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222 47% 10%)',
            border: '1px solid hsl(222 30% 18%)',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 4px 24px hsl(222 47% 4% / 0.5)'
          }}
          labelStyle={{ color: 'hsl(210 40% 98%)', fontWeight: 600 }}
          itemStyle={{ color: 'hsl(174 72% 56%)' }}
          formatter={(value: number) => [`${value} dB`, 'Noise Level']}
          labelFormatter={(label) => `Time: ${label}`}
        />
        
        <ReferenceLine 
          y={30} 
          stroke="hsl(142 76% 46%)" 
          strokeDasharray="3 3" 
          strokeOpacity={0.5}
        />
        <ReferenceLine 
          y={50} 
          stroke="hsl(0 72% 51%)" 
          strokeDasharray="3 3" 
          strokeOpacity={0.5}
        />
        
        <Area
          type="monotone"
          dataKey="decibel"
          stroke="hsl(174 72% 56%)"
          strokeWidth={2}
          fill="url(#decibelGradient)"
          dot={false}
          activeDot={{
            r: 6,
            stroke: 'hsl(174 72% 56%)',
            strokeWidth: 2,
            fill: 'hsl(222 47% 6%)'
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
