tweet = () => {
    open(
        nomangle('https://twitter.com/intent/tweet?') +
        nomangle('hashtags=js13k') +
        nomangle('&url=') + location +
        nomangle('&text=') + encodeURIComponent(
            nomangle('I beat ') + document.title + nomangle(' in ') + formatTime(G.timer) + nomangle(' on ') + G.difficulty.label + ' ' + nomangle('difficulty!')
        )
    );
};
