import React, { useMemo } from 'react';
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
    GridOptions
} from 'ag-grid-community';

import { mockData7 } from '../data/mockData7';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './HierarchicalGrid.css';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    MasterDetailModule
]);

// Helper: recursive detail config generator
const getDetailGridOptions = (levelIndex: number): IDetailCellRendererParams => {
    // Levels: 0=Group, 1=Subsidiary, 2=Division, 3=Dept, 4=Team, 5=Project, 6=Task
    const levelNames = ['Group', 'Subsidiary', 'Division', 'Department', 'Team', 'Project', 'Task'];
    const currentName = levelNames[levelIndex] || 'Item';

    const isLeaf = levelIndex >= 6; // Task level is leaf

    const options: GridOptions = {
        columnDefs: [
            {
                headerName: `L${levelIndex + 1}: ${currentName}`, children: [
                    { field: 'name', cellRenderer: 'agGroupCellRenderer', width: 250, headerName: 'Name' },
                    { field: 'metric', headerName: 'Metric', width: 150 },
                    { field: 'lead', headerName: 'Lead', width: 150 },
                    { field: 'status', headerName: 'Status', cellClass: (p: any) => p.value === 'Active' ? 'status-active' : '' }
                ]
            }
        ],
        defaultColDef: { flex: 1, resizable: true, sortable: true },
        detailRowHeight: isLeaf ? 0 : 300, // No detail for leaves
    };

    if (!isLeaf) {
        options.masterDetail = true;
        // Recursive Call for Next Level
        options.detailCellRendererParams = getDetailGridOptions(levelIndex + 1);

        // Data Provider
        (options as any).getDetailRowData = (params: any) => {
            params.successCallback(params.data.children || []);
        };
    }

    return {
        detailGridOptions: options,
        getDetailRowData: (params: any) => {
            params.successCallback(params.data.children || []);
        }
    } as IDetailCellRendererParams;
};

const HierarchicalGrid: React.FC = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }), []);
    const gridStyle = useMemo(() => ({ height: '700px', width: '100%' }), []);

    // Level 0 Config (Group)
    // We need initial config for the Master Grid.
    // The 'detailCellRendererParams' here points to Level 1.
    const level1DetailParams = useMemo(() => getDetailGridOptions(1), []);

    const masterColumnDefs = useMemo<ColDef[]>(() => [
        { field: 'name', headerName: 'L1: Group', cellRenderer: 'agGroupCellRenderer', width: 280 },
        { field: 'metric', headerName: 'Metric' },
        { field: 'lead', headerName: 'Lead' },
        { field: 'status', headerName: 'Status' }
    ], []);

    return (
        <div style={containerStyle} className="example-wrapper">
            <div className="example-header">
                <h3>AG Grid: 7-Level Recursive Hierarchy</h3>
                <p>Group &rarr; Subsidiary &rarr; Division &rarr; Dept &rarr; Team &rarr; Project &rarr; Task</p>
            </div>
            <div style={gridStyle} className="ag-theme-quartz">
                <AgGridReact
                    rowData={mockData7}
                    columnDefs={masterColumnDefs}
                    masterDetail={true}
                    detailCellRendererParams={level1DetailParams}
                    detailRowHeight={400}
                    defaultColDef={{ flex: 1, sortable: true, resizable: true }}
                    onFirstDataRendered={(params: FirstDataRenderedEvent) => {
                        params.api.getDisplayedRowAtIndex(0)?.setExpanded(true);
                    }}
                />
            </div>
        </div>
    );
};

export default HierarchicalGrid;
