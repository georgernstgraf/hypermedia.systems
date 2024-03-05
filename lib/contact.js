const { prisma } = require('./prisma');
class Contact {
    // id wird von der Datenbank gesetzt
    // new Aufrufe
    // 1) POST contacts/new (ohne id, mit Daten)
    // 2) GET contacts/new (komplett leer)
    #first;
    constructor(obj = {}) {
        Object.defineProperty(this, 'first', {
            enumerable: true,
            get: this.get_first,
            set: this.set_first,
        });
        this.update(obj);
    }
    update({ id, first, last, email, phone }) {
        this.id = id || this.id;
        this.first = first || this.first;
        this.last = last || this.last;
        this.phone = phone || this.phone;
        this.email = email || this.email;
    }

    get_first() {
        return this.#first;
    }
    set_first(value) {
        if (value && value.includes('err')) {
            throw new ContactError('There were errors in the form', {
                first: 'First name cannot contain "err"',
            });
        }
        this.#first = value;
    }
    async save() {
        if (this.id) {
            try {
                return await prisma.contact.update({
                    where: { id: this.id },
                    data: { first: this.first },
                });
            } catch (e) {
                throw new ContactError(e.message);
            }
        } else {
            return await prisma.contact.create({ data: this });
        }
    }
}
class ContactError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.details = details;
    }
}
module.exports = { Contact: Contact };
