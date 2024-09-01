

# CONCEPTOS FUNDAMENTALES (DE MÁS IMPORTANTE A MENOS IMPORTANTE)

# 0. Deploying Angular Apps - CSR, SSR, SGA
**CSR:** La renderización del lado del cliente se refiere a que el renderizado de la página se realiza en el navegador del usuario.
**SSR:** La renderización del lado del servidor implica que la página se renderiza en el servidor antes de ser enviada al cliente, mejorando el SEO y la carga inicial.
**SGA:** Las aplicaciones de una sola página (SPA) cargan una sola página HTML y actualizan dinámicamente el contenido sin recargar la página completa.
Estos conceptos son importantes para entender las estrategias de renderizado y cómo afectan el rendimiento y la SEO de la aplicación, pero pueden ser considerados en etapas posteriores del aprendizaje.


## 3. HTTP Request & handeling responses
**Importancia:** Alta
**Descripción:** Realizar solicitudes HTTP y manejar las respuestas es una parte crítica de casi cualquier aplicación web. Angular proporciona el módulo HttpClient para simplificar estas tareas. Entender cómo hacer peticiones HTTP, manejar errores y trabajar con datos de servidores externos es crucial para el desarrollo de aplicaciones Angular.

## 4. Enhancing Elements with Directives
**Importancia:** Alta
**Descripción:** Las directivas en Angular permiten modificar el comportamiento de los elementos del DOM. Existen directivas estructurales (como *ngIf, *ngFor) y directivas de atributo (como ngClass, ngStyle). Saber cómo utilizar y crear directivas es importante para manipular y extender el comportamiento de los elementos HTML en Angular.

## 5. Transforming Values with Pipes
**Importancia:** Media
**Descripción:** Las pipes en Angular se utilizan para transformar datos en plantillas. Se aplican mediante el uso del operador | y permiten transformar datos como fechas, monedas, y otros formatos. Aunque no es tan crítico como otros conceptos, conocer y utilizar pipes puede mejorar significativamente la presentación de datos en una aplicación Angular.

# 6. Code splittling & Deferrable views
**Importancia**: Media
**Descripción**: La división de código (code splitting) y las vistas diferibles permiten optimizar la carga y el rendimiento de una aplicación Angular. Esto se logra cargando módulos y componentes sólo cuando son necesarios (lazy loading). Es especialmente útil para grandes aplicaciones, pero puede considerarse un concepto más avanzado una vez que se dominan los fundamentos.

