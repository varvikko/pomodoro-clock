'use strict';

$(document).ready(() => {
    function Timing() {
        class Timer {
            constructor() {
                this.set(25, 5);
            }
        
            set(workTime, breakTime) {
                this.workTime = workTime;
                this.breakTime = breakTime;
                this.state = 'work';
                this.ticks = workTime * 60;
                this.id = 0;
                this.stopped = true;
            }
        
            start() {
                if (!this.stopped) return;
                this.stopped = false;
    
                // disable sliders
                $('.slider').addClass('disabled');
                [...$('.slider')].forEach(element => element.disabled = true);
                $('.display.break').addClass('disabled');
    
                this.id = setInterval(() => {
                    if (this.ticks-- === 0) {
                        switch (this.state) {
                            case 'work':
                                this.state = 'break';
                                this.ticks = this.breakTime * 60 - 1;

                                $('.display.work').addClass('disabled');
                                $('.display.break').removeClass('disabled');
                                break;
                            case 'break':
                                this.state = 'work';
                                this.ticks = this.workTime * 60 - 1;

                                $('.display.break').addClass('disabled');
                                $('.display.work').removeClass('disabled');
                                break;
                        }
                    }
        
                    // update displays
                    const left = formatTicks(this.ticks);
                    const time = formatTicks((this.state === 'work' ? this.breakTime : this.workTime) * 60);
                    if (this.state === 'work') {
                        $('#work-time').text(`${left.minutes}:${left.seconds}`);
                        $('#break-time').text(`${time.minutes}:${time.seconds}`);
                    } else {
                        $('#work-time').text(`${time.minutes}:${time.seconds}`);
                        $('#break-time').text(`${left.minutes}:${left.seconds}`);
                    }
        
                }, 1000);
            }
        
            stop() {
                if (this.stopped) return;
                this.stopped = true;
                clearInterval(this.id);
            }
    
            reset() {
                this.stop();
                this.set(time.workTime, time.breakTime);
                $('#work-time').text(`${padTime(time.workTime)}:00`);
                $('#break-time').text(`${padTime(time.breakTime)}:00`);
    
                $('.display.break').removeClass('disabled');
                $('.display.work').removeClass('disabled');
    
                // enable sliders
                $('.slider').removeClass('disabled');
                [...$('.slider')].forEach(element => element.disabled = false);
            }
        }
    
        
        const formatTicks = ticks => {
            const minutes = padTime(Math.floor(ticks / 60));
            const seconds = padTime(ticks - minutes * 60);
            return { minutes, seconds };
        }
    
        return new Timer();
    }
    
    const padTime = time => String(time).length === 1 ? String(time).padStart(2, '0') : time;
    
    const defaultTime = {
        workTime: 25,
        breakTime: 5,
    };
    
    const time = {
        workTime: defaultTime.workTime,
        breakTime: defaultTime.breakTime,
    };
    
    const clock = Timing();

    $('#play.button').on('click', function() {
        clock.start();
        $('.button').removeClass('active');
        this.classList.add('active');
    });
    
    $('#pause.button').on('click', function() {
        clock.stop();
        $('.button').removeClass('active');
        this.classList.add('active');
    });
    
    $('#stop.button').on('click', function() {
        clock.reset();
        $('.button').removeClass('active');
    });
    
    $('#reset.button').on('click', function() {
        time.workTime = defaultTime.workTime;
        time.breakTime = defaultTime.breakTime;
        clock.reset();
        $('.button').removeClass('active');

        // reset sliders
        $('#work-range')[0].value = time.workTime;
        $('#break-range')[0].value = time.breakTime;
    });

    $('#work-range').on('input', function() {
        time.workTime = this.value;
        clock.set(time.workTime, time.breakTime);
        $('#work-time').text(`${padTime(time.workTime)}:00`);
    });
    
    $('#break-range').on('input', function() {
        time.breakTime = this.value;
        clock.set(time.workTime, time.breakTime);
        $('#break-time').text(`${padTime(time.breakTime)}:00`);
    });
});

