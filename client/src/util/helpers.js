export const getTimeElapsed = (timestamp, now) => {

    let currentDate = new Date(now);
    let date = new Date(timestamp);
    let timeElapsed = (currentDate - date) / (1000 * 60); // minutes

    if (timeElapsed < 1) {
        return 'less than a minute ago';
    }
    
    if (Math.round(timeElapsed) == 1) {
        return '1 minute ago';
    } 

    if (timeElapsed > 1 && timeElapsed < 59) {
        return `${Math.round(timeElapsed)} minutes ago`;
    }

    if (timeElapsed == 60) {
        return `1 hour ago`;
    }

    timeElapsed /= 60 // convert to hours

    if (timeElapsed < 24) {
        return `${Math.round(timeElapsed)} hours ago`;
    }

    if (Math.round(timeElapsed) == 24) {
        return `1 day ago`;
    }

    timeElapsed /= 24 // convert to days

    if (timeElapsed < 30) {
        return `${Math.round(timeElapsed)} days ago`;
    }

    if (timeElapsed == 30) {
        return '1 month ago';
    }

    timeElapsed /= 30 // convert to months

    if (timeElapsed < 12) {
        return `${Math.round(timeElapsed)} months ago`;
    }

    if (timeElapsed == 12) {
        return '1 year ago';
    }

    timeElapsed /= 12 // convert to years

    return `${Math.round(timeElapsed)} years ago`; 

}