import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, BorderStyle, VerticalAlign, AlignmentType, HeadingLevel, PageBreak, ShadingType, convertInchesToTwip } from 'docx';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Crear el documento
const doc = new Document({
  sections: [
    {
      children: [
        // PORTADA
        new Paragraph({
          text: '',
          spacing: { line: 400 },
        }),
        new Paragraph({
          text: '',
          spacing: { line: 400 },
        }),
        new Paragraph({
          text: 'JUSTIFICACIÓN DEL USO DE',
          alignment: AlignmentType.CENTER,
          spacing: { line: 200 },
          style: 'Heading1',
          bold: true,
          size: 48,
        }),
        new Paragraph({
          text: 'PROGRAMACIÓN ORIENTADA A OBJETOS (POO)',
          alignment: AlignmentType.CENTER,
          spacing: { line: 200 },
          style: 'Heading1',
          bold: true,
          size: 48,
          shading: { type: ShadingType.CLEAR, fill: 'E8F4F8' },
        }),
        new Paragraph({
          text: 'En el Proyecto GeoAsistencia-SENA',
          alignment: AlignmentType.CENTER,
          spacing: { line: 600 },
          style: 'Heading2',
          size: 28,
        }),
        new Paragraph({
          text: '',
          spacing: { line: 800 },
        }),
        new Paragraph({
          text: 'Sistema de Gestión de Asistencia Académica',
          alignment: AlignmentType.CENTER,
          spacing: { line: 200 },
          size: 24,
        }),
        new Paragraph({
          text: 'Desarrollado con NestJS y TypeORM',
          alignment: AlignmentType.CENTER,
          spacing: { line: 600 },
          size: 24,
        }),
        new Paragraph({
          text: '',
          spacing: { line: 800 },
        }),
        new Paragraph({
          text: '2024 - SENA',
          alignment: AlignmentType.CENTER,
          size: 20,
          italics: true,
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // ÍNDICE
        new Paragraph({
          text: 'TABLA DE CONTENIDOS',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: '1. Introducción',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '2. Encapsulamiento',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '3. Herencia y Especialización',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '4. Polimorfismo',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '5. Abstracción',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '6. Inyección de Dependencias',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '7. Patrón Repository',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '8. Hooks del Ciclo de Vida',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '9. Arquitectura Modular',
          spacing: { line: 200 },
        }),
        new Paragraph({
          text: '10. Relaciones Complejas',
          spacing: { line: 600 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // INTRODUCCIÓN
        new Paragraph({
          text: '1. INTRODUCCIÓN',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'GeoAsistencia-SENA es un sistema empresarial de gestión de asistencia académica desarrollado con NestJS, que implementa Programación Orientada a Objetos (POO) en cada aspecto de su arquitectura. Este documento justifica las razones por las cuales POO es el paradigma ideal para este tipo de aplicaciones.',
          spacing: { line: 240, after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // ENCAPSULAMIENTO
        new Paragraph({
          text: '2. ENCAPSULAMIENTO',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'El encapsulamiento es el principio fundamental de POO que protege los datos internos de una clase, permitiendo acceso controlado a través de métodos públicos.',
          spacing: { line: 240, after: 300 },
        }),

        // Tabla de encapsulamiento
        new Table({
          rows: [
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'Clase', bold: true })],
                  shading: { type: ShadingType.CLEAR, fill: 'B4C7E7' },
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Ejemplo de Encapsulamiento', bold: true })],
                  shading: { type: ShadingType.CLEAR, fill: 'B4C7E7' },
                }),
              ],
            }),
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'User' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Encapsula datos de usuario con métodos getValidRoles() que validan estados internos' })],
                }),
              ],
            }),
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'UserService' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Métodos privados protegen lógica interna: baseListQuery(), validateUniqueUserId()' })],
                }),
              ],
            }),
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'AuthService' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Encapsula toda la lógica de Supabase Auth, exponiendo solo métodos necesarios' })],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({
          text: '',
          spacing: { after: 400 },
        }),

        new Paragraph({
          text: 'Ejemplo de código:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'getValidRoles(): Role[] {\n  return this.roles.filter((role) => {\n    const name = role.name.toUpperCase();\n    if (name === "STUDENT") \n      return !!this.student && this.student.is_active;\n    if (name === "TEACHER") \n      return !!this.teacher && this.teacher.is_active;\n    return true;\n  });\n}',
          style: 'code',
          spacing: { line: 180, after: 400 },
          shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // HERENCIA
        new Paragraph({
          text: '3. HERENCIA Y ESPECIALIZACIÓN',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'El proyecto implementa herencia por composición mediante relaciones OneToOne, creando una jerarquía clara de tipos de usuarios.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: 'Estructura de Herencia:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'User (clase base con datos comunes)\n  ├─> Student (especialización con phone, enrollments)\n  └─> Teacher (especialización con phone, classGroups)',
          style: 'code',
          spacing: { line: 180, after: 400 },
          shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        }),

        new Paragraph({
          text: 'Beneficios:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '• Reutilización de código común a todos los usuarios\n• Atributos especializados por tipo de usuario\n• Mantención de integridad referencial con CASCADE',
          spacing: { line: 240, after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // POLIMORFISMO
        new Paragraph({
          text: '4. POLIMORFISMO',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'El sistema de Control de Acceso usa polimorfismo para tratar diferentes roles de manera uniforme.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: 'Ejemplo en PermissionsGuard:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'if (roles.some((r) => elevatedRoles.has(r.name))) {\n  return true; // Acceso concedido\n}',
          style: 'code',
          spacing: { line: 180, after: 400 },
          shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        }),

        new Paragraph({
          text: 'Los decoradores (@RequiredPermissions, @PublicAccess, @GetUser) aplican comportamiento polimorfico a cualquier controlador sin modificar su código.',
          spacing: { line: 240, after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // ABSTRACCIÓN
        new Paragraph({
          text: '5. ABSTRACCIÓN',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'Las interfaces y DTOs (Data Transfer Objects) abstraen la complejidad interna del sistema.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: 'Interface ICurrentUser:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'export interface ICurrentUser {\n  authId: string;\n  ID_user: string;\n  roles: { id: string; name: ValidRole }[];\n  permissions: string[];\n  // Abstrae la estructura del usuario autenticado\n}',
          style: 'code',
          spacing: { line: 180, after: 400 },
          shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        }),

        new Paragraph({
          text: 'Beneficios:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '• Simplifica la comunicación entre capas\n• Contrato claro entre componentes\n• Cambios internos sin afectar interfaces públicas',
          spacing: { line: 240, after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // INYECCIÓN DE DEPENDENCIAS
        new Paragraph({
          text: '6. INYECCIÓN DE DEPENDENCIAS',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'NestJS facilita Inyección de Dependencias nativa, lo que permite bajo acoplamiento entre módulos.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: 'Ejemplo en UserService:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '@Injectable()\nexport class UserService {\n  constructor(\n    @InjectRepository(User) \n    private readonly userRepo: Repository<User>,\n    private readonly authService: AuthService,\n    private readonly rolesService: RolesService,\n    private readonly menuService: MenuService,\n  ) {}\n}',
          style: 'code',
          spacing: { line: 180, after: 400 },
          shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        }),

        new Paragraph({
          text: 'Beneficios de DI:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '• Bajo acoplamiento entre módulos\n• Facilita testing con mocks\n• Código más mantenible y flexible\n• Inversión de control',
          spacing: { line: 240, after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // PATRÓN REPOSITORY
        new Paragraph({
          text: '7. PATRÓN REPOSITORY',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'El patrón Repository separa la lógica de negocio de la persistencia de datos.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: 'Implementación con TypeORM:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '@InjectRepository(User) \nprivate readonly userRepo: Repository<User>\n\n@InjectRepository(Role) \nprivate readonly roleRepo: Repository<Role>',
          style: 'code',
          spacing: { line: 180, after: 400 },
          shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        }),

        new Paragraph({
          text: 'Ventajas:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '• Aislamiento de la lógica de base de datos\n• Facilita cambios en la persistencia sin afectar lógica de negocio\n• Código testeable\n• Reutilización de consultas',
          spacing: { line: 240, after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // HOOKS DEL CICLO DE VIDA
        new Paragraph({
          text: '8. HOOKS DEL CICLO DE VIDA',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'Las entidades usan decoradores para ejecutar lógica automática en momentos específicos del ciclo de vida.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: 'Ejemplo de normalización automática:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '@BeforeInsert()\n@BeforeUpdate()\nnormalizeNames() {\n  if (this.first_name) \n    this.first_name = toTitleCase(this.first_name);\n  if (this.last_name) \n    this.last_name = toTitleCase(this.last_name);\n}',
          style: 'code',
          spacing: { line: 180, after: 400 },
          shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        }),

        new Paragraph({
          text: 'Beneficios:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '• Lógica de validación centralizada\n• Automatización de transformaciones\n• Garantiza consistencia de datos',
          spacing: { line: 240, after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // ARQUITECTURA MODULAR
        new Paragraph({
          text: '9. ARQUITECTURA MODULAR',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'El proyecto sigue el principio de Responsabilidad Única, organizando el código en módulos independientes.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: 'Estructura de Módulos:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'src/\n├── academic/                 # Lógica académica\n├── access-control-module/    # Roles y permisos\n├── auth/                     # Autenticación\n├── class-group/              # Grupos y asistencias\n├── common/                   # Utilidades compartidas\n└── users/                    # Usuarios y estudiantes',
          style: 'code',
          spacing: { line: 180, after: 400 },
          shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
        }),

        new Paragraph({
          text: 'Beneficios:',
          bold: true,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '• Cada módulo tiene una responsabilidad clara\n• Facilita mantenimiento y escalabilidad\n• Comunicación a través de servicios inyectados\n• Reutilización de código entre módulos',
          spacing: { line: 240, after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // RELACIONES COMPLEJAS
        new Paragraph({
          text: '10. RELACIONES COMPLEJAS',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'El sistema de gestión académica requiere relaciones complejas que POO maneja naturalmente.',
          spacing: { line: 240, after: 300 },
        }),

        // Tabla de relaciones
        new Table({
          rows: [
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'Tipo de Relación', bold: true })],
                  shading: { type: ShadingType.CLEAR, fill: 'B4C7E7' },
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Ejemplo', bold: true })],
                  shading: { type: ShadingType.CLEAR, fill: 'B4C7E7' },
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Propósito', bold: true })],
                  shading: { type: ShadingType.CLEAR, fill: 'B4C7E7' },
                }),
              ],
            }),
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'ManyToMany' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'User ↔ Role' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Múltiples roles por usuario' })],
                }),
              ],
            }),
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'OneToMany' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Teacher → ClassGroup' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Un profesor maneja múltiples grupos' })],
                }),
              ],
            }),
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'ManyToOne' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Enrollment → ClassGroup' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Múltiples inscripciones por grupo' })],
                }),
              ],
            }),
            new TableRow({
              cells: [
                new TableCell({
                  children: [new Paragraph({ text: 'OneToOne' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'User ↔ Student' })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: 'Cada usuario solo un estudiante' })],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({
          text: '',
          spacing: { after: 400 },
        }),

        // SALTO DE PÁGINA
        new PageBreak(),

        // CONCLUSIÓN
        new Paragraph({
          text: 'CONCLUSIÓN',
          style: 'Heading1',
          bold: true,
          spacing: { after: 400 },
        }),

        new Paragraph({
          text: 'Justificación del Uso de POO',
          style: 'Heading2',
          bold: true,
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: 'Se usa Programación Orientada a Objetos en GeoAsistencia-SENA porque:',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: '1. Modelado de Entidades del Mundo Real',
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'El sistema de gestión académica requiere representar entidades reales (usuarios, estudiantes, profesores, clases, asistencias) que se mapean naturalmente a clases y objetos.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: '2. Relaciones Complejas',
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Las relaciones entre entidades (ManyToMany, OneToMany, OneToOne) son manejadas de forma natural y eficiente por POO.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: '3. Reutilización de Código',
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'A través de herencia, composición e inyección de dependencias, se evita duplicación de código.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: '4. Mantenibilidad',
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'El encapsulamiento y la separación de responsabilidades hacen que el código sea más fácil de mantener y actualizar.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: '5. Escalabilidad',
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'La arquitectura modular permite agregar nuevas funcionalidades sin afectar el código existente.',
          spacing: { line: 240, after: 300 },
        }),

        new Paragraph({
          text: '6. Seguridad',
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Los guards y decoradores encapsulan lógica de validación de permisos de forma centralizada.',
          spacing: { line: 240, after: 400 },
        }),

        new Paragraph({
          text: 'NestJS potencia estos principios con su arquitectura basada en clases, decoradores y módulos, haciendo que POO sea la elección natural y óptima para esta aplicación empresarial.',
          spacing: { line: 240, italics: true, after: 400 },
        }),

        new Paragraph({
          text: '---',
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 400 },
        }),

        new Paragraph({
          text: 'Documento generado automáticamente',
          alignment: AlignmentType.CENTER,
          size: 18,
          italics: true,
        }),
      ],
    },
  ],
});

// Generar el archivo
Packer.toBuffer(doc).then((buffer) => {
  writeFileSync(
    resolve('/vercel/share/v0-project/public/Justificacion-POO-GeoAsistencia.docx'),
    buffer
  );
  console.log('Documento Word creado exitosamente en: public/Justificacion-POO-GeoAsistencia.docx');
});
