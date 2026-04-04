import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, ShadingType, convertInchesToTwip } from "docx";
import * as fs from "fs";
import * as path from "path";

const SENA_GREEN = "39A900";
const SENA_DARK = "1a1a2e";

// Crear directorio output si no existe
const outputDir = path.resolve("./output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const doc = new Document({
  sections: [
    {
      children: [
        // PORTADA
        new Paragraph({
          children: [
            new TextRun({
              text: "GEOASISTENCIA - SENA",
              bold: true,
              size: 52,
              color: SENA_GREEN,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Justificación de la Programación Orientada a Objetos (POO)",
              bold: true,
              size: 32,
              color: SENA_DARK,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Análisis Técnico del Proyecto",
              size: 24,
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: `Fecha: ${new Date().toLocaleDateString("es-ES")}`,
              size: 20,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
        }),

        // INDICE
        new Paragraph({
          children: [
            new TextRun({
              text: "ÍNDICE",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 400 },
        }),

        new Paragraph({
          text: "1. Encapsulamiento",
          style: "List Number",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "2. Herencia y Especialización",
          style: "List Number",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "3. Polimorfismo",
          style: "List Number",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "4. Abstracción",
          style: "List Number",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "5. Inyección de Dependencias",
          style: "List Number",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "6. Patrón Repository",
          style: "List Number",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "7. Hooks del Ciclo de Vida",
          style: "List Number",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "8. Arquitectura Modular",
          style: "List Number",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "9. Relaciones Complejas",
          style: "List Number",
          spacing: { after: 800 },
        }),

        // INTRODUCCIÓN
        new Paragraph({
          children: [
            new TextRun({
              text: "INTRODUCCIÓN",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "GeoAsistencia es un sistema de gestión de asistencia académica basado en ubicación geográfica. Su arquitectura está construida con Programación Orientada a Objetos (POO), un paradigma fundamental que permite modelar correctamente la complejidad del dominio de negocio.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Este documento justifica el uso de POO en cada aspecto técnico del proyecto, demostrando cómo los principios de encapsulamiento, herencia, polimorfismo y abstracción son esenciales para su funcionamiento.",
          spacing: { after: 800 },
        }),

        // SECCIÓN 1: ENCAPSULAMIENTO
        new Paragraph({
          children: [
            new TextRun({
              text: "1. ENCAPSULAMIENTO",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "El encapsulamiento protege los datos internos de una clase, exponiendo solo lo necesario a través de métodos públicos.",
          spacing: { after: 300 },
        }),

        // Tabla ejemplo 1
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Clase", bold: true })],
                  shading: { type: ShadingType.SOLID, color: SENA_GREEN },
                }),
                new TableCell({
                  children: [new Paragraph({ text: "Encapsulamiento", bold: true })],
                  shading: { type: ShadingType.SOLID, color: SENA_GREEN },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("User")],
                }),
                new TableCell({
                  children: [
                    new Paragraph(
                      "Getter fullName() y getValidRoles() ocultan la lógica interna de validación"
                    ),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("UserService")],
                }),
                new TableCell({
                  children: [
                    new Paragraph(
                      "Métodos privados como baseListQuery() y validateUniqueUserId() protegen implementación"
                    ),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("AuthService")],
                }),
                new TableCell({
                  children: [
                    new Paragraph(
                      "Encapsula integración Supabase, exponiendo solo métodos de autenticación"
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "", spacing: { after: 400 } }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Ejemplo de Encapsulamiento en User Entity:",
              bold: true,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'getValidRoles(): Role[] {\n  return this.roles.filter((role) => {\n    const name = role.name.toUpperCase() as ValidRole;\n    if (name === ValidRole.STUDENT) return !!this.student && this.student.is_active;\n    if (name === ValidRole.TEACHER) return !!this.teacher && this.teacher.is_active;\n    return true;\n  });\n}',
          style: "Intense Quote",
          spacing: { after: 400 },
        }),

        // SECCIÓN 2: HERENCIA
        new Paragraph({
          children: [
            new TextRun({
              text: "2. HERENCIA Y ESPECIALIZACIÓN",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "Se implementa un patrón de herencia por composición usando relaciones OneToOne:",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "User (clase base)",
          style: "List Bullet",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "├─ Student (especialización: uuid_phone, enrollments, attendances)",
          style: "List Bullet",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "└─ Teacher (especialización: uuid_phone, classGroups)",
          style: "List Bullet",
          spacing: { after: 300 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Beneficios:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "Compartir atributos comunes entre todos los usuarios",
          style: "List Bullet",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Agregar comportamientos específicos por tipo de usuario",
          style: "List Bullet",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Mantener integridad referencial con onDelete: CASCADE",
          style: "List Bullet",
          spacing: { after: 400 },
        }),

        // SECCIÓN 3: POLIMORFISMO
        new Paragraph({
          children: [
            new TextRun({
              text: "3. POLIMORFISMO",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "El sistema de Control de Acceso utiliza polimorfismo mediante Guards y Decoradores.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Ejemplo en PermissionsGuard:\nif (roles.some((r) => elevatedRoles.has(r.name))) return true;',
          style: "Intense Quote",
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: "Los decoradores @RequiredPermissions, @PublicAccess y @GetUser aplican comportamiento polimórfico a cualquier controlador sin modificar su código.",
          spacing: { after: 400 },
        }),

        // SECCIÓN 4: ABSTRACCIÓN
        new Paragraph({
          children: [
            new TextRun({
              text: "4. ABSTRACCIÓN",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "Las interfaces definen contratos claros entre capas de la aplicación.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Ejemplo - Interface ICurrentUser:",
              bold: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'interface ICurrentUser {\n  authId: string;\n  ID_user: string;\n  roles: { id: string; name: ValidRole }[];\n  permissions: string[];\n}',
          style: "Intense Quote",
          spacing: { after: 400 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "DTOs (Data Transfer Objects):",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "CreateUserDto, UpdateUserDto → entrada",
          style: "List Bullet",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "UserResponseDto, UserMeResponseDto → salida",
          style: "List Bullet",
          spacing: { after: 400 },
        }),

        // SECCIÓN 5: INYECCIÓN DE DEPENDENCIAS
        new Paragraph({
          children: [
            new TextRun({
              text: "5. INYECCIÓN DE DEPENDENCIAS",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "NestJS proporciona inyección de dependencias nativa, reduciendo el acoplamiento entre módulos.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Ejemplo en UserService:",
              bold: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: '@Injectable()\nexport class UserService {\n  constructor(\n    @InjectRepository(User) private readonly userRepo: Repository<User>,\n    private readonly authService: AuthService,\n    private readonly rolesService: RolesService,\n    private readonly menuService: MenuService,\n  ) {}\n}',
          style: "Intense Quote",
          spacing: { after: 300 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Beneficios:",
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "Bajo acoplamiento entre módulos",
          style: "List Bullet",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Facilita testing con mocks",
          style: "List Bullet",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Código más mantenible y escalable",
          style: "List Bullet",
          spacing: { after: 400 },
        }),

        // SECCIÓN 6: PATRÓN REPOSITORY
        new Paragraph({
          children: [
            new TextRun({
              text: "6. PATRÓN REPOSITORY",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "TypeORM implementa el patrón Repository, separando la lógica de negocio de la persistencia.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: '@InjectRepository(User) private readonly userRepo: Repository<User>\n@InjectRepository(Role) private readonly roleRepo: Repository<Role>',
          style: "Intense Quote",
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: "Este patrón permite cambiar la implementación de la base de datos sin modificar la lógica de negocio.",
          spacing: { after: 400 },
        }),

        // SECCIÓN 7: HOOKS DEL CICLO DE VIDA
        new Paragraph({
          children: [
            new TextRun({
              text: "7. HOOKS DEL CICLO DE VIDA",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "Las entidades usan decoradores para ejecutar lógica automáticamente en eventos del ciclo de vida.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: '@BeforeInsert()\n@BeforeUpdate()\nnormalizeNames() {\n  if (this.first_name) this.first_name = toTitleCase(this.first_name);\n}',
          style: "Intense Quote",
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: "Esto garantiza que los datos se normalizan automáticamente antes de persistirse en la base de datos.",
          spacing: { after: 400 },
        }),

        // SECCIÓN 8: ARQUITECTURA MODULAR
        new Paragraph({
          children: [
            new TextRun({
              text: "8. ARQUITECTURA MODULAR",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "El proyecto implementa el Principio de Responsabilidad Única, separando la lógica en módulos independientes.",
          spacing: { after: 300 },
        }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Módulo", bold: true })],
                  shading: { type: ShadingType.SOLID, color: SENA_GREEN },
                }),
                new TableCell({
                  children: [new Paragraph({ text: "Responsabilidad", bold: true })],
                  shading: { type: ShadingType.SOLID, color: SENA_GREEN },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("academic")] }),
                new TableCell({
                  children: [new Paragraph("Lógica académica (Semester, Subject)")],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("access-control")] }),
                new TableCell({
                  children: [new Paragraph("Roles, Permisos, Menús")],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("auth")] }),
                new TableCell({
                  children: [new Paragraph("Autenticación")],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("class-group")] }),
                new TableCell({
                  children: [
                    new Paragraph("Grupos, Asistencias, Inscripciones"),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("users")] }),
                new TableCell({
                  children: [new Paragraph("Usuarios, Estudiantes, Profesores")],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "", spacing: { after: 400 } }),

        // SECCIÓN 9: RELACIONES COMPLEJAS
        new Paragraph({
          children: [
            new TextRun({
              text: "9. RELACIONES COMPLEJAS",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "El modelo de datos representa relaciones complejas entre entidades.",
          spacing: { after: 300 },
        }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Tipo", bold: true })],
                  shading: { type: ShadingType.SOLID, color: SENA_GREEN },
                }),
                new TableCell({
                  children: [new Paragraph({ text: "Ejemplo", bold: true })],
                  shading: { type: ShadingType.SOLID, color: SENA_GREEN },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("ManyToMany")] }),
                new TableCell({
                  children: [
                    new Paragraph("User ↔ Role, Role ↔ Permission"),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("OneToMany")] }),
                new TableCell({
                  children: [
                    new Paragraph("Teacher → ClassGroup, Student → Enrollment"),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("ManyToOne")] }),
                new TableCell({
                  children: [
                    new Paragraph("Enrollment → ClassGroup, Attendance → ClassSession"),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("OneToOne")] }),
                new TableCell({
                  children: [new Paragraph("User ↔ Student, User ↔ Teacher")],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "", spacing: { after: 400 } }),

        // CONCLUSIÓN
        new Paragraph({
          children: [
            new TextRun({
              text: "CONCLUSIÓN",
              bold: true,
              size: 28,
              color: SENA_GREEN,
            }),
          ],
          spacing: { after: 200, before: 400 },
        }),

        new Paragraph({
          text: "GeoAsistencia utiliza Programación Orientada a Objetos porque un sistema de gestión académica requiere:",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Modelar entidades del mundo real (usuarios, estudiantes, profesores, clases, asistencias)",
          style: "List Number",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Gestionar relaciones complejas que POO maneja naturalmente",
          style: "List Number",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Reutilizar código mediante servicios inyectables y herencia",
          style: "List Number",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Mantener escalabilidad en sistema de permisos usando polimorfismo",
          style: "List Number",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Garantizar seguridad mediante guards y decoradores que encapsulan validaciones",
          style: "List Number",
          spacing: { after: 400 },
        }),

        new Paragraph({
          text: "NestJS potencia estos principios con arquitectura basada en clases, decoradores y módulos, haciendo que POO sea la elección natural y óptima para este tipo de aplicación empresarial.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "---",
              italics: true,
              color: "999999",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: `Documento generado el ${new Date().toLocaleDateString("es-ES")} | GeoAsistencia-SENA`,
              size: 16,
              italics: true,
              color: "666666",
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    },
  ],
});

// Generar archivo
Packer.toBuffer(doc).then((buffer) => {
  const filePath = path.join(outputDir, "Justificacion-POO-GeoAsistencia.docx");
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Documento generado exitosamente en: ${filePath}`);
  console.log(`✓ Archivo: Justificacion-POO-GeoAsistencia.docx`);
});
