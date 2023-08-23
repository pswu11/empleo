import dynamic from 'next/dynamic';
import { auth } from '@clerk/nextjs';
import { getColumns } from './getColumns';
import DashboardHeader from '@/components/shared/DashboardHeader';
import DashboardComponent from '../../components/Dashboard';

export default async function Dashboard() {
    const { userId } = auth();
    console.log(userId);
    let userColumns = await getColumns(userId as string);

    return <DashboardComponent userColumns={userColumns} />;
}
