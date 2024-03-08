const { prisma } = require('./prisma');
class Contact {
    // id wird von der Datenbank gesetzt
    // new Aufrufe
    // 1) POST contacts/new (ohne id, mit Daten)
    // 2) GET contacts/new (komplett leer)
    constructor(obj = {}, db = false) {
        Object.defineProperty(this, 'errors', {
            enumerable: false,
            writable: true,
        });
        this.update(obj, db);
    }
    // id, no checks
    update({ id, first, last, email, phone }, db = false) {
        if (db) {
            this.id = id || this.id;
        }
        this.first = first || this.first;
        this.last = last || this.last;
        this.phone = phone || this.phone;
        this.email = email || this.email;
        this.populateErrors();
    }
    isValid() {
        return Object.keys(this.errors).length === 0;
    }
    // no id, full checks
    populateErrors() {
        this.errors = {};
        if (this.first?.toLocaleLowerCase().includes('err')) {
            this.errors.first = 'First name cannot contain "err"';
        }
    }
    async save() {
        if (!this.isValid()) {
            throw new Error('Contact not valid - see errors');
        }
        if (this.id) {
            try {
                this.update(
                    await prisma.contact.update({
                        where: { id: this.id },
                        data: this,
                    }),
                    true
                );
                return;
            } catch (e) {
                throw new Error(e.message);
            }
        } else {
            this.update(await prisma.contact.create({ data: this }), true);
            return;
        }
    }
}

module.exports = { Contact: Contact };
