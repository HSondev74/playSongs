

/*
*1. Render songs
*2. Scroll top
*3. Play / pause / seek
*4. CD rotate
*5. Next / Prev
*6. Random
*7. Next / Repeat when end
*8.Active song
*9. Scroll active song into view
*10 Play song when click
*/


const PLAYER_STORAGE_KEY = 'PLAYER 1'
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playList = $('.playlist')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const timeStart = $('.current-time')
let timeEnd = $('.duration-time')
const btnPrev = $('.btn-prev')
const btnNext = $('.btn-next')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
let app = {
  isPlaying: true,
  isChecking: true,
  isReapeat: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {

  },
  setConfig: function(key,value) {
      this.config[key] = value
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify( this.config))
  },
  songs: [
    {
      name: "Cupid",
      singer: 'FIFTY FIFTY',
      path: 'Cupid - FIFTY FIFTY.mp3',
      image: 'h1.jpg'
    },
    {
      name: "Hẹn Em Ở Lần Yêu Thứ 2",
      singer: 'Nguyenn, Đặng Tuấn Vũ',
      path: 'Hẹn Em Ở Lần Yêu Thứ 2 - Nguyenn, Đặng Tuấn Vũ.mp3',
      image: 'h2.jpg'
    },
    {
      name: "Waste It On Me",
      singer: 'Steve Aoki, BTS (Bangtan Boys)',
      path: 'Waste It On Me - Steve Aoki, BTS (Bangtan Boys).mp3',
      image: 'h3.jpg'
    },
    {
      name: "Savage Love (BTS)",
      singer: 'BTS (Bangtan Boys)',
      path: 'Savage Love (Laxed - Siren Beat) [bts Remix] - Jason Derulo, Jawsh 685, BTS (Bangtan Boys).mp3',
      image: 'h4.jpg'
    },
    {
      name: "My Universe",
      singer: 'Coldplay, BTS (Bangtan Boys)',
      path: 'My Universe - Coldplay, BTS (Bangtan Boys).mp3',
      image: 'h5.jpg'
    },
    {
      name: "Run BTS",
      singer: 'BTS (Bangtan Boys)',
      path: 'Run BTS - BTS (Bangtan Boys).mp3',
      image: 'h6.jpg'
    },
    {
      name: "Yet To Come",
      singer: 'BTS (Bangtan Boys)',
      path: 'Yet To Come - BTS (Bangtan Boys).mp3',
      image: 'h6.jpg'
    },
    {
      name: "Những Gì Anh Nói (Lofi Version)",
      singer: 'Bozitt',
      path: 'Những Gì Anh Nói (Lofi Version) - Bozitt, Bozitt.mp3',
      image: 'h9.jpg'
    },
    {
      name: "Anh Đã Từ Bỏ Rồi Đấy",
      singer: 'Nguyenn, Aric',
      path: 'Anh Đã Từ Bỏ Rồi Đấy - Nguyenn, Aric.mp3',
      image: 'h8.jpg'
    },
    {
      name: "Nơi Em Thuộc Về Anh",
      singer: 'Bozitt',
      path: 'Nơi Em Thuộc Về Anh - Bozitt.mp3',
      image: 'h10.jpg'
    },
  ],
  renderSong: function() {
    let htmls= this.songs.map((song,index) => {
          return `<div class="song ${index === this.currentIndex ? 'active' : " " }" data-index="${index}">
                          <div class="thumb"
                              style="background-image: url('${song.image}')">
                          </div>
                          <div class="body">
                              <h3 class="title">${song.name}</h3>
                              <p class="author">${song.singer}</p>
                          </div>
                          <div class="option">
                              <i class="fas fa-ellipsis-h"></i>
                          </div>
                      </div>
                      `;
    })
      playList.innerHTML = htmls.join('\n');
  },
  getdefineProperty: function() {
    Object.defineProperty(this, 'currentSong',{
      get: function() {
        return this.songs[this.currentIndex]
      }
    }  )
  },
  loadCurrentSong: function() {
        const heading = $('header h2')
        const audio = $('#audio')
           heading.textContent = this.currentSong.name
           audio.src = this.currentSong.path
           cdThumb.style.backgroundImage = `url(${ this.currentSong.image})`
  },
  handleEvents: function() {
    const _this = this
    document.onscroll = function() {
        const cdWidth = cd.offsetWidth
        const CdWidthScoll =  window.scrollY || document.documentElement.scrollTop
        const newcdWidth = cdWidth - CdWidthScoll
        cdThumb.style.width =newcdWidth > 0 ? newcdWidth.toFixed(2) + 'px' : 0;
        cdThumb.style.opacity = newcdWidth.toFixed(2) / cdWidth
    }
    playBtn.onclick = function () {
      if(_this.isPlaying){
        _this.isPlaying = false
      audio.play()
      animated.play()
      player.classList.add('playing')
      updateDuration()
      }else{
        _this.isPlaying = true
        animated.pause()
        audio.pause()
        player.classList.remove('playing')
      }
    }

    audio.ontimeupdate = function() {
      if(audio.duration) {
        const progressBar = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressBar
      }

      // updateDuration()

      const timer = audio.currentTime
      const minutes = Math.floor(timer / 60)
      const seconds = Math.floor(timer % 60)
      timeStart.innerHTML = minutes + ':' + ( seconds < 10 ? '0' : ' ') + seconds;
    }

    progress.onchange = function(e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }
    audio.onloadedmetadata = function() {
        const time = audio.duration
        let newTime = (time/60).toFixed(2)
        timeEnd.textContent = newTime
      }
      const animated = cdThumb.animate([{transform: 'rotate(360deg)'}],{
        duration: 10000,
        iterations: Infinity,
      })
      animated.pause()
      btnNext.onclick = function() {
        if(!_this.isChecking) {
          _this.nextSong()
        }else{
          _this.randomSong()
        }
        audio.play()
        _this.renderSong()
        _this.scrollToActiveSong()
      }

      btnPrev.onclick = function() {
        if(_this.isChecking) {
          _this.randomSong()
        }else{
          _this.prevSong()
        }
        audio.play()
        _this.renderSong()
        animated.pause()
        _this.scrollToActiveSong()
      }

      btnRandom.onclick = function() {
         
            _this.isChecking = !_this.isChecking
            btnRandom.classList.toggle('active',_this.isChecking)
            _this.setConfig('isChecking', _this.isChecking)
      }

      btnRepeat.onclick = function() {
        _this.isReapeat = !_this.isReapeat
        btnRepeat.classList.toggle('active',_this.isReapeat)
        _this.setConfig('isChecking', _this.isChecking)
      }

      audio.onended = function() {
       if(_this.isReapeat) {
          audio.play()
       }else{
        btnNext.click()
       }
      }
      playList.onclick = function(e) {
       const songNode = e.target.closest(".song:not(.active)");
      
         if(songNode || e.target.closest('.option')) {
           // xử lý khi click vào bài hát
                   if(songNode){
                       _this.currentIndex = Number( songNode.dataset.index)
                       _this.loadCurrentSong()
                       audio.play()
                       _this.renderSong()
                       
                   }
           // xử lý khi click vào options
                   if(e.target.closest('.option')){

                   }
             }
         }
      function updateDuration() {
        const interval = setInterval(() => {
          let Duration = audio.duration
          timeEnd.innerHTML = formatTime(Duration)
          Duration -= 1
          if(Duration <  0) {
            clearInterval(interval)
          }
        }, 1000);
      }

      function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        return minutes + ':' + (remainingSeconds < 10 ? '0' : ' ') + remainingSeconds
      }
  },
  scrollToActiveSong: function() {
    setTimeout( () => {
      $('.song.active').scrollIntoView({
        behavior: "smooth",
        block: 'center'
      })
    },300)
  },
  loadConfig: function() {
    this.isChecking = this.config.isChecking
    this.isReapeat = this.config.isReapeat
  },
  randomSong: function() {
 let newIndex
 do{
  newIndex = Math.floor(Math.random() * this.songs.length)
 }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex
  this.loadCurrentSong()
  },
  nextSong: function() {
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0;
    }
    this.loadCurrentSong()
  },
  prevSong: function() {
    this.currentIndex--
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong()
  },
  start: function() {
    this.loadConfig()
    this.renderSong()
    this.handleEvents();
    this.getdefineProperty()
    this.loadCurrentSong()
    //hiển thị khi F5
    btnRandom.classList.toggle('active',this.isChecking)
    btnRepeat.classList.toggle('active',this.isReapeat)
  }
}
app.start()
