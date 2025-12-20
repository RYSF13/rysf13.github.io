document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const initScreen = document.getElementById('init-screen');
    const bootTerminal = document.getElementById('boot-terminal');
    const bootProgress = document.getElementById('boot-progress');
    const initBtn = document.getElementById('btn-initialize');
    const mainInterface = document.getElementById('main-interface');
    const bgAudio = document.getElementById('bg-audio');
    const audioToggleBtn = document.getElementById('btn-audio-toggle');
    const oscilloscopeCanvas = document.getElementById('oscilloscope');
    
    // === Variables ===
    let audioCtx, analyser, dataArray, source, lowPassFilter;
    let isAudioPlaying = false;
    let animationId;
    
    // === Boot Sequence Logic ===
    const bootLogs = [
        "SYS_POWER: ON",
        "BIOS_CHECK... OK",
        "LOADING_KERNEL... [###.......]",
        "MOUNTING_VOLUMES... /ROOT",
        "LOADING_DRIVERS: AUDIO_CORE_V2",
        "LOADING_DRIVERS: GFX_RENDER_ENG",
        "MEMORY_TEST: 64TB OK",
        "ESTABLISHING_UPLINK... SUCCESS",
        "DECRYPTING_USER_PROFILE...",
        "INITIALIZING_UI_COMPONENTS...",
        "CALIBRATING_OSCILLOSCOPE...",
        "SYS_READY."
    ];

    let logIndex = 0;
    
    function typeLog() {
        if (logIndex < bootLogs.length) {
            const line = document.createElement('span');
            line.className = 'terminal-line';
            line.textContent = `> ${bootLogs[logIndex]}`;
            bootTerminal.appendChild(line);
            bootTerminal.scrollTop = bootTerminal.scrollHeight;
            
            // Update Progress
            const progress = ((logIndex + 1) / bootLogs.length) * 100;
            bootProgress.style.width = `${progress}%`;

            logIndex++;
            // Random delay for realism
            setTimeout(typeLog, Math.random() * 300 + 100);
        } else {
            // Finished
            setTimeout(() => {
                initBtn.classList.remove('hidden');
                document.getElementById('sys-check-status').textContent = "COMPLETE";
                document.getElementById('sys-check-status').style.color = "var(--primary)";
            }, 500);
        }
    }

    // Start Boot Sequence
    setTimeout(typeLog, 500);

    // === Initialization Button Click ===
    initBtn.addEventListener('click', () => {
        initScreen.style.opacity = '0';
        setTimeout(() => {
            initScreen.classList.add('hidden');
            mainInterface.classList.remove('hidden');
            
            // Start Systems
            setupAudio();
            startSidebarUpdates();
            setupScrollObserver();
            
            // Play Audio
            toggleAudio(true);
        }, 500);
    });

    // === Audio & Oscilloscope Logic ===
    function setupAudio() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        
        // Create nodes
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        
        // Low Pass Filter for retro sound
        lowPassFilter = audioCtx.createBiquadFilter();
        lowPassFilter.type = "lowpass";
        lowPassFilter.frequency.value = 1000; // Muffled sound
        
        source = audioCtx.createMediaElementSource(bgAudio);
        
        // Connect: Source -> Filter -> Analyser -> Destination
        source.connect(lowPassFilter);
        lowPassFilter.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        // Setup Resize Observer for Canvas
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        resizeObserver.observe(oscilloscopeCanvas.parentElement);
        resizeCanvas(); // Initial size
        
        drawOscilloscope();
    }

    function resizeCanvas() {
        const parent = oscilloscopeCanvas.parentElement;
        oscilloscopeCanvas.width = parent.clientWidth;
        oscilloscopeCanvas.height = parent.clientHeight - 15; // Subtract header
    }

    function toggleAudio(shouldPlay) {
        if (shouldPlay) {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            bgAudio.play();
            isAudioPlaying = true;
            audioToggleBtn.textContent = "AUDIO: ON";
            audioToggleBtn.style.color = "var(--bg-color)";
            audioToggleBtn.style.background = "var(--primary)";
        } else {
            bgAudio.pause();
            isAudioPlaying = false;
            audioToggleBtn.textContent = "AUDIO: OFF";
            audioToggleBtn.style.color = "var(--primary)";
            audioToggleBtn.style.background = "transparent";
        }
    }

    audioToggleBtn.addEventListener('click', () => {
        toggleAudio(!isAudioPlaying);
    });

    function drawOscilloscope() {
        requestAnimationFrame(drawOscilloscope);

        const ctx = oscilloscopeCanvas.getContext('2d');
        const width = oscilloscopeCanvas.width;
        const height = oscilloscopeCanvas.height;

        ctx.fillStyle = "#000"; // Clear
        ctx.fillRect(0, 0, width, height);

        // Draw Grid
        ctx.strokeStyle = '#111';
        ctx.beginPath();
        for(let i=0; i<width; i+=20) { ctx.moveTo(i,0); ctx.lineTo(i,height); }
        for(let i=0; i<height; i+=20) { ctx.moveTo(0,i); ctx.lineTo(width,i); }
        ctx.stroke();

        if (isAudioPlaying) {
            analyser.getByteTimeDomainData(dataArray);
        } else {
            // Flatline with slight noise
            for(let i=0; i<dataArray.length; i++) dataArray[i] = 128 + (Math.random() * 2 - 1); 
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ff00'; // Fluorescent Green
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00ff00';
        
        ctx.beginPath();
        const sliceWidth = width * 1.0 / analyser.frequencyBinCount;
        let x = 0;

        for (let i = 0; i < analyser.frequencyBinCount; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * height / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset
    }

    // === Sidebar Stats Logic ===
    function startSidebarUpdates() {
        // Time
        setInterval(() => {
            const now = new Date();
            document.getElementById('sys-time').textContent = now.toLocaleTimeString('en-US', {hour12: false});
        }, 1000);

        // FPS Mockup (variable)
        let lastLoop = new Date();
        function fpsLoop() { 
            let thisLoop = new Date();
            let fps = 1000 / (thisLoop - lastLoop);
            lastLoop = thisLoop;
            if (Math.random() > 0.8) { // Only update sometimes to be readable
                document.getElementById('sys-fps').textContent = Math.floor(fps);
            }
            requestAnimationFrame(fpsLoop);
        }
        fpsLoop();

        // CPU & Mem Mockup
        setInterval(() => {
            document.getElementById('cpu-temp').textContent = Math.floor(40 + Math.random() * 20);
            const mem = Math.floor(30 + Math.random() * 40);
            document.getElementById('mem').textContent = `${mem}%`;
        }, 2000);
    }

    // === Scroll Animations (Fade In) ===
    function setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.fade-in-section').forEach(section => {
            observer.observe(section);
        });
    }
});

