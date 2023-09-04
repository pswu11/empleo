'use client';
import { HiDotsHorizontal } from 'react-icons/hi';
import React, { useContext } from 'react';
import { cn } from '@/lib/utils';

type DdTabProps = {
    children: React.ReactNode[];
    className?: string;
};

type DdListProps = {
    children: React.ReactNode[] | React.ReactNode;
    className?: string;
};

type DdTriggerProps = {
    children?: React.ReactNode[] | React.ReactNode;
    className?: string;
    style?: {};
};
type DdContentProps = {
    children: React.ReactNode[] | React.ReactNode;
    className?: string;
};

const TabsContext = React.createContext({
    value: false,
    setValue: (value: boolean) => {},
});

export default function DropDownFrame({ children, className }: DdTabProps) {
    const [value, setValue] = React.useState(false);

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

export function DropDownList({ children, className }: DdListProps) {
    const { value } = useContext(TabsContext);
    return (
        value && (
            <ul
                className={cn(
                    'absolute top-[10px] right-[0px] z-[9999]',
                    className
                )}
            >
                {children}
            </ul>
        )
    );
}
export function DropDownItems({ children, className }: DdContentProps) {
    return (
        <li
            className={cn(
                'hover:bg-hoverColors-hover text-basicColors-light rounded-sm p-xxs',
                className
            )}
        >
            {children}
        </li>
    );
}

export function DropDownTrigger({
    children,
    className,
    style,
}: DdTriggerProps) {
    const { value, setValue } = React.useContext(TabsContext);
    return (
        <li
            style={style}
            className={cn('', className)}
            onClick={() => {
                setValue(!value);
            }}
        >
            {children}
        </li>
    );
}
