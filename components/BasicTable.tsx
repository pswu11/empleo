'use client';
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    SortingState,
} from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { HiArchive, HiPencil, HiTrash } from 'react-icons/hi';
import { BiPlus, BiMinus } from 'react-icons/bi';
import { BsArrowDownShort, BsArrowUpShort, BsSquare } from 'react-icons/bs';
import Button from './shared/Button';
import { JobsWithCols } from '@/app/(dashboard)/getJobs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Checkbox from './Checkbox';
import { AiOutlineEye } from 'react-icons/ai';

type TableViewProps = {
    jobData: JobsWithCols[];
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
};

type ColumnType = {
    title: string;
    color: string;
};

export default function BasicTable({
    jobData,
    filter,
    setFilter,
}: TableViewProps) {
    const { data: jobsData }: { data: JobsWithCols[] } = useQuery({
        queryKey: ['jobs'],
        queryFn: () => axios.get('/api/job').then(res => res.data),
        initialData: jobData,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState({});
    const [isSelectorVisible, setIsSelectorVisible] = useState(false);

    const queryClient = useQueryClient();
    // delete job
    const deleteJob = useMutation({
        mutationFn: (id: string) => axios.delete(`/api/job/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['jobs']);
            toast.success('Job deleted');
        },
    });
    const archiveJob = useMutation({
        mutationFn: (id: string) =>
            axios.patch(`/api/job/${id}`, { isArchived: true }),
        onSuccess: () => {
            queryClient.invalidateQueries(['jobs']);
            toast.success('Job archived');
        },
    });

    const data = useMemo(() => jobsData, [jobsData]);
    //define cols
    const columns: ColumnDef<JobsWithCols>[] = [
        {
            header: ({ table }) => (
                <Checkbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            accessorKey: 'checked',
            cell: ({ row }) => (
                <Checkbox
                    {...{
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
            ),
            enableSorting: false,
        },
        {
            id: 'Job',
            header: 'Job',
            accessorKey: 'title',
            footer: 'Job',
        },
        {
            id: 'Company',
            header: 'Company',
            accessorKey: 'companyName',
        },
        {
            id: 'Location',
            header: 'Location',
            accessorKey: 'location',
        },
        {
            id: 'Status',
            header: 'Status',
            accessorKey: 'column',
            cell: ({ cell }) => {
                const columnValues = cell.getValue() as ColumnType;
                return (
                    <span
                        style={{ backgroundColor: columnValues.color }}
                        className="text-cardColors-black py-xxs px-xs rounded-sm font-500"
                    >
                        {columnValues.title}
                    </span>
                );
            },
            sortingFn: (a, b) => {
                const aValue = a.getValue('Status') as ColumnType;
                const bValue = b.getValue('Status') as ColumnType;
                return aValue.title > bValue.title ? 1 : -1;
            },
        },
        {
            id: 'Deadline',
            header: 'Deadline',
            accessorKey: 'deadline',
            cell: ({ cell }) => {
                const formattedDate =
                    cell.getValue() === null
                        ? 'no deadline'
                        : new Date(cell.getValue() as string).toLocaleString(
                              'en-US',
                              {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                              }
                          );
                return <span>{formattedDate}</span>;
            },
        },
        {
            id: 'Remote',
            header: 'Remote',
            accessorKey: 'remoteType',
        },
        {
            id: 'Actions',
            header: 'Actions',
            accessorKey: 'actions',
            cell: cell => {
                const jobId = cell.row.original.id;
                const isArchived = cell.row.original.isArchived;
                return (
                    <div className="flex justify-around cursor-pointer">
                        <Link href={`/single/${jobId}`}>
                            <AiOutlineEye size={20} />
                        </Link>
                        <Link href={`/edit-job/${jobId}`}>
                            <HiPencil size={20} />
                        </Link>

                        <HiArchive
                            size={20}
                            onClick={() =>
                                isArchived ? null : archiveJob.mutate(jobId)
                            }
                            className={`${
                                isArchived ? 'text-basicColors-dark' : ''
                            }`}
                        />
                        <HiTrash
                            size={20}
                            className="hover:text-cardColors-red"
                            onClick={() => deleteJob.mutate(jobId)}
                        />
                    </div>
                );
            },
        },
    ];
    let [sorting, setSorting] = useState<SortingState>([]);

    const jobDataTable = useReactTable({
        data,
        columns,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filter,
            rowSelection,
            columnVisibility,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onGlobalFilterChange: setFilter,
    });

    return (
        <div className="ui-background border px-m py-m space-y-s min-h-[550px]">
            <div className="flex justify-between">
                <div className="flex gap-s">
                    <Button
                        variant="primary"
                        size="tiny"
                        onClick={() => jobDataTable.setPageIndex(0)}
                        disabled={!jobDataTable.getCanPreviousPage()}
                        className=" disabled:hover:bg-transparent disabled:opacity-30"
                    >
                        First Page
                    </Button>
                    <button
                        onClick={() => jobDataTable.previousPage()}
                        disabled={!jobDataTable.getCanPreviousPage()}
                        className=" disabled:hover:bg-transparent disabled:opacity-30"
                    >
                        <BiMinus
                            size={26}
                            className=" border transition-colors ease-in-out bg-transparent rounded-full   text-basicColors-light hover:bg-hoverColors-hover hover:text-hoverColors-hoverMain"
                        />
                    </button>
                    <button
                        className="disabled:hover:bg-transparent disabled:opacity-30  "
                        onClick={() => jobDataTable.nextPage()}
                        disabled={!jobDataTable.getCanNextPage()}
                    >
                        <BiPlus
                            size={26}
                            className="border transition-colors ease-in-out bg-transparent rounded-full  text-basicColors-light hover:bg-hoverColors-hover hover:text-hoverColors-hoverMain d"
                        />
                    </button>
                    <Button
                        size="tiny"
                        disabled={!jobDataTable.getCanNextPage()}
                        className=" disabled:hover:bg-transparent disabled:opacity-30"
                        onClick={() =>
                            jobDataTable.setPageIndex(
                                jobDataTable.getPageCount() - 1
                            )
                        }
                    >
                        Last Page
                    </Button>
                </div>
                <div className="flex gap-s relative">
                    {Object.keys(rowSelection).length !== 0 && (
                        <>
                            <Button size="tiny" variant="secondary">
                                Delete
                            </Button>
                            <Button size="tiny" variant="secondary">
                                Archive
                            </Button>
                        </>
                    )}
                    <Button
                        onClick={() => setIsSelectorVisible(!isSelectorVisible)}
                        size="tiny"
                    >
                        Select Columns
                    </Button>
                    {isSelectorVisible && (
                        <div className="flex flex-col absolute ui-background border top-xl px-s py-xs rounded-xl">
                            <label className='flex gap-xs'>
                                <input
                                    {...{
                                        type: 'checkbox',
                                        checked:
                                            jobDataTable.getIsAllColumnsVisible(),
                                        onChange:
                                            jobDataTable.getToggleAllColumnsVisibilityHandler(),
                                    }}
                                />
                                Toggle All
                            </label>
                            {jobDataTable.getAllLeafColumns().map(column => {
                                return (
                                    <div key={column.id} className="px-1">
                                        <label className='flex gap-xs'>
                                            <input
                                                {...{
                                                    type: 'checkbox',
                                                    checked:
                                                        column.getIsVisible(),
                                                    onChange:
                                                        column.getToggleVisibilityHandler(),
                                                }}
                                            />
                                            {column.id}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <Link href="/new-job">
                        <Button size="tiny">New Job</Button>
                    </Link>
                </div>
            </div>
            <table className="container">
                <thead className="">
                    {jobDataTable.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    className="border px-s h-[3.5rem] text-left font-600"
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {header.column.columnDef.header ===
                                    'check' ? (
                                        <BsSquare
                                            size={21}
                                            className="mx-auto"
                                        />
                                    ) : (
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )
                                    )}
                                    {header.column.getIsSorted() ===
                                    false ? null : header.column.getIsSorted() ===
                                      'asc' ? (
                                        <BsArrowUpShort
                                            size={18}
                                            className="inline-block ml-xs"
                                        />
                                    ) : (
                                        <BsArrowDownShort
                                            size={18}
                                            className="inline-block ml-xs"
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {jobDataTable.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className="odd:bg-[#f2f2f2] odd:bg-opacity-5 "
                        >
                            {row.getVisibleCells().map(cell => {
                                const values = cell.getValue() as {
                                    title: string;
                                    color: string;
                                };

                                return (
                                    <td
                                        key={cell.id}
                                        className="border h-[3.5rem] px-s"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
