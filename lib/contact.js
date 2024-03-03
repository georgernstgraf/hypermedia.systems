class Contact {
    constructor({ id, first, last, email, phone } = {}) {
        this.id = id;
        this.first = first;
        this.last = last;
        this.phone = phone;
        this.email = email;
        this.errors = {};
    }
}
module.exports = { Contact: Contact };
