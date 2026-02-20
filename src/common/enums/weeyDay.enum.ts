export enum WeekDay {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const WeekDayLabel: Record<WeekDay, string> = {
  [WeekDay.SUNDAY]: 'Domingo',
  [WeekDay.MONDAY]: 'Lunes',
  [WeekDay.TUESDAY]: 'Martes',
  [WeekDay.WEDNESDAY]: 'Miércoles',
  [WeekDay.THURSDAY]: 'Jueves',
  [WeekDay.FRIDAY]: 'Viernes',
  [WeekDay.SATURDAY]: 'Sábado',
};

export const getWeekDayLabel = (day: WeekDay): string => {
  return WeekDayLabel[day] || 'Día inválido';
};
