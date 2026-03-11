import React from 'react';
import GenericBarChart from './charts/GenericBarChart';
import { useDashboard } from '../../context/DashboardContext';

const DataArea: React.FC = () => {
  const { wellNameFilter, pipelineNameFilter, clusterNameFilter } = useDashboard();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Layout 1: Wells (Top 50%) */}
      <div style={{ height: '50%', borderBottom: '1px solid #eee', padding: '5px' }}>
        <GenericBarChart title="Wells Data" entityType="Well" filterText={wellNameFilter} />
      </div>

      {/* Layout 2 & 3: Pipelines and Clusters (Bottom 50%) */}
      <div style={{ height: '50%', display: 'flex' }}>
        <div style={{ width: '50%', borderRight: '1px solid #eee', padding: '5px' }}>
          <GenericBarChart title="Pipeline Data" entityType="Pipeline" filterText={pipelineNameFilter} />
        </div>
        <div style={{ width: '50%', padding: '5px' }}>
          <GenericBarChart title="Cluster Analyses" entityType="Cluster" filterText={clusterNameFilter} />
        </div>
      </div>
    </div>
  );
};

export default DataArea;