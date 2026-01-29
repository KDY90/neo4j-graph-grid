import React, { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    flexRender,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    ExpandedState,
} from '@tanstack/react-table';
import { mockData7 } from '../data/mockData7';
import type { Entity } from '../data/mockData7';
import './TanStackHierarchicalGrid.css';

// --- GENERIC RECURSIVE TABLE ---
interface RecursiveTableProps {
    data: Entity[];
    level: number;
}

const RecursiveTable: React.FC<RecursiveTableProps> = ({ data, level }) => {
    const [expanded, setExpanded] = useState<ExpandedState>({});

    // Config based on level
    const levelNames = ['Group', 'Subsidiary', 'Division', 'Dept', 'Team', 'Project', 'Task'];
    const currentName = levelNames[level] || 'Item';
    const isLeaf = level >= 6;

    // Dynamic Columns
    const columns = useMemo<ColumnDef<Entity>[]>(() => {
        const baseCols: ColumnDef<Entity>[] = [
            { accessorKey: 'name', header: `${currentName} Name`, size: 200 },
            { accessorKey: 'metric', header: 'Metric' },
            { accessorKey: 'lead', header: 'Lead' },
            { accessorKey: 'status', header: 'Status' }
        ];

        // Add Expander to first col if not leaf
        if (!isLeaf) {
            baseCols.unshift({
                id: 'expander',
                header: () => null,
                cell: ({ row }) => {
                    const hasChildren = row.original.children && row.original.children.length > 0;
                    return hasChildren ? (
                        <button onClick={row.getToggleExpandedHandler()} className="btn-toggle">
                            {row.getIsExpanded() ? '▼' : '▶'}
                        </button>
                    ) : null;
                },
                size: 40
            });
        }
        return baseCols;
    }, [level, currentName, isLeaf]);

    const table = useReactTable({
        data,
        columns,
        state: { expanded },
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => !isLeaf
    });

    return (
        <div className={`tanstack-detail-panel level-${level}`}>
            <h4 className='level-header'>Level {level + 1}: {currentName}s</h4>
            <table className="tanstack-table detail-table">
                <thead>{table.getHeaderGroups().map(g => <tr key={g.id}>{g.headers.map(h => <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}</thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <React.Fragment key={row.id}>
                            <tr key={row.id}>{row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>
                            {row.getIsExpanded() && row.original.children && (
                                <tr>
                                    <td colSpan={columns.length} style={{ padding: 0 }}>
                                        {/* RECURSIVE CALL */}
                                        <RecursiveTable data={row.original.children} level={level + 1} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- MAIN WRAPPER (Level 0) with SCROLL ---
const TanStackHierarchicalGrid: React.FC = () => {
    return (
        <div className="tanstack-wrapper" style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <h3>TanStack Table: 7-Level Recursive Hierarchy</h3>
            <p>Using a Generic Recursive Component</p>
            {/* Start recursion at Level 0 */}
            <RecursiveTable data={mockData7} level={0} />
        </div>
    );
};

export default TanStackHierarchicalGrid;
