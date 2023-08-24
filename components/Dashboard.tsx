'use client';

import { useState } from 'react';
import { ColumnWithJobs } from '../app/(dashboard)/getColumns';
import { JobsWithCols } from '../app/(dashboard)/getJobs';
import dynamic from 'next/dynamic';
import BasicTable from '@/components/BasicTable';
import DashboardHeader from '@/components/shared/DashboardHeader';

type Props = {
    userColumns: ColumnWithJobs[];
    userJobs: JobsWithCols[];
};
const BoardNoSSR = dynamic(() => import('@/components/Board'), { ssr: false });

function Dashboard({ userColumns, userJobs }: Props) {
    const [toggleViewMode, setToggleViewMode] = useState(false);
    const [filter, setFilter] = useState('');
    return (
        <>
            <div className="ml-xl">
                <DashboardHeader
                    filter={filter}
                    setFilter={setFilter}
                    onToggle={setToggleViewMode}
                    toggleViewMode={toggleViewMode}
                />
                <div>
                    {toggleViewMode ? (
                        <BoardNoSSR columnData={userColumns} />
                    ) : (
                        <BasicTable
                            filter={filter}
                            setFilter={setFilter}
                            jobData={userJobs}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default Dashboard;
