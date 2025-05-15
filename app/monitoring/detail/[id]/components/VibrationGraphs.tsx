// 진동 그래프 카드 리스트 컴포넌트
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';
import {
  VibrationGraphContainer,
  VibrationGraphCard,
  CustomTooltip,
} from '../styles';
import { colors } from '@/app/styles/colors';

interface VibrationDataPoint {
  time: string;
  value: number;
}

type ChartColorSet = {
  line: string;
  fill: string;
};

interface VibrationGraphsProps {
  vibrationSensors: VibrationDataPoint[];
  colorAssignments: Record<string, ChartColorSet>;
  handleGraphClick: (sensor: VibrationDataPoint) => void;
  selectedSensor?: { detailedData: VibrationDataPoint[] };
}

const VibrationGraphs: React.FC<VibrationGraphsProps> = ({
  vibrationSensors,
  colorAssignments,
  handleGraphClick,
  selectedSensor,
}) => {
  const chartData = useMemo(() => {
    if (!vibrationSensors || vibrationSensors.length === 0) return [];
    // 모든 값이 같으면 더 큰 노이즈(0.01) 추가
    if (
      vibrationSensors.length > 1 &&
      vibrationSensors.every((d) => d.value === vibrationSensors[0].value)
    ) {
      return vibrationSensors.map((item, i) => ({
        ...item,
        value:
          typeof item.value === 'number'
            ? item.value + (i % 2 === 0 ? 0.01 : -0.01)
            : Number(item.value) + (i % 2 === 0 ? 0.01 : -0.01),
      }));
    }
    return vibrationSensors;
  }, [vibrationSensors]);

  return (
    <VibrationGraphContainer>
      {vibrationSensors.map((sensor) => (
        <VibrationGraphCard
          key={sensor.time}
          onClick={() => handleGraphClick(sensor)}
          style={{ cursor: 'pointer' }}
        >
          <h4>
            {sensor.time}
            <span className="status">정상</span>
          </h4>
          <div className="graph-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id={`gradient-${sensor.time}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colorAssignments[sensor.time].line}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={colorAssignments[sensor.time].line}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colors.chart.grid.line}
                  opacity={colors.chart.grid.opacity}
                />
                <ReferenceLine
                  y={0.5}
                  stroke="#04A777"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <ReferenceLine
                  y={1.0}
                  stroke="#FFD600"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <ReferenceLine
                  y={1.5}
                  stroke="#D90429"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.chart.axis.line }}
                />
                <YAxis
                  domain={[0, 2]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.chart.axis.line }}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <CustomTooltip>
                          <div className="time">{label}</div>
                          <div className="value">
                            {Number(payload[0].value).toFixed(2)}g
                          </div>
                        </CustomTooltip>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colorAssignments[sensor.time].line}
                  strokeWidth={3}
                  fill={`url(#gradient-${sensor.time})`}
                  fillOpacity={1}
                  isAnimationActive={false}
                  dot={true}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff007a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls={true}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </VibrationGraphCard>
      ))}
    </VibrationGraphContainer>
  );
};

export default VibrationGraphs;
