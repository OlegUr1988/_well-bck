import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ProductType = 'BOE' | 'GAS' | 'OIL' | 'WATER';
export type DataRepresentation = 'Actual' | 'MinMaxAvg' | 'Aggregated';

interface DashboardState {
  // Filters
  wellNameFilter: string;
  pipelineNameFilter: string;
  clusterNameFilter: string;
  
  // Time
  startDate: Date;
  endDate: Date;
  
  // View Settings
  productType: ProductType;
  dataRepresentation: DataRepresentation;
}

interface DashboardContextType extends DashboardState {
  setWellNameFilter: (val: string) => void;
  setPipelineNameFilter: (val: string) => void;
  setClusterNameFilter: (val: string) => void;
  setTimeRange: (start: Date, end: Date) => void;
  setProductType: (val: ProductType) => void;
  setDataRepresentation: (val: DataRepresentation) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [wellNameFilter, setWellNameFilter] = useState('');
  const [pipelineNameFilter, setPipelineNameFilter] = useState('');
  const [clusterNameFilter, setClusterNameFilter] = useState('');
  
  // Default 1 week back
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  
  const [productType, setProductType] = useState<ProductType>('BOE');
  const [dataRepresentation, setDataRepresentation] = useState<DataRepresentation>('MinMaxAvg');

  const setTimeRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <DashboardContext.Provider value={{
      wellNameFilter, setWellNameFilter,
      pipelineNameFilter, setPipelineNameFilter,
      clusterNameFilter, setClusterNameFilter,
      startDate, endDate, setTimeRange,
      productType, setProductType,
      dataRepresentation, setDataRepresentation
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};