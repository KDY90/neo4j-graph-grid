import React, { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table';
import { Box, Typography, Chip, Pagination } from '@mui/material'; // Pagination 추가
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

        // Pagination 설정 (최상위 레벨만)
        enablePagination: level === 0,
        enableTopToolbar: level === 0,

        // *** 여기가 핵심 변경 부분입니다 ***
        // 기본 툴바 대신 커스텀 페이지네이션 렌더링
        renderBottomToolbar: level === 0 ? ({ table }) => (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <Pagination
                    // MRT의 총 페이지 수 가져오기
                    count={table.getPageCount()}
                    // MRT는 0부터 시작, Pagination은 1부터 시작하므로 +1
                    page={table.getState().pagination.pageIndex + 1}
                    // 페이지 변경 시 MRT 상태 업데이트 (1 -> 0 변환을 위해 -1)
                    onChange={(_, value) => table.setPageIndex(value - 1)}

                    // 스타일 옵션 (원하는대로 수정 가능)
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                />
            </Box>
        ) : undefined, // 하위 레벨은 툴바 없음

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
    const rowData = useMemo(() => generateHierarchyData(100), []);

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
                Recursive detail panels with numbered pagination.
            </Typography>
            <RecursiveMRT data={rowData} level={0} />
        </Box>
    );
};

export default MRTGrid;