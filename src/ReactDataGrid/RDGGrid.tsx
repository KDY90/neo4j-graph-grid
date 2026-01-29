import React, { useState, useMemo } from 'react';
import { DataGrid } from 'react-data-grid';
import type { RenderCellProps } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { mockData7 } from '../data/mockData7';
import type { Entity } from '../data/mockData7';

// --- GENERIC NESTED RDG COMPONENT ---
// Recursive Row Injection Wrapper
interface NestedRDGProps {
    items: Entity[];
    level: number;
}

const levelNames = ['Group', 'Subsidiary', 'Division', 'Dept', 'Team', 'Project', 'Task'];
const getLevelLabel = (level: number) => levelNames[level] ?? `Level ${level + 1}`;

const NestedRDG: React.FC<NestedRDGProps> = ({ items, level }) => {
    // Flatten rows for RDG + Injection
    // We start with the items. When expanded, we inject a 'DETAIL' row.
    const [rows, setRows] = useState<any[]>(items.map((i: any) => ({ ...i, type: 'MASTER', expanded: false })));

    // Levels: 0=Group -> 6=Task
    const currentName = getLevelLabel(level);

    // Toggle Handler
    const toggleRow = (id: string, childrenData: Entity[]) => {
        if (!childrenData || childrenData.length === 0) return;

        const idx = rows.findIndex(r => r.id === id);
        if (idx === -1) return;
        const row = rows[idx];
        const nextRow = rows[idx + 1];

        const newRows = [...rows];
        if (row.expanded) {
            // Collapse
            if (nextRow && nextRow.type === 'DETAIL') {
                newRows.splice(idx + 1, 1);
            }
            newRows[idx] = { ...row, expanded: false };
        } else {
            // Expand
            newRows[idx] = { ...row, expanded: true };
            newRows.splice(idx + 1, 0, { type: 'DETAIL', id: id + '_det', parentId: id, data: childrenData });
        }
        setRows(newRows);
    };

    const estimateDetailHeight = (childrenData: Entity[], depth: number) => {
        const baseRowHeight = 46;
        const headerHeight = 52;
        const padding = 32;
        const rowsCount = Math.max(childrenData.length, 1);
        return headerHeight + rowsCount * baseRowHeight + padding + depth * 6;
    };

    // Columns Definition
    const columns = useMemo(() => {
        // Master Columns
        const cols: any[] = [
            {
                key: 'name',
                name: `L${level + 1}: ${currentName}`,
                width: 300,
                renderCell: (p: RenderCellProps<any>) => {
                    if (p.row.type === 'DETAIL') {
                        // RENDER RECURSIVE CHILD
                        return (
                            <div style={{ padding: 20, background: level % 2 === 0 ? '#fffdf1' : '#fff8cc' }}>
                                <NestedRDG items={p.row.data} level={level + 1} />
                            </div>
                        );
                    }
                    // Master Row
                    const hasChildren = p.row.children && p.row.children.length > 0;
                    return (
                        <div style={{ display: 'flex', gap: 10, cursor: hasChildren ? 'pointer' : 'default' }}
                            onClick={() => hasChildren && toggleRow(p.row.id, p.row.children)}>
                            {hasChildren && <span style={{ fontWeight: 'bold' }}>{p.row.expanded ? '▼' : '▶'}</span>}
                            {p.row.name}
                        </div>
                    );
                },
                colSpan: (args: any) => args.type === 'ROW' && args.row.type === 'DETAIL' ? 4 : undefined
            },
            { key: 'metric', name: 'Metric', width: 150 },
            { key: 'lead', name: 'Lead', width: 150 },
            { key: 'status', name: 'Status', width: 150 }
        ];
        return cols;
    }, [level, rows]); // Re-calc if rows change (expand state)

    const gridHeight = useMemo(() => {
        const baseRowHeight = 45;
        const headerHeight = 52;
        const buffer = 32;
        return headerHeight + rows.length * baseRowHeight + buffer;
    }, [rows.length]);

    return (
        <DataGrid
            columns={columns}
            rows={rows}
            rowHeight={(args: any) => args.type === 'DETAIL' ? 400 : 45} // 400px for nested grid
            className="rdg-light"
            style={{ height: gridHeight, minHeight: 120 }}
        />
    );
};

const RDGGrid: React.FC = () => {
    return (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <h3>React Data Grid: Infinite-Depth Hierarchy</h3>
            <p>Recursive row injection enables nesting without depth limits.</p>
            <NestedRDG items={mockData7} level={0} />
        </div>
    );
};

export default RDGGrid;
