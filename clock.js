'use strict'

class Timer {
    constructor() {
        this.set(25, 5);
    }

    set(sessionTime, breakTime) {
        this.sessionTime = sessionTime;
        this.breakTime = breakTime;
        this.state = 'session';
        this.ticks = sessionTime * 60;
        this.id = 0;
    }

    start() {
        this.id = setInterval(() => {
            if (this.ticks-- === 0) {
                switch (this.state) {
                    case 'session':
                        this.state = 'break';
                        this.ticks = this.breakTime * 60 - 1;
                        break;
                    case 'break':
                        this.start = 'session';
                        this.ticks = this.sessionTime * 60 - 1;
                        break;
                }
            }

            // update displays

            // debug
            console.clear();
            const left = formatTicks(this.ticks);
            const time = formatTicks((this.state === 'session' ? this.breakTime : this.sessionTime) * 60);

            if (this.state === 'session') {
                console.log(`session: ${left.minutes}:${left.seconds} *`);
                console.log(`break:   ${time.minutes}:${time.seconds}`);
            } else {
                console.log(`session: ${time.minutes}:${time.seconds}`);
                console.log(`break:   ${left.minutes}:${left.seconds} *`);
            }

        }, 100);
    }

    stop() {
        if (this.id !== 0) clearInterval(this.id);
    }
}

const padTime = time => String(time).length === 1 ? String(time).padStart(2, '0') : time;

const formatTicks = ticks => {
    const minutes = padTime(Math.floor(ticks / 60));
    const seconds = padTime(ticks - minutes * 60);
    return { minutes, seconds };
}

const timer = new Timer();