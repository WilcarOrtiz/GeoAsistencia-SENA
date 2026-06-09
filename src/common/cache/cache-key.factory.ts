export class CacheKeyFactory {
  static build(
    module: string,
    action: string,
    params?: Record<string, unknown>,
  ): string {
    if (!params) return `${module}:${action}`;

    const normalized = Object.keys(params)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        if (params[key] !== undefined && params[key] !== null) {
          acc[key] = params[key];
        }
        return acc;
      }, {});

    return `${module}:${action}:${JSON.stringify(normalized)}`;
  }
}
