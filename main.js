// 1.Render Song
// 2.Scroll Top
// 3.Play/ Pause/ Seek
// 4.CD rotate
// 5.Next/Prev Song 
// 6.Random
// 7.Next/ Repeat when ended
// 8.Active Song
// 9.Scroll active song into view
// 10.Play song when click


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdImg = $('.cd-img');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const app = {
    currentIndex: 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) ||{},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    songs: [
        {
            name: 'At my worst',
            singer: 'Pink Sweat$',
            path: './assign/sings/AtMyWorst-PinkSweat-6704978.mp3',
            image: './assign/img/at my worst.jpeg'
        },

        {
            name: 'Beautiful in white',
            singer: 'Shane Filan',
            path: './assign/sings/BeautifulInWhite-ShaneFilan-524801.mp3',
            image: './assign/img/beautiful.jpeg'
        },

        {
            name: 'Havana',
            singer: 'Camila Cabello',
            path: './assign/sings/Havana-CamilaCabelloYoungThug-5817730.mp3',
            image: './assign/img/havan.jpeg'
        },

        {
            name: 'Monsters',
            singer: 'Katie Sky',
            path: './assign/sings/Monsters-KatieSky-3522517.mp3',
            image: './assign/img/monsters.jpeg'
        },

        {
            name: 'Perfect',
            singer: 'Ed Sheeran',
            path: './assign/sings/Perfect-EdSheeran-6445593.mp3',
            image: './assign/img/perfect.jpeg'
        },

        {
            name: 'Senorita',
            singer: 'Camila Cabello, Shawn Mendes',
            path: './assign/sings/Seorita-ShawnMendesCamilaCabello-6007813.mp3',
            image: './assign/img/senorita.jpeg'
        },

        {
            name: 'Shape of you',
            singer: 'Ed Sheeran',
            path: './assign/sings/ShapeOfYou-EdSheeran-6443488.mp3',
            image: './assign/img/shape.jpeg'
        },

        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assign/sings/Vicetone - Nevada (ft. Cozi Zuehlsdorff).mp3',
            image: './assign/img/nevada.jpeg'
        },
        
         {
            name: 'Không Bằng',
            singer: 'Na',
            path: './assign/sings/Vicetone - Nevada (ft. Cozi Zuehlsdorff).mp3',
            image: './assign/img/nevada.jpeg'
        }
    ],
    render: function(){
        htmls = this.songs.map((song, index) => {
            return `
            <div data-index = "${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb" style="background-image: url('${song.image}');"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="auther">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>    
            </div>  
            `
        })

        playList.innerHTML = htmls.join('');
    },

    

    handleEvents: function(){
        const _this = this;

        // xu li dia quay
        const cdImgAnimate = cdImg.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdImgAnimate.pause();

        // xu li khi truot con chuot
        const cdWidth = cd.offsetWidth;
        document.onscroll= function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            $('.cd').style.opacity = (newCdWidth/cdWidth);
            $('.cd').style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        }

        // xu li khi click play
        playBtn.onclick = function(){
            if (_this.isPlaying){
                audio.pause();
            }
            else {
                audio.play();
            }
        };
        // khi bai hat duoc bat(an vao nut play)
        // Bai hat dang bi pause
        // khi an vao bai hat se play
        audio.onplay = function(){
            cdImgAnimate.play();
            _this.isPlaying = true;
            player.classList.add('playing');

        };

        // khi bai hat bi dung lai (an vao nut pause)
        // bai hat dang duoc play
        // khi an vao bai hat se play
        audio.onpause = function(){
            cdImgAnimate.pause();
            _this.isPlaying = false;
            player.classList.remove('playing');
        };

        // tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration) {
                const progressPresent = Math.floor(audio.currentTime*100/audio.duration);
                progress.value = progressPresent;
            }
        };

        // xu li khi tua bai hat
        progress.onchange = function(e){
            const seekTime= e.target.value/100*audio.duration;
            audio.currentTime = seekTime;
        };

        // Khi an vao nut next song
        nextBtn.onclick = function(){
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollActiveSong();
        };
        // Khi an vao nut Prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollActiveSong();

        };

        // Khi an vao nut chon random
        randomBtn.onclick = function(){
            _this.setConfig('isRandom', _this.isRandom);
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        // khi an vao nut repeat
        repeatBtn.onclick = function(){
            _this.setConfig('isRepeat', _this.isRepeat);
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        // Xu ly next Song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.onclick();
            }
        }

        // lang nghe khi click vao playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if( songNode|| e.target.closest('.option')){
                // xu li khi click vao bai hat
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // xu li khi click vao option
                // .......
            }
        }
        
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    // xu li tai du lieu bai hat len giao dien(UI)
    loadCurrentSong: function (){
        heading.textContent = this.currentSong.name;
        cdImg.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    // xu li day active len giao dien nhin thay
    scrollActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: "smooth", 
                block: "center" , 
                inline: "nearest"
                //  ????
            });
        },200)
    },

    // next Song
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // Prev Song
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    // process song random
    // ? tao ra 1 meo de khong bi lap lai bai truoc do da phat?
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
        this.loadConfig();
        // render List Songs
        this.render();
        // dinh nghia ra cac thuoc tinh cho Object
        this.defineProperties();
        // lang nghe cac DOM events
        this.handleEvents();
        // tai thong tin bai hat hien tai len UI (giao dien nguoi dung)
        this.loadCurrentSong();

        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
}

app.start();
