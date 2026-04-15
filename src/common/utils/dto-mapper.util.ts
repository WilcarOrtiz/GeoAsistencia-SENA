import { plainToInstance, ClassConstructor } from 'class-transformer';

const BASE_OPTIONS = { excludeExtraneousValues: true } as const;
const PAGINATED_OPTIONS = {
  ...BASE_OPTIONS,
  enableImplicitConversion: true,
} as const;

export const toDto = <T>(cls: ClassConstructor<T>, data: unknown): T =>
  plainToInstance(cls, data, BASE_OPTIONS);

export const toPaginatedDto = <T, R>(
  cls: ClassConstructor<T>,
  result: R & { data: unknown[] },
): Omit<R, 'data'> & { data: T[] } => ({
  ...result,
  data: plainToInstance(cls, result.data, PAGINATED_OPTIONS),
});
