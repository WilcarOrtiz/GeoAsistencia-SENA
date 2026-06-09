import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary:
      'Seed de carga inicial de datos académicos para pruebas del sistema',
    description: `
Este proceso permite la inserción de datos base en el sistema para pruebas y validación funcional.

Incluye:

- Creación de datos iniciales (asignaturas, semestres)
- Limpieza y eliminación de información previa (credenciales de acceso y registros en base de datos)
- Generación de datos necesarios para la simulación del sistema de asistencia
- Preparación del entorno para pruebas de integración y funcionalidad

Este seed facilita el despliegue del sistema en entornos de desarrollo y pruebas,
evitando la necesidad de registro manual de información.
  `,
  })
  excutedSEED() {}
}
