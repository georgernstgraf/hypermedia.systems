const { prisma } = require('../lib/prisma');
const { Contact } = require('../lib/contact');
const { fakerDE } = require('@faker-js/faker');
async function main() {
    for (let i = 0; i < 108; i++) {
        await prisma.contact.create({
            data: new Contact({
                first: fakerDE.person.firstName(),
                last: fakerDE.person.lastName(),
                email: fakerDE.internet.email().toLowerCase(),
                phone: fakerDE.phone.number(),
            }),
        });
    }
}
main()
    .catch((e) => {
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
