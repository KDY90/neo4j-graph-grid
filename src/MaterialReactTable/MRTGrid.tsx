import React, { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table';
import { Box, Typography, Chip } from '@mui/material';
import { generateHierarchyData } from '../data/mockData7';
import type { Entity } from '../data/mockData7';

// --- GENERIC RECURSIVE MRT COMPONENT ---
interface RecursiveMRTProps {
    data: Entity[];
    level: number;
}

const levelNames = ['Group', 'Subsidiary', 'Division', 'Department', 'Team', 'Project', 'Task'];
const getLevelLabel = (level: number) => levelNames[level] ?? `Level ${level + 1}`;

const RecursiveMRT: React.FC<RecursiveMRTProps> = ({ data, level }) => {
    // Levels: 0=Group ... 6=Task
    const currentName = getLevelLabel(level);

    const columns = useMemo<MRT_ColumnDef<Entity>[]>(() => [
        { accessorKey: 'name', header: `${currentName} Name` },
        { accessorKey: 'metric', header: 'Metric', size: 100 },
        { accessorKey: 'lead', header: 'Lead', size: 120 },
        {
            accessorKey: 'status',
            header: 'Status',
            size: 100,
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue<string>()}
                    color={cell.getValue<string>() === 'Active' ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                />
            )
        },
    ], [currentName]);

    const table = useMaterialReactTable({
        columns,
        data,
        enableExpanding: true,
        getRowCanExpand: (row) => !!row.original.children?.length,
        enablePagination: level === 0,
        enableTopToolbar: level === 0,
        enableBottomToolbar: level === 0,
        initialState: level === 0 ? { pagination: { pageSize: 5, pageIndex: 0 } } : undefined,
        // Recursive Detail Panel
        renderDetailPanel: ({ row }) => {
            if (row.original.children && row.original.children.length > 0) {
                return (
                    <Box sx={{
                        p: 2,
                        bgcolor: level % 2 === 0 ? '#fffdf5' : '#fff9d6',
                        borderLeft: '3px solid #ffe048',
                        borderRadius: '0 8px 8px 0'
                    }}>
                        <RecursiveMRT data={row.original.children} level={level + 1} />
                    </Box>
                );
            }
            return null;
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '8px',
                border: level > 0 ? '1px dashed var(--border-color)' : 'none',
                backgroundColor: 'transparent'
            }
        },
        muiTableBodyRowProps: ({ row }) => ({
            sx: { backgroundColor: row.getIsExpanded() ? 'rgba(0,0,0,0.02)' : undefined }
        })
    });

    return (
        <Box sx={{ width: '100%', mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1, display: 'block' }}>
                LEVEL {level + 1}: {currentName}s
            </Typography>
            <MaterialReactTable table={table} />
        </Box>
    );
};

// --- MAIN WRAPPER (Level 0) with SCROLL ---
const MRTGrid: React.FC = () => {
    const rowData = useMemo(() => generateHierarchyData(100, 100), []);

    return (
        <Box sx={{
            padding: '2rem',
            bgcolor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 18px 32px rgba(0, 0, 0, 0.08)',
        }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
                Material React Table: Infinite-Depth Hierarchy
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Recursive detail panels with unlimited depth.
            </Typography>
            <RecursiveMRT data={rowData} level={0} />
        </Box>
    );
};

export default MRTGrid;
