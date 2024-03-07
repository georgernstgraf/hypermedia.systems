const { prisma } = require('./prisma');
class Contact {
    // id wird von der Datenbank gesetzt
    // new Aufrufe
    // 1) POST contacts/new (ohne id, mit Daten)
    // 2) GET contacts/new (komplett leer)
    constructor(obj = {}, db = false) {
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
        if (first && first.toLocaleLowerCase().includes('err')) {
            errors.first = 'First name cannot contain "err"';
        }
    }
    async save() {
        if (this.id) {
            try {
                const _upd = await prisma.contact.update({
                    where: { id: this.id },
                    data: this,
                });
                return _upd;
            } catch (e) {
                throw new ContactError(e.message);
            }
        } else {
            const _cr = await prisma.contact.create({ data: this });
            return _cr;
        }
    }
}

module.exports = { Contact: Contact };
