// 7-Level Hierarchy Interface
export type Level = 'Group' | 'Subsidiary' | 'Division' | 'Department' | 'Team' | 'Project' | 'Task';

export interface Entity {
    id: string;
    name: string;
    level: Level;
    status?: string; // Generic status
    metric?: string; // Revenue, Budget, Hours, etc.
    lead?: string;   // CEO, Director, Manager, Lead, Assignee
    children?: Entity[]; // Recursive children
}

// Helper to create data
export const createEntity = (id: string, name: string, level: Level, metric: string, lead: string, status: string = 'Active', children: Entity[] = []): Entity => ({
    id, name, level, metric, lead, status, children
});

// MOCK DATA GENERATION
const tasks = (prefix: string): Entity[] => [
    createEntity(`${prefix}-t1`, 'Refactor API', 'Task', '4h', 'Dev A', 'In Progress'),
    createEntity(`${prefix}-t2`, 'Write Tests', 'Task', '2h', 'Dev B', 'Pending'),
];

const projects = (prefix: string): Entity[] => [
    createEntity(`${prefix}-p1`, 'Alpha Protocol', 'Project', '$50k', 'Alice', 'Active', tasks(`${prefix}-p1`)),
    createEntity(`${prefix}-p2`, 'Beta Launch', 'Project', '$20k', 'Bob', 'Planning', []),
];

const teams = (prefix: string): Entity[] => [
    createEntity(`${prefix}-tm1`, 'Core Dev', 'Team', '12 ppl', 'Charlie', 'Active', projects(`${prefix}-tm1`)),
    createEntity(`${prefix}-tm2`, 'Ops Squad', 'Team', '8 ppl', 'Dave', 'Active', []),
];

const departments = (prefix: string): Entity[] => [
    createEntity(`${prefix}-dp1`, 'Engineering', 'Department', '80 ppl', 'Eve', 'Active', teams(`${prefix}-dp1`)),
    createEntity(`${prefix}-dp2`, 'Product', 'Department', '40 ppl', 'Frank', 'Active', []),
];

const divisions = (prefix: string): Entity[] => [
    createEntity(`${prefix}-dv1`, 'Consumer Apps', 'Division', '$20M', 'Grace', 'Active', departments(`${prefix}-dv1`)),
];

const subsidiaries = (prefix: string): Entity[] => [
    createEntity(`${prefix}-s1`, 'TechNova USA', 'Subsidiary', '$100M', 'Heidi', 'Active', divisions(`${prefix}-s1`)),
    createEntity(`${prefix}-s2`, 'TechNova EU', 'Subsidiary', '$80M', 'Ivan', 'Active', []),
];

export const mockData7: Entity[] = [
    createEntity('g1', 'TechNova Group (L1)', 'Group', '$5B', 'Judy', 'Active', subsidiaries('g1')),
    createEntity('g2', 'GreenFuture (L1)', 'Group', '$2B', 'Karl', 'Active', []),
];
