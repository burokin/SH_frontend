import React from 'react';
import { Empty } from 'antd';

const ReportsTab: React.FC = () => {
  return (
    <div
      style={{
        minHeight: 240,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Empty
        description={
          <span style={{ fontSize: 18 }}>Раздел находится в разработке</span>
        }
      />
    </div>
  );
};

export default ReportsTab;
