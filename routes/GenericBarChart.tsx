import React from 'react';
import Chart from 'react-apexcharts';
import { useDashboard } from '../../../context/DashboardContext';

interface GenericBarChartProps {
  title: string;
  entityType: 'Well' | 'Pipeline' | 'Cluster';
  filterText: string;
}

const GenericBarChart: React.FC<GenericBarChartProps> = ({ title, entityType, filterText }) => {
  const { dataRepresentation, productType } = useDashboard();

  // MOCK DATA GENERATION - Replace with real API calls
  const mockCategories = ['A-01', 'A-02', 'B-01', 'C-05', 'D-10'].filter(
    name => !filterText || name.toLowerCase().includes(filterText.toLowerCase())
  );

  let series: any[] = [];
  let stacked = false;

  if (dataRepresentation === 'Actual') {
    series = [{
      name: `${productType} Actual`,
      data: mockCategories.map(() => Math.floor(Math.random() * 100))
    }];
  } else if (dataRepresentation === 'MinMaxAvg') {
    stacked = true;
    series = [
      { name: 'Min', data: mockCategories.map(() => 20) }, // Base
      { name: 'Avg Delta', data: mockCategories.map(() => 30) }, // Min to Avg
      { name: 'Max Delta', data: mockCategories.map(() => 40) }  // Avg to Max
    ];
  } else if (dataRepresentation === 'Aggregated') {
    series = [{
      name: `Total ${productType}`,
      data: mockCategories.map(() => Math.floor(Math.random() * 1000))
    }];
  }

  const options: ApexCharts.ApexOptions = {
    chart: { type: 'bar', stacked: stacked, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false } },
    xaxis: { categories: mockCategories, title: { text: title } },
    title: { text: `${title} (${productType} - ${dataRepresentation})`, align: 'center' },
    dataLabels: { enabled: false },
    tooltip: { shared: true, intersect: false }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Chart options={options} series={series} type="bar" height="100%" />
    </div>
  );
};

export default GenericBarChart;