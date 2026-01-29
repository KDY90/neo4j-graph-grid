export type Level = string;

export interface Entity {
    id: string;
    name: string;
    level: Level;
    status?: string;
    metric?: string;
    lead?: string;
    children?: Entity[];
}

const statusPool = ['Active', 'Planning', 'In Progress', 'Pending'];
const leadPool = ['Jisoo', 'Minho', 'Ara', 'Sejun', 'Hana', 'Yuna', 'Doyun', 'Sora'];
const metricPool = ['12%', '48h', '$2.4M', '320 pts', '9k', '$140k', '6.2x'];

const pick = (pool: string[], index: number) => pool[index % pool.length];

const createEntity = (
    id: string,
    name: string,
    level: Level,
    metric: string,
    lead: string,
    status: string,
    children: Entity[] = []
): Entity => ({
    id,
    name,
    level,
    metric,
    lead,
    status,
    children
});

const createDeepChain = (prefix: string, depth: number, index: number = 0): Entity => {
    const levelName = `Depth ${index + 1}`;
    const children = depth > 1 ? [createDeepChain(prefix, depth - 1, index + 1)] : [];
    return createEntity(
        `${prefix}-d${index + 1}`,
        `${levelName} Node`,
        levelName,
        pick(metricPool, index),
        pick(leadPool, index),
        pick(statusPool, index),
        children
    );
};

const createBranch = (prefix: string, branchIndex: number, depth: number): Entity => {
    const nodeId = `${prefix}-b${branchIndex}`;
    const branchDepth = Math.max(3, Math.floor(depth / 10));
    return createEntity(
        nodeId,
        `Branch ${branchIndex + 1}`,
        `Branch L${branchIndex + 1}`,
        pick(metricPool, branchIndex + 2),
        pick(leadPool, branchIndex + 2),
        pick(statusPool, branchIndex + 1),
        [createDeepChain(`${nodeId}-deep`, branchDepth)]
    );
};

export const generateHierarchyData = (depth: number = 100, rootCount: number = 100): Entity[] => {
    const roots: Entity[] = [];

    for (let i = 0; i < rootCount; i += 1) {
        const prefix = `root-${i + 1}`;
        roots.push(createEntity(
            prefix,
            `Group ${i + 1}`,
            'Group',
            pick(metricPool, i),
            `Lead ${pick(leadPool, i)}`,
            pick(statusPool, i),
            [
                createDeepChain(`${prefix}-chain`, depth),
                createBranch(prefix, i, depth),
            ]
        ));
    }

    return roots;
};
