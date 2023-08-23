import prisma from '@/utils/prismaClient';
import { Column as ColumnType, Job } from '@prisma/client';

export type ColumnWithJobs = ColumnType & {
    jobs: Job[];
    isNewColumn?: boolean;
};

const initColumns = [
    {
        title: 'Scouted',
        color: '#B4A0D1',
        positionInBoard: 0,
    },
    {
        title: 'Applied',
        color: '#CBD87E',
        positionInBoard: 1,
    },
    {
        title: 'Interview',
        color: '#FDC959',
        positionInBoard: 2,
    },
    {
        title: 'Offer',
        color: '#FE5A35',
        positionInBoard: 3,
    },
    {
        title: 'Rejected',
        color: '#4C9A2A',
        positionInBoard: 4,
    },
];

export const getColumns = async (
    userId: string | undefined
): Promise<ColumnWithJobs[]> => {
    // when user is signed in, try to fetch existing columns
    const res = await prisma.column.findMany({
        where: {
            userId: userId,
        },
        include: {
            jobs: true,
        },
        orderBy: {
            positionInBoard: 'asc',
        },
    });

    // if response if null, create new columns and job for the user.
    if (res.length === 0 && userId) {
        const res = await prisma.column.createMany({
            data: initColumns.map(col => {
                return {
                    ...col,
                    userId,
                };
            }),
        });

        const column = await prisma.column.findFirst({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });

        if (column) {
            const resNewJob = await prisma.job.create({
                data: {
                    title: 'Frontend Developer',
                    companyName: 'Google',
                    userId,
                    columnId: column.id,
                    positionInColumn: 0,
                    url: 'https://example.com/careers',
                },
            });
            console.log('new job:', resNewJob);
        }
        return await getColumns(userId);
    }
    return res;
};
