const assert = require('chai').assert;
const expect = require('chai').expect;
const User = require('./user.model');

describe('user model', () => {
    
    it('should be invalid if first name is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.firstName).to.exist;
        })
    }),

    it('should be invalid if last name is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.lastName).to.exist;
        })
    }),

    it('should be invalid if email is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.email).to.exist;
        })
    }),

    it('virtual fullname method should return first name and last name', () => {
        let newUser = new User({
            firstName: 'John',
            lastName: 'Smith',
            email: 'johnsmith@email.com'
        })

        assert.equal(newUser.fullName, `${newUser.firstName} ${newUser.lastName}`);
    })

})

