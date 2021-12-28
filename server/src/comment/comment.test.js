const Comment = require('./comment.model');

describe('comment model', () => {

    it('should return error if no user', () => {

        const newComment = new Comment({
            user: '',
            post: '',
            content: '',
        })

        newComment.validate(err => {
            expect(err.errors.user).toBeTruthy();
        })

    })

    it('should return error if no post' , () => {

        const newComment = new Comment({
            user: '',
            post: '',
            content: '',
        })

        newComment.validate(err => {
            expect(err.errors.post).toBeTruthy();
        })

    })

    it('should return error if no content', () => {

        const newComment = new Comment({
            user: '',
            post: '',
            content: '',
        })

        newComment.validate(err => {
            expect(err.errors.content).toBeTruthy();
        })

    })

})

describe('comment controller', () => {

    it('')

})