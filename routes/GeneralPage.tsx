import React from 'react';
import DataArea from './DataArea';
import { useDashboard, ProductType } from '../../context/DashboardContext';

const GeneralPage: React.FC = () => {
  const { startDate, endDate, setTimeRange, productType, setProductType } = useDashboard();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      
      {/* Layout 1: KPI Area (Top 10% Vertical) */}
      <div style={{ height: '10%', borderBottom: '1px solid #ccc', padding: '10px' }}>
        <h2>High Level Production KPI</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
           <span>Total Production: 15,000 bbl</span>
           <span>Efficiency: 98%</span>
        </div>
      </div>

      <div style={{ display: 'flex', height: '90%' }}>
        
        {/* Layout 2: Controls (Left 10% Horizontal) */}
        <div style={{ width: '10%', borderRight: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Time Filter */}
          <div>
            <h4>Time</h4>
            <label>Start</label>
            <input type="date" value={startDate.toISOString().split('T')[0]} onChange={(e) => setTimeRange(new Date(e.target.value), endDate)} />
            <label>End</label>
            <input type="date" value={endDate.toISOString().split('T')[0]} onChange={(e) => setTimeRange(startDate, new Date(e.target.value))} />
            <input type="range" style={{ width: '100%', marginTop: '10px' }} />
          </div>

          {/* Product Type Selector */}
          <div>
            <h4>Product Type</h4>
            {(['BOE', 'GAS', 'OIL', 'WATER'] as ProductType[]).map((type) => (
              <label key={type} style={{ display: 'block' }}>
                <input type="radio" name="productType" checked={productType === type} onChange={() => setProductType(type)} /> {type}
              </label>
            ))}
          </div>
        </div>

        {/* Layout 3: Data Area (Right 90% Horizontal) */}
        <div style={{ width: '90%' }}><DataArea /></div>
      </div>
    </div>
  );
};

export default GeneralPage;