[← Volver al inicio](../../README.md)

## Semana 3. Guía de laboratorio / actividad práctica

### Título de la actividad
Consolidación del CRUD, manejo de errores, autenticación con Spring Security/JWT y configuración de CORS.

### Objetivo
Completar el CRUD del controlador con manejo de errores y respuestas HTTP adecuadas, proteger al menos un endpoint con autenticación JWT mediante Spring Security, y configurar CORS para permitir el consumo desde una futura aplicación Angular.

### Competencias que se desarrollan
- Análisis de problemas (identificación de escenarios de error y su código HTTP correcto)
- Diseño y desarrollo de soluciones (implementación de seguridad y manejo de errores)
- Uso de herramientas (Spring Security, Postman para pruebas con y sin token)

### Materiales o recursos
- Proyecto Spring Boot con CRUD parcial y persistencia (Semanas 3 y 4)
- IDE y Postman
- Documentación oficial de Spring Security (Spring Security Team, 2025) y de CORS (MDN Web Docs, 2025b)

### Procedimiento paso a paso
1. **Completar el método `show`:** implementen `GET /recurso/{id}` devolviendo `404 Not Found` si el recurso no existe.
2. **Completar el método `update`:** implementen `PUT /recurso/{id}` con validación de los datos de entrada, devolviendo `400 Bad Request` ante datos inválidos.
3. **Completar el método `delete`:** implementen `DELETE /recurso/{id}` devolviendo `204 No Content` en caso de éxito.
4. **Agregar validaciones:** utilicen anotaciones de validación (por ejemplo, `@NotNull`, `@Positive`) en los atributos de la entidad o el DTO de entrada (OWASP Foundation, 2023).
5. **Manejar errores de forma centralizada:** implementen un manejador de excepciones que traduzca los errores de validación en respuestas HTTP claras y consistentes.
6. **Configurar Spring Security:** agreguen la dependencia de seguridad y protejan al menos un endpoint sensible (por ejemplo, `POST` o `DELETE`) exigiendo autenticación.
7. **Generar y validar un JWT:** implementen (o simulen con una librería) la emisión de un token JWT al autenticarse, y verifiquen que el endpoint protegido lo exija en la cabecera `Authorization` (Baeldung, 2025).
8. **Configurar CORS:** habiliten el origen `http://localhost:4200` (puerto típico de Angular) para los endpoints de la API (MDN Web Docs, 2025b).
9. **Probar todo el flujo:** verifiquen con Postman que el CRUD completo responde con los códigos correctos, que el endpoint protegido rechaza peticiones sin token válido, y que la configuración CORS está activa.

### Producto esperado
Controlador con CRUD completo (`show`, `create`, `update`, `delete`), validaciones y manejo de errores con códigos HTTP correctos, al menos un endpoint protegido con JWT mediante Spring Security, y configuración de CORS habilitada para el origen de Angular.

### Preguntas de análisis o reflexión
- ¿Qué diferencia existe entre un error 400 y un error 401? Da un ejemplo de tu proyecto para cada uno.
- ¿Por qué es más eficiente validar un JWT localmente que consultar la base de datos en cada petición?
- ¿Qué riesgo existiría si configuraran CORS permitiendo cualquier origen (`*`) en un sistema en producción?

### Criterios de evaluación
| Criterio | Descripción |
|---|---|
| CRUD completo | Los métodos show, create, update y delete funcionan correctamente. |
| Validaciones y errores | Las respuestas HTTP corresponden correctamente a cada escenario (éxito, error de datos, no encontrado). |
| Autenticación JWT | Al menos un endpoint exige y valida correctamente un token JWT. |
| Configuración CORS | El origen de Angular está correctamente habilitado. |
| Reflexión técnica | Las respuestas evidencian comprensión de los riesgos y buenas prácticas de seguridad. |

## Tarea de la semana
Para aplicar lo aprendido, resuelve los [ejercicios de esta semana](ejercicios.md).
