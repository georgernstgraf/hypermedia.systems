const { fakerDE } = require('@faker-js/faker');
const persons = [];
for (let i = 0; i < 10; i++) {
    persons.push({
        id: fakerDE.string.uuid(),
        first: fakerDE.person.firstName(),
        last: fakerDE.person.lastName(),
        phone: fakerDE.phone.number(),
        email: fakerDE.internet.email().toLowerCase(),
    });
}
console.log(JSON.stringify(persons, null, 2));
