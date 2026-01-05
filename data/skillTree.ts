export interface SkillNode {
    id: string;
    group: number; // 1: Basic, 2: Intermediate, 3: Advanced
    label: string;
    status: 'locked' | 'unlocked' | 'completed' | 'active';
    description: string;
}

export interface SkillLink {
    source: string;
    target: string;
}

export const SKILL_TREE_DATA = {
    nodes: [
        { id: 'Fundamentos', group: 1, label: 'Fundamentos', status: 'active', description: 'Protocolos, Redes y Conceptos Base' },
        { id: 'Recon', group: 1, label: 'Reconocimiento', status: 'locked', description: 'Nmap, Whois, OSINT' },
        { id: 'Network Scanning', group: 2, label: 'Network Scanning', status: 'locked', description: 'Escaneo de Puertos y Servicios' },
        { id: 'Web Exploitation', group: 2, label: 'Web Exploitation', status: 'locked', description: 'OWASP Top 10' },
        { id: 'SQL Injection', group: 3, label: 'SQL Injection', status: 'locked', description: 'Explotación de Bases de Datos' },
        { id: 'XSS', group: 3, label: 'XSS', status: 'locked', description: 'Cross-Site Scripting' },
        { id: 'Metasploit', group: 3, label: 'Metasploit', status: 'locked', description: 'Framework de Explotación' },
    ] as SkillNode[],
    links: [
        { source: 'Fundamentos', target: 'Recon' },
        { source: 'Recon', target: 'Network Scanning' },
        { source: 'Network Scanning', target: 'Web Exploitation' },
        { source: 'Web Exploitation', target: 'SQL Injection' },
        { source: 'Web Exploitation', target: 'XSS' },
        { source: 'Network Scanning', target: 'Metasploit' },
    ] as SkillLink[]
};