// earth
window.dOcument={body:document.querySelector("#earth")}

eval(z='p="<"+"pre>"/*     *#########* */;for(y in n="zw24l6k\
4e3t4jnt4qj24xh2 x/*  ################*  */42kty24wrt413n243n\
9h243pdxt41csb yz/*#####################* */43iyb6k43pk7243nm\
r24".split(4)){/*  #################*       */for(a in t=pars\
eInt(n[y],36)+/*     ################*       */(e=x=r=[]))for\
(r=!r,i=0;t[a/*         *#############      * */]>i;i+=.05)wi\
th(Math)x-= /*          *#############*      * */.05,0>cos(o=\
new Date/1e3/*          *########*           * */+x/PI)&&(e[~\
~(32*sin(o)*/*               ####*           # */sin(.5+y/7))\
+60] =-~ r);/*                   *####      *# */for(x=0;122>\
x;)p+="   *#"/*                  *#######*  * */[e[x++]+e[x++\
]]||(S=("eval"/*                 ##########  */+"(z=\'"+z.spl\
it(B = "\\\\")./*  ###           ######*    */join(B+B).split\
(Q="\'").join(B+Q/*             *#####*   */)+Q+")//RY3")[x/2\
+61*y-1]).fontcolor/*           ###      */(/\\w/.test(S)&&"#\
03B");dOcument.body.innerHTML=p+=B+"\\n"}setTimeout(z)')//RY3\