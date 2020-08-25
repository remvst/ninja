tweet = message => {
    open(
        nomangle('https://twitter.com/intent/tweet?') +
        nomangle('hashtags=js13k') +
        nomangle('&url=') + location +
        nomangle('&text=') + encodeURIComponent(message)
    );
};
