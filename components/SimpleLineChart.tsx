import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatPercent } from '../utils/formatters';

interface ChartData {
    name: string;
    value: number;
}

interface SimpleLineChartProps {
    data: ChartData[];
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500">Keine Daten verfügbar.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(tick) => formatPercent(tick)} tick={{ fontSize: 12 }} />
                <Tooltip
                    formatter={(value: number) => [formatPercent(value), "Anteil"]}
                    labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
                    itemStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{fontSize: 12}} />
                <Line type="monotone" dataKey="value" name="Anteil" stroke="#F53D05" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};