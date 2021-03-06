JS.imports([
    '$jsui'
]).then(() => {
    let kb1 = new Keys(), isON = true, on = () => {
        isON = true;
        kb1.onKeyDown('a , d , enter', function (e, kb) {
            $1('#info').innerHTML += `<div>You press A,D,ENTER</div>`;
            return false;
        });
        kb1.onKeyDown('left , a + d', function (e, kb) {
            $1('#info').innerHTML += `<div>You press LEFT,A+D</div>`;
            return false;
        });
        $1('#info').innerHTML += `<div>You set ON!</div>`;
    }, off = () => {
        isON = false;
        kb1.off();
        $1('#info').innerHTML += `<div>You set OFF!</div>`;
    };
    kb1.seqInterval(2000);
    $1('#switch').on('click', (ev) => {
        isON ? off() : on();
    });
    on();
});
