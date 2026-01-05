# 📚 CyberPath - Currículo Completo

## Resumen de Módulos Disponibles

Tu aplicación ahora cuenta con **14 módulos educativos** de ciberseguridad que cubren desde nivel principiante hasta avanzado.

---

## 📊 Módulos Originales (1-4)

### ✅ MOD-001: Fundamentos de Reconocimiento Activo
- **Nivel:** Principiante
- **Temas:** ICMP, Ping, Nmap básico, Network Discovery
- **Video:** NetworkChuck - Nmap
- **Herramientas:** `ping`, `nmap -sn`, `nmap -PS`

### ✅ MOD-002: SQL Injection
- **Nivel:** Intermedio
- **Temas:** Inyección SQL, Login Bypass, UNION-Based SQLi
- **Video:** Computerphile - SQL Injection
- **Herramientas:** Tautologías (`' OR 1=1 --`), `ORDER BY`, `UNION SELECT`

### ✅ MOD-003: Cross-Site Scripting (XSS)
- **Nivel:** Intermedio
- **Temas:** XSS Reflejado, XSS Almacenado, Robo de cookies
- **Video:** Computerphile - XSS
- **Herramientas:** `<script>alert()</script>`, `document.cookie`

### ✅ MOD-004: Network Scanning Avanzado
- **Nivel:** Avanzado
- **Temas:** Nmap Scripting Engine (NSE), Detección de servicios, Banner grabbing
- **Video:** HackerSploit - Nmap Scripts
- **Herramientas:** `nmap -sV`, `nmap -sC`, `nmap -A`, `nmap --script`

---

## 🆕 Módulos Nuevos (5-14)

### ✅ MOD-005: Password Cracking
- **Nivel:** Intermedio
- **Temas:** Fuerza bruta, Ataques de diccionario, Hash cracking
- **Video:** John Hammond - Password Cracking
- **Herramientas:** `hydra`, `hashcat`, `john`
- **Objetivos:** Crackear contraseñas SSH/FTP, descifrar hashes MD5

### ✅ MOD-006: Privilege Escalation
- **Nivel:** Avanzado
- **Temas:** Escalación de privilegios en Linux, SUID abuse, Sudo misconfigurations
- **Video:** IppSec - Linux Privilege Escalation
- **Herramientas:** `find -perm -4000`, `sudo -l`, `getcap`
- **Objetivos:** De usuario normal a root

### ✅ MOD-007: Web Shells y Backdoors
- **Nivel:** Intermedio
- **Temas:** PHP Web Shells, Persistent access, Reverse shells
- **Video:** LiveOverflow - Web Shells
- **Herramientas:** File upload exploitation, `<?php system($_GET['cmd']); ?>`
- **Objetivos:** Mantener acceso persistente en servidor comprometido

### ✅ MOD-008: Directory Traversal (Path Traversal)
- **Nivel:** Intermedio
- **Temas:** Local File Inclusion (LFI), Path traversal, File read vulnerabilities
- **Video:** PwnFunction - Path Traversal
- **Herramientas:** `../../../../etc/passwd`, URL encoding bypass
- **Objetivos:** Leer archivos sensibles del sistema

### ✅ MOD-009: File Upload Exploitation
- **Nivel:** Avanzado
- **Temas:** Polyglot files, Magic bytes bypass, ZIP Slip attack
- **Video:** STÖK - File Upload Attacks
- **Herramientas:** `exiftool`, Double extensions, MIME type spoofing
- **Objetivos:** Bypassear filtros y lograr RCE

### ✅ MOD-010: Metasploit Framework
- **Nivel:** Avanzado
- **Temas:** Metasploit básico, EternalBlue (MS17-010), Meterpreter
- **Video:** NetworkChuck - Metasploit
- **Herramientas:** `msfconsole`, exploits, payloads, `hashdump`
- **Objetivos:** Explotar Windows con EternalBlue, obtener SYSTEM

### ✅ MOD-011: Wireless Hacking
- **Nivel:** Avanzado
- **Temas:** WiFi cracking, WPA/WPA2, 4-way handshake, Deauth attacks
- **Video:** NetworkChuck - WiFi Hacking
- **Herramientas:** `airmon-ng`, `airodump-ng`, `aireplay-ng`, `aircrack-ng`
- **Objetivos:** Capturar handshake y crackear contraseña WiFi

### ✅ MOD-012: Criptografía y Hash Cracking
- **Nivel:** Intermedio
- **Temas:** Hashing vs Encryption, MD5/SHA, Rainbow tables, Salts
- **Video:** Computerphile - Hashing Algorithms
- **Herramientas:** `hashcat`, `john`, `hash-identifier`
- **Objetivos:** Crackear dumps de hashes, entender criptografía

### ✅ MOD-013: OSINT (Open Source Intelligence)
- **Nivel:** Principiante
- **Temas:** Google Dorking, WHOIS, Subdomain enumeration, Metadata extraction
- **Video:** John Hammond - OSINT
- **Herramientas:** `whois`, `theHarvester`, `sublist3r`, `exiftool`, Shodan
- **Objetivos:** Recopilar información sin interactuar con objetivo

### ✅ MOD-014: Command Injection
- **Nivel:** Intermedio
- **Temas:** OS Command Injection, Shell metacharacters, RCE
- **Video:** PwnFunction - Command Injection
- **Herramientas:** `;`, `&&`, `||`, backticks, reverse shells
- **Objetivos:** Inyectar comandos en aplicaciones web vulnerables

---

## 📈 Distribución por Nivel

- **🟢 Principiante:** 2 módulos (Fundamentos, OSINT)
- **🟡 Intermedio:** 7 módulos (SQL Injection, XSS, Password Cracking, Web Shells, Directory Traversal, Cryptography, Command Injection)
- **🔴 Avanzado:** 5 módulos (Network Scanning, Privilege Escalation, File Upload, Metasploit, Wireless Hacking)

---

## ✨ Características de cada módulo:

Cada módulo incluye:
- ✅ **Teoría educativa** con explicaciones claras y analogías
- ✅ **Video de YouTube** relacionado (IDs reales de videos educativos)
- ✅ **Lab config** con IP objetivo, OS, puertos y vulnerabilidades
- ✅ **Criterios de éxito** claros y medibles
- ✅ **Validation rules** con regex patterns para comandos permitidos
- ✅ **Expected outputs** para validación automática

---

## 🎯 Próximos Pasos Recomendados:

### 1️⃣ **Arreglar el API URL** (Problema crítico actual)
```typescript
// services/geminiService.ts línea 38
const API_URL = import.meta.env.VITE_API_URL || window.location.origin;
```

### 2️⃣ **Agregar navegación de módulos**
Permitir al usuario saltar entre módulos sin tener que completar linealmente.

### 3️⃣ **Mejorar el validador offline**
Hacer los regex más flexibles para aceptar variaciones de comandos correctos.

### 4️⃣ **Implementar progreso persistente**
Guardar qué módulos ha completado el usuario.

---

## 📚 Recursos Adicionales

Todos los videos están verificados y son de creadores educativos reconocidos:
- **NetworkChuck** - Tutoriales entretenidos y prácticos
- **Computerphile** - Explicaciones técnicas profundas
- **John Hammond** - CTF walkthroughs y hacking ético
- **IppSec** - HackTheBox walkthroughs detallados
- **PwnFunction** - Animaciones educativas de vulnerabilidades
- **LiveOverflow** - Deep dives técnicos
- **STÖK** - Bug bounty y web security

---

**Total de contenido educativo:** Aproximadamente 20-30 horas de entrenamiento práctico 🚀
