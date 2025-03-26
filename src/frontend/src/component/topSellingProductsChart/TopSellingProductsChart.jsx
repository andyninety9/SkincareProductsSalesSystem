/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Card, Select } from 'antd';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

export default function TopSellingProductsChart({ topSellingProducts, processChartData, formatCurrency }) {
    const [chartType, setChartType] = useState('bar');

    const chartOptions = [
        { label: 'Bar Chart', value: 'bar' },
        { label: 'Line Chart', value: 'line' },
        { label: 'Area Chart', value: 'area' },
        { label: 'Pie Chart', value: 'pie' },
    ];

    return (
        <Card
            title={
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <span>Top Selling Products Chart</span>
                    <Select value={chartType} onChange={setChartType} options={chartOptions} style={{ width: 120 }} />
                </div>
            }
            style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height={300}>
                    {chartType === 'bar' && (
                        <BarChart data={processChartData(topSellingProducts)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="productName" />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#8884d8"
                                label={{
                                    value: 'Quantity',
                                    angle: -90,
                                    position: 'insideLeft',
                                }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#82ca9d"
                                label={{ value: 'Revenue', angle: 90, position: 'insideRight' }}
                            />
                            <Tooltip
                                formatter={(value, name) => (name === 'revenue' ? formatCurrency(value) : value)}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="quantitySold" name="Quantity Sold" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
                        </BarChart>
                    )}
                    {chartType === 'line' && (
                        <LineChart
                            data={processChartData(topSellingProducts)}
                            margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="productName"
                                tick={{
                                    fontSize: 11,
                                    fill: '#333',
                                    width: 120,
                                }}
                                interval={0}
                                angle={-65}
                                textAnchor="end"
                                height={100}
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#8884d8"
                                label={{
                                    value: 'Quantity Sold',
                                    angle: -90,
                                    position: 'insideLeft',
                                }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#82ca9d"
                                label={{
                                    value: 'Revenue (VND)',
                                    angle: 90,
                                    position: 'insideRight',
                                }}
                            />
                            <Tooltip
                                formatter={(value, name) => (name === 'revenue' ? formatCurrency(value) : value)}
                                labelFormatter={(label) => `Product: ${label}`}
                            />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="quantitySold"
                                name="Quantity Sold"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                                dot={{ stroke: '#8884d8', strokeWidth: 2, r: 6, fill: 'white' }}
                                isAnimationActive={true}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue"
                                stroke="#82ca9d"
                                activeDot={{ r: 8 }}
                                dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 6, fill: 'white' }}
                                isAnimationActive={true}
                            />
                        </LineChart>
                    )}
                    {chartType === 'area' && (
                        <AreaChart data={topSellingProducts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="productName" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => (name === 'revenue' ? formatCurrency(value) : value)}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="quantitySold"
                                name="Quantity Sold"
                                stroke="#8884d8"
                                fill="#8884d8"
                            />
                            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#82ca9d" fill="#82ca9d" />
                        </AreaChart>
                    )}
                    {chartType === 'pie' && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                height: '100%',
                            }}>
                            <div style={{ width: '45%', height: '100%' }}>
                                <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Quantity Sold</p>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={processChartData(topSellingProducts)}
                                            nameKey="productName"
                                            dataKey="quantitySold"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius={65}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                            labelLine={{
                                                stroke: '#555',
                                                strokeWidth: 1,
                                                strokeDasharray: '3 3',
                                            }}>
                                            {processChartData(topSellingProducts).map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={`hsl(${(index * 30) % 360}, 70%, 60%)`}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => value}
                                            labelFormatter={(name) => `Product: ${name}`}
                                        />
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                            wrapperStyle={{
                                                fontSize: '12px',
                                                maxWidth: '40%',
                                                overflowY: 'auto',
                                                maxHeight: '200px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ width: '45%', height: '100%' }}>
                                <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Revenue</p>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={processChartData(topSellingProducts)}
                                            nameKey="productName"
                                            dataKey="revenue"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius={65}
                                            fill="#82ca9d"
                                            paddingAngle={5}
                                            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                            labelLine={{
                                                stroke: '#555',
                                                strokeWidth: 1,
                                                strokeDasharray: '3 3',
                                            }}>
                                            {processChartData(topSellingProducts).map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={`hsl(${(index * 30) % 360}, 70%, 60%)`}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => formatCurrency(value)}
                                            labelFormatter={(name) => `Product: ${name}`}
                                        />
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                            wrapperStyle={{
                                                fontSize: '12px',
                                                maxWidth: '40%',
                                                overflowY: 'auto',
                                                maxHeight: '200px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
