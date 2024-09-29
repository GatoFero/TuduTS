Se modifico y optimizo la clase Task agregando los campo author y priority.
Ahora cada objeto task crea independientemente sus iconos.

![img.png](imgDocumentation/img.png)

La clase Table utiliza los elementos html necesarios para el funcionamiento del programa,
 su metodo mas importante es el de renderizar la tabla, setea las funciones importantes
a cada boton de las task con su posicion actual.

![img_4.png](imgDocumentation/img_4.png)
![img_5.png](imgDocumentation/img_5.png)
![img_6.png](imgDocumentation/img_6.png)

Se creo la clase TasksList que utiliza las 2 clases anteriores maneja las 4 funciones pedidas
y las manda a la tabla para su seteo a cada boton, asi reutilizando codigo y abierto a nuevas
implementaciones.

![img_1.png](imgDocumentation/img_1.png)
![img_2.png](imgDocumentation/img_2.png)
![img_3.png](imgDocumentation/img_3.png)