import prisma from '@/utils/prismaClient';
import EditForm from './EditForm';
import { getJob } from '@/lib/getJob';

type Props = {
    params: {
        id: string;
    };
};

export default async function EditPage({ params }: Props) {
    const singleJobEdit = await getJob(params.id);
    if (!singleJobEdit) {
        throw new Error('No job found');
    }

    console.log("in edit page:", singleJobEdit)
    return <EditForm editSingleJob={singleJobEdit} />;
}
