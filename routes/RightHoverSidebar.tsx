import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const RightHoverSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    setWellNameFilter, 
    setPipelineNameFilter, 
    setClusterNameFilter,
    dataRepresentation,
    setDataRepresentation
  } = useDashboard();

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div 
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: isOpen ? '10%' : '10px',
        backgroundColor: isOpen ? '#f8f9fa' : 'transparent',
        borderLeft: isOpen ? '1px solid #ddd' : 'none',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        padding: isOpen ? '10px' : '0',
        overflow: 'hidden'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Filters</h3>
          
          {/* Name Filters */}
          <div>
            <label>Well Name</label>
            <input type="text" placeholder="e.g. Well-01, A-12" onChange={(e) => setWellNameFilter(e.target.value)} />
          </div>
          <div>
            <label>Pipe Name</label>
            <input type="text" placeholder="Filter pipelines..." onChange={(e) => setPipelineNameFilter(e.target.value)} />
          </div>
          <div>
            <label>Cluster Name</label>
            <input type="text" placeholder="Filter clusters..." onChange={(e) => setClusterNameFilter(e.target.value)} />
          </div>

          {/* Data Presentation Type */}
          <div>
            <h4>Data Presentation</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label><input type="radio" name="dataRep" checked={dataRepresentation === 'Actual'} onChange={() => setDataRepresentation('Actual')} /> Actual</label>
              <label><input type="radio" name="dataRep" checked={dataRepresentation === 'MinMaxAvg'} onChange={() => setDataRepresentation('MinMaxAvg')} /> Min, Max, Avg</label>
              <label><input type="radio" name="dataRep" checked={dataRepresentation === 'Aggregated'} onChange={() => setDataRepresentation('Aggregated')} /> Aggregated</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightHoverSidebar;