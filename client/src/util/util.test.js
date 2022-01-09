import { getTimeElapsed } from './helpers';

describe('getTimeElapsed', () => {

    const currentDate = Date.now();
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12; 

    it('returns less than a minute ago if < 1 minutes elapsed', () => {

        const date = currentDate - (second);

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('less than a minute ago');

    })

    it('returns 1 minute ago if 1 minutes elapsed', () => {

        const date = currentDate - minute;

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('1 minute ago');

    })

    it('returns 10 minutes ago if 10 minutes elapsed', () => {

        const date = currentDate - (10 * minute);

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('10 minutes ago');

    })

    it('returns 1 hour ago if 1 hour elapsed', () => {

        const date = currentDate - hour;

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('1 hour ago');

    })

    it('returns 5 hours ago if 5 hours elapsed', () => {

        const date = currentDate - (5 * hour);

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('5 hours ago');

    })

    it('returns 1 day ago if 24 hours elapsed', () => {

        const date = currentDate - day;

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('1 day ago');

    })

    it('returns 10 days ago if 10 days elapsed', () => {

        const date = currentDate - (10 * day);

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('10 days ago');

    })

    it('returns 1 month ago if 30 days elapsed', () => {

        const date = currentDate - month;

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('1 month ago');

    })

    it('returns 5 months ago if 5 months elapsed', () => {

        const date = currentDate - (5 * month);

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('5 months ago');

    })

    it('returns 1 year ago if 12 months elapsed', () => {

        const date = currentDate - year;

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('1 year ago');

    })

    it('returns 2 years ago if 2 years elapsed', () => {

        const date = currentDate - (2 * year);

        const timeElapsed = getTimeElapsed(date, currentDate);

        expect(timeElapsed).toBe('2 years ago');

    })

})