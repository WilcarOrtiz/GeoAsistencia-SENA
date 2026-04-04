import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  convertInchesToTwip,
} from "docx";
import * as fs from "fs";

// Colores del SENA
const SENA_GREEN = "39A900";
const SENA_DARK = "1a1a2e";
const CODE_BG = "f4f4f4";

function createCodeBlock(code, language = "typescript") {
  const lines = code.split("\n");
  return lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line || " ",
            font: "Consolas",
            size: 18,
            color: "2d2d2d",
          }),
        ],
        shading: {
          type: ShadingType.SOLID,
          color: CODE_BG,
        },
        spacing: { line: 240 },
        indent: { left: convertInchesToTwip(0.3) },
      })
  );
}

function createTitle(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        color: level === HeadingLevel.HEADING_1 ? SENA_GREEN : SENA_DARK,
        size: level === HeadingLevel.HEADING_1 ? 48 : 32,
      }),
    ],
    heading: level,
    spacing: { before: 400, after: 200 },
  });
}

function createParagraphText(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 24,
      }),
    ],
    spacing: { after: 200 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function createBulletPoint(text, bold = "") {
  const children = [];
  if (bold) {
    children.push(
      new TextRun({
        text: bold + " ",
        bold: true,
        size: 24,
      })
    );
  }
  children.push(
    new TextRun({
      text,
      size: 24,
    })
  );

  return new Paragraph({
    children,
    bullet: { level: 0 },
    spacing: { after: 100 },
  });
}

function createTable(headers, rows) {
  const headerCells = headers.map(
    (h) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: h,
                bold: true,
                color: "FFFFFF",
                size: 22,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        shading: { type: ShadingType.SOLID, color: SENA_GREEN },
        verticalAlign: "center",
      })
  );

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      size: 20,
                    }),
                  ],
                }),
              ],
              margins: {
                top: 100,
                bottom: 100,
                left: 100,
                right: 100,
              },
            })
        ),
      })
  );

  return new Table({
    rows: [new TableRow({ children: headerCells }), ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// Crear el documento
const doc = new Document({
  creator: "GeoAsistencia-SENA",
  title: "Justificación del Uso de POO en GeoAsistencia-SENA",
  description: "Documento técnico que justifica el uso de Programación Orientada a Objetos",
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: [
        // PORTADA
        new Paragraph({ spacing: { after: 1000 } }),
        new Paragraph({
          children: [
            new TextRun({
              text: "SERVICIO NACIONAL DE APRENDIZAJE - SENA",
              bold: true,
              size: 32,
              color: SENA_GREEN,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ spacing: { after: 800 } }),
        new Paragraph({
          children: [
            new TextRun({
              text: "JUSTIFICACIÓN DEL USO DE",
              bold: true,
              size: 56,
              color: SENA_DARK,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "PROGRAMACIÓN ORIENTADA A OBJETOS",
              bold: true,
              size: 56,
              color: SENA_GREEN,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ spacing: { after: 600 } }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Proyecto: GeoAsistencia-SENA",
              size: 36,
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Sistema de Gestión de Asistencia con Geolocalización",
              size: 28,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 1500 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Framework: NestJS con TypeORM",
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Lenguaje: TypeScript",
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Fecha: ${new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}`,
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),

        // PÁGINA 2 - INTRODUCCIÓN
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("1. INTRODUCCIÓN"),
        createParagraphText(
          "El presente documento tiene como objetivo justificar técnicamente el uso del paradigma de Programación Orientada a Objetos (POO) en el desarrollo del proyecto GeoAsistencia-SENA, un sistema integral de gestión de asistencia académica con capacidades de geolocalización."
        ),
        createParagraphText(
          "GeoAsistencia-SENA es una aplicación backend desarrollada con NestJS y TypeORM que implementa un sistema completo de control de asistencia para instituciones educativas. El sistema maneja usuarios, estudiantes, profesores, grupos de clase, inscripciones, sesiones de clase y registros de asistencia, todo integrado con autenticación segura mediante Supabase."
        ),
        createParagraphText(
          "La elección de POO como paradigma principal no fue arbitraria, sino una decisión arquitectónica fundamentada en las características del dominio del problema y los requisitos de mantenibilidad, escalabilidad y seguridad del sistema."
        ),

        // PÁGINA 3 - ENCAPSULAMIENTO
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("2. PRINCIPIOS DE POO APLICADOS"),
        createTitle("2.1 Encapsulamiento", HeadingLevel.HEADING_2),
        createParagraphText(
          "El encapsulamiento es uno de los pilares fundamentales de POO que permite ocultar la implementación interna de las clases y exponer solo las interfaces necesarias. En GeoAsistencia-SENA, este principio se aplica de manera extensiva:"
        ),

        createTitle("Ejemplo 1: Entidad User", HeadingLevel.HEADING_3),
        createParagraphText(
          "La entidad User encapsula la lógica de validación de roles, ocultando la complejidad al resto del sistema:"
        ),
        ...createCodeBlock(`// src/users/user/entities/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  ID_user: string;

  @Column({ unique: true })
  auth_id: string;

  // Getter que encapsula la lógica de concatenación
  get fullName(): string {
    return \`\${this.first_name} \${this.last_name}\`.trim();
  }

  // Método que encapsula la validación de roles activos
  getValidRoles(): Role[] {
    return this.roles.filter((role) => {
      const name = role.name.toUpperCase() as ValidRole;
      if (name === ValidRole.STUDENT) 
        return !!this.student && this.student.is_active;
      if (name === ValidRole.TEACHER) 
        return !!this.teacher && this.teacher.is_active;
      return true;
    });
  }
}`),
        new Paragraph({ spacing: { after: 300 } }),

        createTitle("Ejemplo 2: UserService con métodos privados", HeadingLevel.HEADING_3),
        createParagraphText(
          "El servicio UserService utiliza métodos privados para encapsular queries reutilizables:"
        ),
        ...createCodeBlock(`// src/users/user/service/user.service.ts
@Injectable()
export class UserService {
  // Método PRIVADO: oculta la complejidad del query builder
  private baseListQuery(): SelectQueryBuilder<User> {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoin('user.student', 'student')
      .leftJoin('user.teacher', 'teacher');
  }

  // Método PRIVADO: valida unicidad del documento
  private async validateUniqueUserId(
    userId: string, 
    excludeId?: string
  ): Promise<void> {
    const existing = await this.userRepo.findOne({
      where: { user_id: userId }
    });
    if (existing && existing.ID_user !== excludeId) {
      throw new BadRequestException(
        'El número de documento ya está registrado'
      );
    }
  }
}`),
        new Paragraph({ spacing: { after: 300 } }),

        createTable(
          ["Clase", "Elementos Encapsulados", "Beneficio"],
          [
            ["User", "fullName (getter), getValidRoles()", "Oculta lógica de validación de roles"],
            ["UserService", "baseListQuery(), validateUniqueUserId()", "Reutilización de queries complejos"],
            ["AuthService", "Integración con Supabase Auth", "Abstrae la autenticación externa"],
            ["PermissionsGuard", "Lógica de verificación de permisos", "Seguridad centralizada"],
          ]
        ),

        // PÁGINA 4 - HERENCIA
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("2.2 Herencia y Especialización", HeadingLevel.HEADING_2),
        createParagraphText(
          "GeoAsistencia-SENA implementa un patrón de herencia por composición utilizando relaciones OneToOne de TypeORM. Esto permite que User sea la clase base con atributos comunes, mientras Student y Teacher son especializaciones con atributos y comportamientos específicos."
        ),

        createTitle("Diagrama de Jerarquía de Usuarios", HeadingLevel.HEADING_3),
        ...createCodeBlock(`                    ┌─────────────────────────────┐
                    │           USER              │
                    │─────────────────────────────│
                    │ - ID_user: UUID             │
                    │ - auth_id: string           │
                    │ - user_id: string           │
                    │ - first_name: string        │
                    │ - last_name: string         │
                    │ - email: string             │
                    │ - phone: string             │
                    │ - is_active: boolean        │
                    │─────────────────────────────│
                    │ + fullName: string          │
                    │ + getValidRoles(): Role[]   │
                    └──────────┬──────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                                       │
           ▼                                       ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│       STUDENT           │           │       TEACHER           │
│─────────────────────────│           │─────────────────────────│
│ - ID_student: UUID      │           │ - ID_teacher: UUID      │
│ - uuid_phone: string    │           │ - uuid_phone: string    │
│ - is_active: boolean    │           │ - is_active: boolean    │
│─────────────────────────│           │─────────────────────────│
│ + enrollments[]         │           │ + classGroups[]         │
│ + attendances[]         │           │                         │
└─────────────────────────┘           └─────────────────────────┘`),
        new Paragraph({ spacing: { after: 300 } }),

        createTitle("Implementación en Código", HeadingLevel.HEADING_3),
        ...createCodeBlock(`// src/users/student/entities/student.entity.ts
@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  ID_student: string;

  @Column({ nullable: true })
  uuid_phone: string;

  @Column({ default: true })
  is_active: boolean;

  // Relación OneToOne con User (herencia por composición)
  @OneToOne(() => User, (user) => user.student, {
    onDelete: 'CASCADE',  // Si se elimina User, se elimina Student
  })
  @JoinColumn({ name: 'ID_user' })
  user: User;

  // Relaciones específicas de Student
  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];
}`),
        new Paragraph({ spacing: { after: 200 } }),

        createParagraphText(
          "Este patrón ofrece ventajas significativas sobre la herencia tradicional de clases:"
        ),
        createBulletPoint("Permite que un User pueda ser simultáneamente Student y Teacher", "Flexibilidad:"),
        createBulletPoint("La eliminación en cascada mantiene la coherencia de datos", "Integridad:"),
        createBulletPoint("Cada tabla tiene solo sus columnas específicas", "Eficiencia:"),

        // PÁGINA 5 - POLIMORFISMO
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("2.3 Polimorfismo", HeadingLevel.HEADING_2),
        createParagraphText(
          "El polimorfismo permite tratar objetos de diferentes clases de manera uniforme a través de una interfaz común. En GeoAsistencia-SENA, este principio se manifiesta principalmente en el sistema de control de acceso y los decoradores personalizados."
        ),

        createTitle("Sistema de Control de Acceso Polimórfico", HeadingLevel.HEADING_3),
        ...createCodeBlock(`// src/common/guard/PermissionsGuard.guard.ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verifica acceso público (polimorfismo en metadatos)
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_KEY, [context.getHandler(), context.getClass()]
    );
    if (isPublic) return true;

    const user: ICurrentUser = request.user;
    const roles = user.roles;

    // POLIMORFISMO: Todos los roles se tratan uniformemente
    const elevatedRoles = new Set([
      ValidRole.ADMIN, ValidRole.SUPER_ADMIN, ValidRole.COORDINATOR
    ]);
    
    // Cualquier rol "elevado" tiene acceso completo
    if (roles.some((r) => elevatedRoles.has(r.name))) return true;

    // Verificación polimórfica de permisos
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY, [context.getHandler(), context.getClass()]
    );

    // Todos los permisos se validan de la misma manera
    return requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );
  }
}`),
        new Paragraph({ spacing: { after: 300 } }),

        createTitle("Decoradores Polimórficos", HeadingLevel.HEADING_3),
        createParagraphText(
          "Los decoradores personalizados aplican comportamiento de manera polimórfica a cualquier controlador o método:"
        ),
        ...createCodeBlock(`// src/common/decorators/permissions.decorator.ts
// Aplica permisos requeridos a CUALQUIER endpoint
export const RequiredPermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// src/common/decorators/public.decorator.ts
// Marca CUALQUIER endpoint como público
export const PublicAccess = () => SetMetadata(PUBLIC_KEY, true);

// src/common/decorators/get-user.decorator.ts
// Extrae el usuario de CUALQUIER request
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as ICurrentUser;
    return data ? user?.[data] : user;
  },
);

// USO POLIMÓRFICO EN CONTROLADORES:
@Controller('users')
export class UserController {
  @Get('me')
  @PublicAccess()  // Cualquier usuario autenticado
  getMe(@GetUser() user: ICurrentUser) { }

  @Delete(':id')
  @RequiredPermissions('users.delete')  // Solo con permiso específico
  remove(@Param('id') id: string) { }
}`),

        // PÁGINA 6 - ABSTRACCIÓN
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("2.4 Abstracción", HeadingLevel.HEADING_2),
        createParagraphText(
          "La abstracción permite definir contratos claros mediante interfaces y clases abstractas, ocultando los detalles de implementación. GeoAsistencia-SENA utiliza interfaces TypeScript y DTOs para lograr este objetivo."
        ),

        createTitle("Interfaces para Contratos de Datos", HeadingLevel.HEADING_3),
        ...createCodeBlock(`// src/common/interface/current-user.interface.ts
export interface ICurrentUser {
  authId: string;
  ID_user: string;
  roles: {
    id: string;
    name: ValidRole;
  }[];
  permissions: string[];
  student?: {
    ID_student: string;
    uuid_phone: string;
  };
  teacher?: {
    ID_teacher: string;
    uuid_phone: string;
  };
}

// Esta interfaz ABSTRAE la estructura del usuario autenticado
// Cualquier componente que necesite datos del usuario
// trabaja con esta interfaz, no con la implementación`),
        new Paragraph({ spacing: { after: 300 } }),

        createTitle("DTOs como Capa de Abstracción", HeadingLevel.HEADING_3),
        createParagraphText(
          "Los Data Transfer Objects (DTOs) abstraen la comunicación entre las capas de la aplicación:"
        ),
        ...createCodeBlock(`// ENTRADA: Lo que el cliente envía
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;  // Número de documento

  @IsEmail()
  email: string;

  @IsArray()
  @IsUUID('4', { each: true })
  roleIds: string[];
}

// SALIDA: Lo que el servidor responde
export class UserResponseDto {
  ID_user: string;
  fullName: string;
  email: string;
  roles: RoleBasicDto[];
  is_active: boolean;
  
  // El cliente NO ve: auth_id, password hash, queries internos
}`),
        new Paragraph({ spacing: { after: 200 } }),

        createTable(
          ["Capa", "Abstracción", "Propósito"],
          [
            ["Controlador", "DTOs de entrada", "Validar y transformar datos del cliente"],
            ["Servicio", "Interfaces de usuario", "Definir contrato de datos internos"],
            ["Repositorio", "Entidades TypeORM", "Mapear objetos a tablas de BD"],
            ["Respuesta", "DTOs de salida", "Filtrar datos sensibles al cliente"],
          ]
        ),

        // PÁGINA 7 - PATRONES DE DISEÑO
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("3. PATRONES DE DISEÑO IMPLEMENTADOS"),
        
        createTitle("3.1 Inyección de Dependencias (DI)", HeadingLevel.HEADING_2),
        createParagraphText(
          "NestJS implementa nativamente el patrón de Inyección de Dependencias, permitiendo un bajo acoplamiento entre módulos y facilitando las pruebas unitarias."
        ),
        ...createCodeBlock(`// src/users/user/service/user.service.ts
@Injectable()
export class UserService {
  constructor(
    // Repositorio inyectado - no creamos instancia manualmente
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    // Servicios inyectados - NestJS maneja el ciclo de vida
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
    private readonly menuService: MenuService,
    private userProfileService: UserProfileService,
  ) {}

  // Los servicios se usan sin conocer su implementación interna
  async create(dto: CreateUserDto): Promise<User> {
    const { authId, tempPassword } = await this.authService
      .createUserCredentials(dto.email);
    // ...
  }
}`),
        new Paragraph({ spacing: { after: 300 } }),

        createBulletPoint("Los servicios no crean sus dependencias, las reciben", "Bajo acoplamiento:"),
        createBulletPoint("Fácil reemplazo de servicios reales por mocks en tests", "Testabilidad:"),
        createBulletPoint("NestJS gestiona instancias automáticamente", "Gestión del ciclo de vida:"),

        createTitle("3.2 Patrón Repository", HeadingLevel.HEADING_2),
        createParagraphText(
          "TypeORM proporciona el patrón Repository que separa la lógica de negocio de la persistencia de datos:"
        ),
        ...createCodeBlock(`// Inyección de repositorios específicos por entidad
@InjectRepository(User) private readonly userRepo: Repository<User>
@InjectRepository(Role) private readonly roleRepo: Repository<Role>
@InjectRepository(Student) private readonly studentRepo: Repository<Student>

// Uso del repositorio - abstrae SQL completamente
const user = await this.userRepo.findOne({
  where: { ID_user: id },
  relations: ['roles', 'student', 'teacher'],
});

// Query Builder para consultas complejas
const users = await this.userRepo
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.roles', 'role')
  .where('user.is_active = :active', { active: true })
  .getMany();`),

        // PÁGINA 8 - ARQUITECTURA MODULAR
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("4. ARQUITECTURA MODULAR"),
        createParagraphText(
          "GeoAsistencia-SENA sigue el Principio de Responsabilidad Única (SRP) organizando el código en módulos independientes, cada uno con una responsabilidad específica:"
        ),

        ...createCodeBlock(`src/
├── academic/                    # Módulo Académico
│   ├── semester/               # Gestión de semestres
│   └── subject/                # Gestión de materias
│
├── access-control-module/       # Módulo de Control de Acceso
│   ├── menu/                   # Menús de navegación
│   ├── permissions/            # Permisos del sistema
│   └── roles/                  # Roles de usuario
│
├── auth/                        # Módulo de Autenticación
│   ├── auth.controller.ts      # Endpoints de auth
│   ├── auth.service.ts         # Lógica con Supabase
│   └── strategies/             # Estrategias JWT
│
├── class-group/                 # Módulo de Grupos de Clase
│   ├── attendances/            # Registros de asistencia
│   ├── class-groups/           # Grupos de clase
│   ├── class-session/          # Sesiones de clase
│   └── enrollment/             # Inscripciones
│
├── common/                      # Módulo Común (compartido)
│   ├── decorators/             # Decoradores personalizados
│   ├── guard/                  # Guards de seguridad
│   ├── interface/              # Interfaces compartidas
│   └── utils/                  # Utilidades
│
└── users/                       # Módulo de Usuarios
    ├── student/                # Gestión de estudiantes
    ├── teacher/                # Gestión de profesores
    └── user/                   # Gestión de usuarios base`),
        new Paragraph({ spacing: { after: 300 } }),

        createTable(
          ["Módulo", "Responsabilidad", "Dependencias"],
          [
            ["academic", "Estructura académica (semestres, materias)", "Ninguna"],
            ["access-control", "Roles, permisos y menús", "Ninguna"],
            ["auth", "Autenticación y autorización", "users, access-control"],
            ["class-group", "Clases, sesiones y asistencias", "users, academic"],
            ["users", "Usuarios, estudiantes, profesores", "access-control, auth"],
            ["common", "Utilidades compartidas", "Ninguna"],
          ]
        ),

        // PÁGINA 9 - RELACIONES Y CICLO DE VIDA
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("5. RELACIONES ENTRE OBJETOS"),
        createParagraphText(
          "POO permite modelar relaciones complejas del mundo real. GeoAsistencia-SENA implementa todos los tipos de relaciones:"
        ),

        createTitle("5.1 Tipos de Relaciones Implementadas", HeadingLevel.HEADING_2),
        createTable(
          ["Tipo", "Ejemplo", "Código"],
          [
            ["OneToOne", "User ↔ Student", "@OneToOne(() => User, user => user.student)"],
            ["OneToMany", "Teacher → ClassGroup[]", "@OneToMany(() => ClassGroup, cg => cg.teacher)"],
            ["ManyToOne", "Enrollment → ClassGroup", "@ManyToOne(() => ClassGroup, cg => cg.enrollments)"],
            ["ManyToMany", "User ↔ Role[]", "@ManyToMany(() => Role, role => role.users)"],
            ["ManyToMany", "Role ↔ Permission[]", "@ManyToMany(() => Permission, p => p.roles)"],
          ]
        ),
        new Paragraph({ spacing: { after: 300 } }),

        createTitle("5.2 Hooks del Ciclo de Vida", HeadingLevel.HEADING_2),
        createParagraphText(
          "Las entidades utilizan hooks de TypeORM para ejecutar lógica automáticamente antes de operaciones de base de datos:"
        ),
        ...createCodeBlock(`// src/users/user/entities/user.entity.ts
@Entity('users')
export class User {
  // Hook ejecutado ANTES de insertar en BD
  @BeforeInsert()
  normalizeOnInsert() {
    this.normalizeNames();
    this.normalizeEmail();
  }

  // Hook ejecutado ANTES de actualizar en BD
  @BeforeUpdate()
  normalizeOnUpdate() {
    this.normalizeNames();
  }

  // Método privado que normaliza nombres a Title Case
  private normalizeNames() {
    if (this.first_name) {
      this.first_name = toTitleCase(this.first_name);
    }
    if (this.last_name) {
      this.last_name = toTitleCase(this.last_name);
    }
  }

  private normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}`),

        // PÁGINA 10 - CONCLUSIONES
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),
        createTitle("6. CONCLUSIONES"),
        createParagraphText(
          "El uso de Programación Orientada a Objetos en GeoAsistencia-SENA está plenamente justificado por las siguientes razones técnicas y de negocio:"
        ),

        new Paragraph({
          children: [
            new TextRun({
              text: "1. Modelado Natural del Dominio",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createParagraphText(
          "El sistema gestiona entidades del mundo real (usuarios, estudiantes, profesores, clases, asistencias) que se mapean naturalmente a clases y objetos. Las relaciones entre entidades (un profesor tiene muchos grupos, un estudiante tiene muchas inscripciones) se expresan de forma intuitiva mediante asociaciones de POO."
        ),

        new Paragraph({
          children: [
            new TextRun({
              text: "2. Mantenibilidad y Escalabilidad",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createParagraphText(
          "La arquitectura modular basada en clases permite agregar nuevas funcionalidades sin modificar código existente (Principio Open/Closed). Los cambios en una entidad no afectan a otras gracias al encapsulamiento."
        ),

        new Paragraph({
          children: [
            new TextRun({
              text: "3. Seguridad Robusta",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createParagraphText(
          "El sistema de control de acceso basado en roles y permisos se implementa de forma elegante mediante polimorfismo y decoradores. Los Guards encapsulan la lógica de autorización de manera reutilizable."
        ),

        new Paragraph({
          children: [
            new TextRun({
              text: "4. Reutilización de Código",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createParagraphText(
          "Los servicios inyectables, decoradores personalizados y utilidades compartidas evitan la duplicación de código. La herencia por composición permite compartir comportamiento entre tipos de usuario."
        ),

        new Paragraph({
          children: [
            new TextRun({
              text: "5. Testabilidad",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createParagraphText(
          "La Inyección de Dependencias facilita las pruebas unitarias al permitir reemplazar servicios reales por mocks. Cada clase tiene responsabilidades claras que pueden probarse de forma aislada."
        ),

        new Paragraph({
          children: [
            new TextRun({
              text: "6. Integración con el Ecosistema",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createParagraphText(
          "NestJS y TypeORM están diseñados para trabajar con POO. Usar otro paradigma iría en contra de las mejores prácticas del framework y reduciría la productividad del equipo de desarrollo."
        ),

        new Paragraph({ spacing: { after: 400 } }),
        new Paragraph({
          children: [
            new TextRun({
              text: "En conclusión, ",
              size: 24,
            }),
            new TextRun({
              text: "GeoAsistencia-SENA demuestra una implementación sólida y profesional de los principios de POO",
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: ", aprovechando al máximo las capacidades de TypeScript, NestJS y TypeORM para crear un sistema robusto, mantenible y escalable que cumple con los estándares de desarrollo de software empresarial.",
              size: 24,
            }),
          ],
          alignment: AlignmentType.JUSTIFIED,
        }),
      ],
    },
  ],
});

// Generar el documento
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync("justificacion-poo-geoasistencia.docx", buffer);

console.log("✅ Documento generado: justificacion-poo-geoasistencia.docx");
