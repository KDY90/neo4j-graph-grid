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

// 데이터를 다양하게 보이기 위해 풀(Pool)을 조금 더 늘렸습니다.
const statusPool = ['Active', 'Planning', 'In Progress', 'Pending', 'Review', 'Done'];
const leadPool = ['Jisoo', 'Minho', 'Ara', 'Sejun', 'Hana', 'Yuna', 'Doyun', 'Sora', 'Mike', 'Emma', 'Jin', 'Kai'];
const metricPool = ['12%', '48h', '$2.4M', '320 pts', '9k', '$140k', '6.2x', '99%', '$500k', '1.2M', '72h'];
const companyPrefixes = ['Global', 'Neo', 'Alpha', 'Prime', 'Kakao', 'Mega', 'Terra', 'Star', 'Blue', 'Red'];
const companySuffixes = ['Group', 'Corp', 'Holdings', 'Systems', 'Inc', 'Labs', 'Solutions', 'Partners'];

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
    // 깊이가 너무 깊으면 성능에 영향을 줄 수 있으므로 50% 확률로 깊이를 줄이거나 유지
    const nextDepth = depth > 1 ? depth - 1 : 0;
    const children = nextDepth > 0 ? [createDeepChain(prefix, nextDepth, index + 1)] : [];

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
    // 가지(Branch)의 깊이는 3~5 정도로 제한하여 데이터 폭증 방지
    const branchDepth = Math.max(2, Math.floor(depth / 5));

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

// --- 여기가 변경된 핵심 부분입니다 ---
// rootCount: 생성할 최상위 행의 개수 (기본값 100개 -> 5개씩 보기 시 20페이지)
export const generateHierarchyData = (rootCount: number = 100): Entity[] => {
    return Array.from({ length: rootCount }, (_, i) => {
        const id = `root-${i + 1}`;

        // 회사 이름 랜덤 조합 생성 (예: Neo Holdings 1)
        const name = `${pick(companyPrefixes, i)} ${pick(companySuffixes, i)} ${i + 1}`;
        const metric = pick(metricPool, i * 2); // 랜덤성을 위해 인덱스 조절
        const lead = pick(leadPool, i);
        const status = pick(statusPool, i);

        // 자식 노드 생성 로직 (짝수/홀수 인덱스에 따라 구조를 조금 다르게 줌)
        const children = [];
        const baseDepth = 10; // 자식들의 깊이

        if (i % 2 === 0) {
            // 짝수 번째: Deep Chain 1개 + Branch 1개
            children.push(createDeepChain(`${id}-chain`, baseDepth));
            children.push(createBranch(id, 0, baseDepth));
        } else {
            // 홀수 번째: Branch 2개
            children.push(createBranch(id, 0, baseDepth));
            children.push(createBranch(id, 1, baseDepth));
        }

        return createEntity(id, name, 'Group', metric, lead, status, children);
    });
};