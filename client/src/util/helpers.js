export const getTimeElapsed = (timestamp, now) => {

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12; 

    let currentDate = new Date(now);
    let date = new Date(timestamp);
    let timeElapsed = currentDate - date
    
    if (timeElapsed < minute) {
        return 'less than a minute ago';
    }

    if (timeElapsed >= minute && timeElapsed < hour) {
        timeElapsed = Math.round(timeElapsed / minute);
        if (timeElapsed === 1) {
            return '1 minute ago';
        }
        return `${timeElapsed} minutes ago`;
    }

    if (timeElapsed >= hour && timeElapsed < day) {
        timeElapsed = Math.round(timeElapsed / hour);
        if (timeElapsed === 1) {
            return '1 hour ago';
        }
        return `${timeElapsed} hours ago`;
    }

    if (timeElapsed >= day && timeElapsed < month) {
        timeElapsed = Math.round(timeElapsed / day);
        if (timeElapsed === 1) {
            return '1 day ago';
        }
        return `${timeElapsed} days ago`;
    }

    if (timeElapsed >= month && timeElapsed < year) {
        timeElapsed = Math.round(timeElapsed / month);
        if (timeElapsed === 1) {
            return '1 month ago';
        }
        return `${timeElapsed} months ago`;
    }

    timeElapsed = Math.round(timeElapsed / year);
    if (timeElapsed === 1) {
        return '1 year ago';
    }
    return `${timeElapsed} years ago`; 

}