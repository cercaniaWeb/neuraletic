export interface ModuleContent {
    id: string;
    title: string;
    description: string;
    difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
    theory_block: string; // The "Ground Truth" text
    video_url?: string; // Optional YouTube ID or URL
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
        video_url: '4t4kBkMsDbQ', // NetworkChuck - Nmap
        lab_config: {
            target_ip: '10.10.10.5',
            target_os: 'Linux Ubuntu 20.04 LTS',
            open_ports: [22, 80],
            vulnerabilities: []
        },
        theory_block: `
# FASE 1: DESCUBRIMIENTO DE HOSTS (HOST DISCOVERY)

## 🧠 Concepto Clave: ¿Hay alguien ahí?
Imagina que estás en un edificio a oscuras (la red) y quieres saber en qué habitaciones hay gente.
El **Host Discovery** es como ir tocando puertas o gritando "¿Hola?" para ver quién responde. En ciberseguridad, antes de atacar, necesitas saber qué computadoras (hosts) están encendidas y conectadas.

## 📡 El Protocolo ICMP ("El Ping")
Es el equivalente digital a un sonar de submarino.
- **Tú envías (Echo Request):** "¿Estás vivo?"
- **Ellos responden (Echo Reply):** "Sí, estoy aquí".

Herramienta: \`ping <IP>\`

## 🛡️ El Muro de Fuego (Firewall)
A veces, los administradores configuran "Firewalls" que actúan como guardias de seguridad silenciosos. Tú preguntas "¿Estás ahí?", pero el guardia te ignora deliberadamente.
Si usas \`ping\` y no responden, no siempre significa que no estén. Simplemente pueden estar ignorándote.

## 🔧 La Solución: Nmap (Network Mapper)
Cuando el toque suave falla, usamos **Nmap**. Es como un escáner de rayos X.
Si no responden al saludo normal (ICMP), Nmap intenta trucos más técnicos:
1. **TCP SYN Ping (-PS):** Simula que quiere iniciar una conversación web (puerto 80). Aunque el firewall bloquee el saludo, a veces deja pasar el intento de conexión para negocios.
   - *Analogía:* Si no abren cuando tocas el timbre, intentas girar el pomo de la puerta principal.

## 🎯 TU MISIÓN
Investiga la red. Tu objetivo es confirmar que la IP **10.10.10.5** está operativa, incluso si intenta esconderse.
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
        video_url: 'ciNHn38EyRc', // Computerphile - SQL Injection
        lab_config: {
            target_ip: '10.10.10.15',
            target_os: 'CentOS 7',
            open_ports: [80, 3306],
            vulnerabilities: ['SQL Injection (Login Bypass)', 'Union-Based SQLi']
        },
        theory_block: `
# FASE 2: INYECCIÓN SQL (SQLi)

## 🧠 Concepto Clave: Engañando al Bibliotecario
Imagina que una página web es un bibliotecario que busca información por ti.
Tú le das un nombre de usuario, y él busca en sus ficheros:
*"Bibliotecario, por favor dame la ficha del usuario [TU_NOMBRE]"*.

Una **Inyección SQL** ocurre cuando, en lugar de dar solo tu nombre, das una orden disfrazada.
Tú dices: *"dame la ficha del usuario [Juan, O mejor dame TODAS las fichas]"*.
Si el bibliotecario es ingenuo (no "sanitiza" o limpia lo que dices), te obedecerá ciegamente.

## 🔓 El Truco Maestro: La Tautología
Para entrar sin contraseña, usamos una "Mentira que siempre es verdad".
En lógica, la afirmación **"1 es igual a 1"** siempre es VERDADERA.

Si le dices al sistema:
*"Déjame entrar si mi usuario es 'admin' O si 1=1"*.
Como 1 siempre es igual a 1, la condición se cumple, y la puerta se abre, ¡sin importar la contraseña!

Comando típico: \`admin' OR 1=1 --\`
(El \`--\` es para decirle al bibliotecario "ignora todo lo que venga después", como la verificación de contraseña real).

## 🎯 TU MISIÓN
El panel de administración es vulnerable. Engaña a la base de datos usando una tautología para entrar como administrador sin saber la contraseña.
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
        video_url: 'EoaDgUgS6QA', // Computerphile - XSS
        lab_config: {
            target_ip: '10.10.10.20',
            target_os: 'Debian 11',
            open_ports: [8080],
            vulnerabilities: ['Stored XSS', 'Reflected XSS']
        },
        theory_block: `
# FASE 3: CROSS-SITE SCRIPTING (XSS)

## 🧠 Concepto Clave: El Caballo de Troya
A diferencia del ataque anterior (que atacaba a la base de datos del servidor), el **XSS** ataca a los **otros usuarios** que visitan la web.

Imagina que puedes escribir un comentario en un foro. En lugar de escribir "¡Hola!", escribes un código invisible que dice: *"Quien lea esto, envíame su cartera por correo"*.
Cuando otra persona inocente entra al foro y su navegador lee tu comentario, ejecuta la orden sin saberlo.

## 🍪 El Botín: Las Cookies de Sesión
Cuando entras a Facebook o Gmail, no metes tu contraseña a cada segundo. El servidor te da una "Cookie" (como una pulsera VIP de un festival) para recordarte.
Si logras ejecutar código JavaScript en el navegador de tu víctima (XSS), puedes decirle:
*"Mándame una copia de tu pulsera VIP a mi servidor".*
Con esa copia, ¡puedes hacerte pasar por ella sin saber su contraseña!

## 🧪 El Experimento
Para probar si un sitio es vulnerable, intentamos inyectar un script inofensivo primero, como una ventana de alerta:
\`<script>alert('Hackeado')</script>\`
Si ves la ventana emergente, ¡el sitio acepta órdenes de extraños!

## 🎯 TU MISIÓN
Encuentra un campo de texto donde puedas inyectar código JavaScript y hazlo dispararse.
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
        video_url: 'Hk-21p2m8YY', // HackerSploit - Nmap Scripts
        lab_config: {
            target_ip: '10.10.10.25',
            target_os: 'Windows Server 2019',
            open_ports: [53, 80, 135, 139, 445, 3389],
            vulnerabilities: ['SMB Signing Disabled', 'Outdated IIS', 'Default SNMP Credentials']
        },
        theory_block: `
# FASE 4: ENUMERACIÓN AVANZADA (Investigación Profunda)

## 🧠 Concepto Clave: Interrogatorio Policial
En la Fase 1 solo vimos quién estaba "vivo". Ahora necesitamos su ficha completa.
Saber que el puerto 80 está abierto no es suficiente. Necesitamos saber:
1. **¿Qué software corre ahí?** (Ej: ¿Es un servidor Apache viejo o uno nuevo?)
2. **¿Qué versión exacta?** (Las versiones viejas tienen fallos conocidos).
3. **¿Qué sistema operativo usan?** (No se ataca igual a Windows que a Linux).

## 🕵️ Nmap Scripting Engine (NSE)
Nmap no solo mira puertos. Tiene un cerebro propio con "scripts" (pequeños programas en lenguaje Lua) que pueden hacer tareas de detective:
- **-sV (Service Version):** Analiza la "firma" o respuesta del servicio y te dice: "Esto es un Apache 2.4.49".
- **-sC (Default Scripts):** Ejecuta un paquete de pruebas seguras para sacar información extra (títulos de webs, claves SSH públicas, etc.).
- **-A (Aggressive):** ¡El modo "Bestia"! Activa detección de OS, versiones, scripts y trazado de ruta de una sola vez. (Cuidado, es ruidoso y fácil de detectar).

## 🎯 TU MISIÓN
Usa Nmap en modo agresivo o con detección de versiones para obtener la "huella digital" completa del objetivo. Busca software obsoleto.
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
