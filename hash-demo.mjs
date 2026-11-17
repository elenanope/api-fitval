import argon2 from 'argon2';

const hash1 = await argon2.hash('patata123');
const hash2 = await argon2.hash('patata123');

console.log(hash1);
console.log(hash2);
console.log('¿Iguales?', hash1 === hash2);

console.log('patata123 →', await argon2.verify(hash1, 'patata123'));
console.log('patata124 →', await argon2.verify(hash1, 'patata124'));