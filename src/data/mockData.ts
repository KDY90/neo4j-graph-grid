// Level 4: Project
export interface Project {
    id: string;
    projectName: string;
    status: 'Active' | 'Delayed' | 'Completed' | 'Planning';
    priority: 'High' | 'Medium' | 'Low';
    budget: number;
    deadline: string;
    assignee: string;
}

// Level 3: Team
export interface Team {
    id: string;
    teamName: string;
    techStack: string;
    lead: string;
    headcount: number;
    projects: Project[];
}

// Level 2: Department
export interface Department {
    id: string;
    departmentName: string;
    director: string;
    location: string;
    teams: Team[];
}

// Level 1: Organization
export interface Organization {
    id: string;
    orgName: string;
    ceo: string;
    revenue: string;
    departments: Department[];
}

export const mockData: Organization[] = [
    {
        id: 'org1',
        orgName: 'TechNova Corp (Level 1)',
        ceo: 'Eleanor Sterling',
        revenue: '$4.2B',
        departments: [
            {
                id: 'dept1',
                departmentName: 'Engineering (Level 2)',
                director: 'Marcus Chen',
                location: 'San Francisco',
                teams: [
                    {
                        id: 'team1',
                        teamName: 'Core Platform (Level 3)',
                        techStack: 'React, Node.js',
                        lead: 'Sarah Connor',
                        headcount: 12,
                        projects: [
                            { id: 'p1', projectName: 'Microservices Migration (Level 4)', status: 'Active', priority: 'High', budget: 150000, deadline: '2024-06-30', assignee: 'DevOps Unit' },
                            { id: 'p2', projectName: 'Auth System Rewrite', status: 'Completed', priority: 'High', budget: 80000, deadline: '2023-12-15', assignee: 'Security Squad' }
                        ]
                    },
                    {
                        id: 'team2',
                        teamName: 'Data Analytics',
                        techStack: 'Python, Spark',
                        lead: 'John Doe',
                        headcount: 8,
                        projects: [
                            { id: 'p3', projectName: 'Q3 Forecast Model', status: 'Planning', priority: 'Medium', budget: 45000, deadline: '2024-09-01', assignee: 'Data Science' }
                        ]
                    }
                ]
            },
            {
                id: 'dept2',
                departmentName: 'Product Design',
                director: 'Lisa Ray',
                location: 'New York',
                teams: [
                    {
                        id: 'team3',
                        teamName: 'UX Research',
                        techStack: 'Figma, Maze',
                        lead: 'Emily Blunt',
                        headcount: 6,
                        projects: [
                            { id: 'p4', projectName: 'User Journey Mapping', status: 'Active', priority: 'Medium', budget: 20000, deadline: '2024-04-15', assignee: 'Research Team' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'org2',
        orgName: 'GreenEarth Energy',
        ceo: 'David Attenborough',
        revenue: '$1.8B',
        departments: [
            {
                id: 'dept3',
                departmentName: 'R&D',
                director: 'Dr. Stone',
                location: 'Berlin',
                teams: [
                    {
                        id: 'team4',
                        teamName: 'Solar Efficiency',
                        techStack: 'Matlab, C++',
                        lead: 'Albert E.',
                        headcount: 15,
                        projects: [
                            { id: 'p5', projectName: 'Panel Optimization', status: 'Delayed', priority: 'High', budget: 500000, deadline: '2025-01-01', assignee: 'Physics Lab' }
                        ]
                    }
                ]
            }
        ]
    }
];
