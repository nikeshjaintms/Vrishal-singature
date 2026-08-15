import React, { useMemo } from 'react';

const StatusFilter = ({ entity }) => {
    const counts = useMemo(() => {
        if (!entity) return { pending: 0, approved: 0, rejected: 0 };
        return {
            pending: entity.filter(item => item.status === 1).length,
            approved: entity.filter(item => item.status === 2).length,
            rejected: entity.filter(item => item.status === 3).length
        };
    }, [entity]);

    return counts;
}

export default StatusFilter;