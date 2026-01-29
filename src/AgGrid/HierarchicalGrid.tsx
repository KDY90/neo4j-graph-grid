import React, { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ModuleRegistry,
    ClientSideRowModelModule,
} from 'ag-grid-community';
import { MasterDetailModule } from 'ag-grid-enterprise';

import type {
    FirstDataRenderedEvent,
    IDetailCellRendererParams,
    ColDef,
    GridOptions,
    GridApi
} from 'ag-grid-community';

import { generateHierarchyData } from '../data/mockData7';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './HierarchicalGrid.css';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    MasterDetailModule
]);

const HierarchicalGrid: React.FC = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: 'auto' }), []);
    const gridStyle = useMemo(() => ({ minHeight: '520px', width: '100%' }), []);
    const gridApiRef = useRef<GridApi | null>(null);
    const rowData = useMemo(() => generateHierarchyData(100), []);

    const detailParams = useMemo<IDetailCellRendererParams>(() => {
        const detailGridOptions: GridOptions = {
            columnDefs: [
                {
                    headerName: 'Hierarchy Detail',
                    children: [
                        { field: 'name', cellRenderer: 'agGroupCellRenderer', width: 260, headerName: 'Name' },
                        { field: 'level', headerName: 'Level', width: 160 },
                        { field: 'metric', headerName: 'Metric', width: 150 },
                        { field: 'lead', headerName: 'Lead', width: 150 },
                        { field: 'status', headerName: 'Status', cellClass: (p: any) => p.value === 'Active' ? 'status-active' : '' }
                    ]
                }
            ],
            defaultColDef: { flex: 1, resizable: true, sortable: true },
            detailRowHeight: 320,
            isRowMaster: (data) => !!data?.children?.length,
            masterDetail: true,
            domLayout: 'autoHeight',
        };

        const params: IDetailCellRendererParams = {
            detailGridOptions,
            getDetailRowData: (params: any) => {
                params.successCallback(params.data.children || []);
            }
        };

        detailGridOptions.detailCellRendererParams = params;
        return params;
    }, []);

    const masterColumnDefs = useMemo<ColDef[]>(() => [
        { field: 'name', headerName: 'L1: Group', cellRenderer: 'agGroupCellRenderer', width: 280 },
        { field: 'level', headerName: 'Level', width: 160 },
        { field: 'metric', headerName: 'Metric' },
        { field: 'lead', headerName: 'Lead' },
        { field: 'status', headerName: 'Status' }
    ], []);

    const handleExpandAll = () => {
        gridApiRef.current?.forEachNode((node) => node.setExpanded(true));
    };

    const handleCollapseAll = () => {
        gridApiRef.current?.forEachNode((node) => node.setExpanded(false));
    };

    return (
        <div style={containerStyle} className="example-wrapper">
            <div className="example-header">
                <h3>AG Grid: Infinite-Depth Hierarchy</h3>
                <p>Expand any row that has children to drill down without a depth limit.</p>
                <div className="grid-toolbar">
                    <button type="button" onClick={handleExpandAll}>Expand all</button>
                    <button type="button" onClick={handleCollapseAll}>Collapse all</button>
                </div>
            </div>
            <div style={gridStyle} className="ag-theme-quartz">
                <AgGridReact
                    ref={(node) => {
                        if (node) {
                            gridApiRef.current = node.api;
                        }
                    }}
                    rowData={rowData}
                    columnDefs={masterColumnDefs}
                    masterDetail={true}
                    detailCellRendererParams={detailParams}
                    detailRowAutoHeight={true}
                    domLayout="autoHeight"
                    defaultColDef={{ flex: 1, sortable: true, resizable: true }}
                    pagination={true}
                    paginationPageSize={pageSize}
                    paginationPageSizeSelector={[10, 20, 50]}
                    onFirstDataRendered={(params: FirstDataRenderedEvent) => {
                        params.api.getDisplayedRowAtIndex(0)?.setExpanded(true);
                    }}
                    isRowMaster={(data) => !!data?.children?.length}
                />
            </div>
        </div>
    );
};

export default HierarchicalGrid;
