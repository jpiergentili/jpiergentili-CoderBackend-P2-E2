# Proyecto Backend - Mercadoliebre

Este proyecto es una aplicación backend desarrollada con **Express**, **MongoDB**, **Handlebars** y **JavaScript**. La aplicación permite la gestión de usuarios, carritos de compra y productos, así como el proceso de compra que genera tickets con un resumen de la transacción.

## Características

- **Autenticación y Autorización:**  
  - Registro y login de usuarios utilizando Passport.
  - Uso de estrategias locales y de terceros (GitHub).
  - Acceso diferenciado según rol: `admin` y `user`.

- **Gestión de Productos y Carritos:**  
  - Los usuarios pueden agregar productos al carrito.
  - Los administradores pueden crear, actualizar y eliminar productos.
  - Cada usuario al registrarse tiene un carrito único asociado.

- **Proceso de Compra:**  
  - Al finalizar la compra, se genera un ticket que:
    - Tiene un código único (generado automáticamente).
    - Registra la fecha y hora exacta de la compra.
    - Calcula el monto total de la transacción.
    - Muestra la lista de productos comprados.
    - En caso de stock insuficiente, se compra la cantidad disponible y el remanente queda en el carrito.
    - Se muestra un resumen separado con los productos que no pudieron comprarse en su totalidad.


# CREDENCIALES PARA ACCEDER COMO ADMIN:
Usuario: admincoder@mercadoliebre.com
Contraseña: admin
