import { TrainerRow, toTrainer } from './trainer';

describe('toTrainer', () => {
  it('junta las filas de un monitor en uno con un array de especialidades', () => {
    const rows: TrainerRow[] = [
      {
        id: 1,
        name: 'Carla Navarro',
        email: 'carla@gym.com',
        photo_url: null,
        specialty: 'Ciclo indoor',
      },
      {
        id: 1,
        name: 'Carla Navarro',
        email: 'carla@gym.com',
        photo_url: null,
        specialty: 'Fuerza',
      },
    ];
    const trainer = toTrainer(rows);

    expect(trainer).toEqual({
      id: 1,
      name: 'Carla Navarro',
      email: 'carla@gym.com',
      photoUrl: null,
      specialties: ['Ciclo indoor', 'Fuerza'],
    });
  });
});
