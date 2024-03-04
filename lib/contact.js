const { v4: uuidv4 } = require('uuid');
class Contact {
    #first;
    constructor(obj = {}) {
        this.id = obj.id || uuidv4();
        this.update(obj);
    }
    update({ first, last, email, phone }) {
        this.first = first || this.first;
        this.last = last || this.last;
        this.phone = phone || this.phone;
        this.email = email || this.email;
    }
    get first() {
        return this.#first;
    }
    set first(value) {
        if (value && value.includes('err')) {
            throw new ContactError('There were errors in the form', {
                first: 'First name cannot contain "err"',
            });
            throw e;
        }
        this.#first = value;
    }
    addSelf(contacts) {
        contacts.push(this);
    }
}
class ContactError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.details = details;
    }
}
module.exports = { Contact: Contact };
