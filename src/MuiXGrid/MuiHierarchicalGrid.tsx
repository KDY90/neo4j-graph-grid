import React, { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, Chip, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { generateHierarchyData } from '../data/mockData7';
import type { Entity } from '../data/mockData7';

// --- RECURSIVE MUI GRID COMPONENT (Community Edition) ---
interface RecursiveMuiGridProps {
    rows: Entity[];
    level: number;
}

const levelNames = ['Group', 'Subsidiary', 'Division', 'Department', 'Team', 'Project', 'Task'];
const getLevelLabel = (level: number) => levelNames[level] ?? `Level ${level + 1}`;

const RecursiveMuiGrid: React.FC<RecursiveMuiGridProps> = ({ rows, level }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const currentName = getLevelLabel(level);

    const toggleRow = (id: string) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const columns: GridColDef[] = useMemo(() => [
        {
            field: 'expander',
            headerName: '',
            width: 50,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const hasChildren = params.row.children && params.row.children.length > 0;
                if (!hasChildren) return null;
                const isExpanded = expandedRows.has(params.row.id);
                return (
                    <IconButton size="small" onClick={() => toggleRow(params.row.id)}>
                        {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                );
            }
        },
        { field: 'name', headerName: `${currentName} Name`, flex: 1, minWidth: 200 },
        { field: 'metric', headerName: 'Metric', width: 120 },
        { field: 'lead', headerName: 'Lead', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={params.value === 'Active' ? 'success' : 'default'}
                    variant={params.value === 'Active' ? 'filled' : 'outlined'}
                />
            )
        },
    ], [currentName, expandedRows]);

    return (
        <Box sx={{ width: '100%', mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', p: 1, display: 'block' }}>
                LEVEL {level + 1}: {currentName.toUpperCase()}
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                hideFooter
                density="compact"
                autoHeight
                disableRowSelectionOnClick
                sx={{
                    '& .MuiDataGrid-columnHeaders': { bgcolor: '#fee500' },
                    '& .MuiDataGrid-row:nth-of-type(even)': { bgcolor: '#fffdf5' },
                    borderColor: 'var(--border-color)',
                    border: level > 0 ? '1px dashed #ccc' : 'none'
                }}
            />
            {/* Render expanded children */}
            {rows.map(row => (
                <Collapse key={row.id} in={expandedRows.has(row.id)} timeout="auto" unmountOnExit>
                    <Box sx={{
                        pl: 4,
                        py: 1,
                        bgcolor: level % 2 === 0 ? '#fffdf5' : '#fff9d6',
                        borderLeft: '3px solid #ffe048',
                        borderRadius: '0 8px 8px 0'
                    }}>
                        {row.children && row.children.length > 0 && (
                            <RecursiveMuiGrid rows={row.children} level={level + 1} />
                        )}
                    </Box>
                </Collapse>
            ))}
        </Box>
    );
};

// --- MAIN LEVEL 0 WRAPPER with SCROLL ---
const MuiHierarchicalGrid: React.FC = () => {
    const rowData = useMemo(() => generateHierarchyData(100), []);

    return (
        <Box sx={{
            width: '100%',
            bgcolor: '#ffffff',
            p: 2,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 18px 32px rgba(0, 0, 0, 0.08)',
        }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                MUI X Data Grid (Community): Infinite-Depth Hierarchy
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Free Community Edition - Expand rows to explore deeper levels.
            </Typography>

            <RecursiveMuiGrid rows={rowData} level={0} />
        </Box>
    );
};

export default MuiHierarchicalGrid;
