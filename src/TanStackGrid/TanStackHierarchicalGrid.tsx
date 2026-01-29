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
import { generateHierarchyData } from '../data/mockData7';
import type { Entity } from '../data/mockData7';
import './TanStackHierarchicalGrid.css';

// --- GENERIC RECURSIVE TABLE ---
interface RecursiveTableProps {
    data: Entity[];
    level: number;
}

const levelNames = ['Group', 'Subsidiary', 'Division', 'Dept', 'Team', 'Project', 'Task'];
const getLevelLabel = (level: number) => levelNames[level] ?? `Level ${level + 1}`;

const RecursiveTable: React.FC<RecursiveTableProps> = ({ data, level }) => {
    const [expanded, setExpanded] = useState<ExpandedState>({});

    // Config based on level
    const currentName = getLevelLabel(level);
    const hasExpandableRows = data.some((row) => row.children && row.children.length > 0);

    // Dynamic Columns
    const columns = useMemo<ColumnDef<Entity>[]>(() => {
        const baseCols: ColumnDef<Entity>[] = [
            { accessorKey: 'name', header: `${currentName} Name`, size: 200 },
            { accessorKey: 'metric', header: 'Metric' },
            { accessorKey: 'lead', header: 'Lead' },
            { accessorKey: 'status', header: 'Status' }
        ];

        // Add Expander to first col if not leaf
        if (hasExpandableRows) {
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
    }, [currentName, hasExpandableRows]);

    const table = useReactTable({
        data,
        columns,
        state: { expanded },
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: (row) => !!row.original.children?.length
    });

    return (
        <div
            className="tanstack-detail-panel"
            style={{
                borderLeftColor: `var(--level-accent-${level % 6})`,
                background: `var(--level-bg-${level % 4})`
            }}
        >
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
    const rowData = useMemo(() => generateHierarchyData(100, 100), []);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 5;
    const pageCount = Math.ceil(rowData.length / pageSize);
    const pagedData = useMemo(
        () => rowData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
        [pageIndex, pageSize, rowData]
    );

    return (
        <div className="tanstack-wrapper">
            <h3>TanStack Table: Infinite-Depth Hierarchy</h3>
            <p>Click the chevrons to expand nested rows at any depth.</p>
            {/* Start recursion at Level 0 */}
            <RecursiveTable data={pagedData} level={0} />
            <div className="pagination-bar">
                <button
                    className="pagination-button"
                    type="button"
                    onClick={() => setPageIndex(0)}
                    disabled={pageIndex === 0}
                >
                    First
                </button>
                <button
                    className="pagination-button"
                    type="button"
                    onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={pageIndex === 0}
                >
                    Prev
                </button>
                <span>Page {pageIndex + 1} of {pageCount}</span>
                <div className="pagination-pages">
                    {Array.from({ length: Math.min(pageCount, 20) }).map((_, index) => (
                        <button
                            key={`page-${index + 1}`}
                            className="pagination-button"
                            type="button"
                            onClick={() => setPageIndex(index)}
                            disabled={pageIndex === index}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button
                    className="pagination-button"
                    type="button"
                    onClick={() => setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))}
                    disabled={pageIndex >= pageCount - 1}
                >
                    Next
                </button>
                <button
                    className="pagination-button"
                    type="button"
                    onClick={() => setPageIndex(pageCount - 1)}
                    disabled={pageIndex >= pageCount - 1}
                >
                    Last
                </button>
            </div>
        </div>
    );
};

export default TanStackHierarchicalGrid;
