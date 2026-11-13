[← Volver al inicio](../../README.md)

## Ejercicios para practicar

### I. Ejercicios conceptuales
1. Explica la diferencia entre autenticación y autorización, usando un ejemplo de tu proyecto.
2. ¿Por qué CORS es una política que aplica el navegador y no una restricción del propio backend? (MDN Web Docs, 2025b)
3. Enumera tres códigos de respuesta HTTP de la clase 4xx y describe en qué escenario debería usarse cada uno.

### II. Ejercicios aplicados
1. Un endpoint `PUT /api/pedidos/{id}` recibe un pedido con una cantidad negativa. Especifica qué validación aplicarías y qué código HTTP debería devolver el sistema.
2. Diseña la configuración mínima de CORS necesaria para que una aplicación Angular en `http://localhost:4200` pueda consumir una API en `http://localhost:8080`.

### III. Mini caso práctico
El equipo del sistema de seguimiento de pacientes con anemia (ODS 9) debe decidir qué endpoints proteger antes de integrar el frontend en Angular. Consigna: en grupos de 3 a 4 estudiantes, (a) identifiquen qué endpoints del proyecto deberían requerir autenticación JWT y cuáles podrían ser públicos, (b) definan los códigos HTTP que debería devolver el endpoint de registro de pacientes ante éxito, datos inválidos y usuario no autenticado, y (c) especifiquen la configuración de CORS necesaria para el entorno de desarrollo del proyecto.