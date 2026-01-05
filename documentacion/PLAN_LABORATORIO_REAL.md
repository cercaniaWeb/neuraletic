# Plan de Implementación: Laboratorio "Real" (Dockerización / WASM)

## 🎯 Objetivo
Transformar la terminal de CyberPath de una simulación basada en "parsers de texto" a un entorno de ejecución real. Esto permitirá al estudiante:
1.  Ejecutar comandos reales de Linux (`ls`, `cat`, `grep`, `awk`, `mkdir`, `rm`).
2.  Tener persistencia de sistema de archivos durante la sesión (si creo un archivo, ahí sigue).
3.  Experimentar consecuencias reales (ej. borrar un archivo crítico).

## 🧩 Análisis de Tecnologías

El usuario sugirió **WebAssembly (WASM)** para ejecución local. Analicemos las opciones:

### Opción A: WebContainers (StackBlitz) 🌟 (Recomendada)
Ejecuta un entorno Node.js completo dentro del navegador usando las APIs de File System del navegador.
*   **Pros:** 
    *   Muy rápido (arranca en milisegundos).
    *   Soporte nativo para comandos UNIX básicos (`ls`, `cd`, `cat`, `grep` a través de implementaciones JS/WASM).
    *   Ideal para manipular archivos y scripts.
    *   Fácil integración con React.
*   **Contras:** 
    *   Limitado a lo que Node.js puede hacer (no corre binarios de Linux arbitrarios a menos que estén compilados a WASM).
    *   Networking real (sockets planos para `nmap`) sigue siendo limitado por el navegador.

### Opción B: Emulación x86 (v86 / JSLinux)
Emula una CPU completa y corre un Kernel Linux real (Alpine, Arch) en el navegador.
*   **Pros:** 
    *   Es un Linux **REAL**. Todo funciona tal cual.
*   **Contras:** 
    *   **Pesado:** Requiere descargar una imagen de SO (min 10-50MB).
    *   **Lento:** El arranque (boot) toma tiempo.
    *   Rendimiento limitado en móviles.

### Opción C: Backend Docker (Dockerización Real)
La terminal conecta vía WebSocket a un contenedor Docker real en la nube.
*   **Pros:** 
    *   Poder ilimitado (Internet real, `nmap` real, Kali Linux real).
*   **Contras:** 
    *   Costoso (requiere servidores, orquestación).
    *   Latencia de red.
    *   Riesgo de seguridad (aislamiento de contenedores).

---

## 🚀 Estrategia Seleccionada: Enfoque Híbrido (WASM + Simulación de Red)

Dado que el objetivo educativo inmediato es mejorar la interacción con el sistema (`grep`, `awk`, `cat`) sin los costos de un backend, utilizaremos **WebContainers** (o una implementación ligera de **BusyBox en WASM**).

Para las herramientas de red (`nmap`, `ping`), mantendremos la **simulación** (o una red virtual interna) ya que los navegadores bloquean sockets TCP/UDP/ICMP crudos por seguridad.

## 📅 Roadmap de Implementación

### Fase 1: Prototipo (Proof of Concept)
1.  Instalar `@webcontainer/api` en el proyecto.
2.  Configurar headers del servidor de desarrollo (Vite) para permitir `SharedArrayBuffer` (necesario para WebContainers):
    *   `Cross-Origin-Embedder-Policy: require-corp`
    *   `Cross-Origin-Opener-Policy: same-origin`
3.  Crear un componente de prueba que arranque un WebContainer y ejecute `ls -la`.

### Fase 2: Integración con la Terminal (UI)
1.  Modificar `Terminal.tsx`:
    *   En lugar de pasar el string del comando a `handleCommandSubmit` (simulador), pasar la entrada al proceso del WebContainer (`shell.input.write`).
    *   Redirigir la salida del WebContainer (`shell.output`) directamente al objeto `xterm.js`.
2.  Conectar el sistema de archivos virtual para que `xterm` refleje el directorio actual.

### Fase 3: Tooling y "Binarios"
1.  Asegurar que existan utilidades básicas. WebContainers trae muchas, pero podemos instalar paquetes npm globales (ej. `shelljs`) o binarios WASM para complementar.
2.  Crear "shim" (interceptor) para comandos de red (`nmap`, `sqlmap`).
    *   Si el usuario escribe `ls`, lo ejecuta el WebContainer.
    *   Si escribe `nmap`, lo intercepta nuestro motor de juego (CyberPath Engine) y devuelve la salida simulada de la misión.

### Fase 4: Validaciones Educativas
1.  Actualizar el `GeminiService` para que, en lugar de evaluar "qué comando escribiste", evalúe **"el estado del sistema"**.
    *   Ejemplo: "Tu misión es crear un archivo `passwords.txt`".
    *   Validación: El código verifica `fs.readFile('passwords.txt')` en el contenedor virtual. Real, no parseado.

## 🛠️ Stack Tecnológico Propuesto

*   **Motor de Ejecución:** `@webcontainer/api`
*   **Terminal UI:** `xterm.js` (Ya existente)
*   **Networking Shim:** Lógica personalizada en TypeScript para interceptar comandos específicos de hacking.

## ⚠️ Consideraciones de Seguridad
Aunque corre en el navegador, ejecutar código arbitrario siempre tiene riesgos (ej. bucles infinitos que cuelgan el tab). El WebContainer aísla bien, pero debemos limitar recursos si es posible.

---

### Siguiente Paso Inmediato
Configurar el entorno de Vite para soportar los headers de seguridad necesarios para WebContainers (`Cross-Origin-Isolation`).
