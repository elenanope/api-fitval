import { PlanRow, toPlan } from './plan';

describe('toPlan', () => {
  it('convierte una fila de la base de datos en una clase de la API', () => {
    const row: PlanRow = {
      id: 1,
      name: 'Carla',
      monthly_price: '29.90',
    };
    const plan = toPlan(row);

    expect(plan.monthlyPrice).toBe(29.9);
  });
});
