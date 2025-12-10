/*
 *	    ______  _______ ______________
 *	   / __ \ \/ / ___// ____<  /__  /
 *	  / /_/ /\  /\__ \/ /_   / / /_ < 
 *	 / _, _/ / /___/ / __/  / /___/ / 
 *	/_/ |_| /_//____/_/    /_//____/  
 *                                
 */

document.addEventListener('DOMContentLoaded', () => {
	const initBtn = document.getElementById('init-btn');
	const introScreen = document.getElementById('intro-screen');
	const mainInterface = document.getElementById('main-interface');
	const terminalOutput = document.getElementById('terminal-output');
	
	// Global audio context vars
	let audioCtx;
	let analyser;
	let dataArray;
	let audioSource;
	let bgmStatus;

	// Initialize button click event
	initBtn.addEventListener('click', () => {
		// Setup audio system
		setupAudioSystem();
		// Interface switching animation
		introScreen.style.opacity = '0';
		setTimeout(() => {
			introScreen.style.display = 'none';
			mainInterface.style.display = 'flex';
			
			// Start the typewrite effect
			typeWriterLog([
				"BOOT SEQUENCE INITIATED...",
				"LOADING PROGRAM DATAS... OK",
				"MOUNTING AUDIO DRIVERS... OK",
				"SYSTEM INITIATED SUCCESSFULLY."
			]);
			
			// Render oscilloscope
			drawOscilloscope();
		}, 500);
	});

	// ----- audio system -----
	function setupAudioSystem() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		audioCtx = new AudioContext();

		// --- Play background music (bg.mp3) ---
		window.bgMusicElement = new Audio('assets/bg.mp3');
		bgMusicElement.loop = true;
		bgMusicElement.crossOrigin = "anonymous"; // Dealing with cross-domain problems

		// Create analyzer node (for oscilloscope)
		analyser = audioCtx.createAnalyser();
		analyser.fftSize = 2048; // The size of the sampling window
		const bufferLength = analyser.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);

		// Create media source node
		try {
			audioSource = audioCtx.createMediaElementSource(bgMusicElement);

			audioSource.connect(analyser);
			analyser.connect(audioCtx.destination);
			
			bgMusicElement.play().catch(e => console.error("Audio Play Error:", e));
		} catch (err) {
			console.error("CORS Error: Please use the local server to run to enable the oscilloscope.", err);
			bgMusicElement.play();
		}
		
	}
	// ----- Real waveform oscilloscope rendering -----
	function drawOscilloscope() {
		const canvas = document.getElementById('oscilloscope');
		if (!canvas) return;
		
		const ctx = canvas.getContext('2d');
		
		// Adapt the width of the container
		if (canvas.width !== canvas.parentElement.clientWidth) {
			canvas.width = canvas.parentElement.clientWidth;
			canvas.height = 80;
		}

		const width = canvas.width;
		const height = canvas.height;

		// Rendering loop
		function render() {
			requestAnimationFrame(render);

			// Get byte time time domain data
			if (analyser) {
				analyser.getByteTimeDomainData(dataArray);
			} else {
				// If the audio is not initialized, fill in the silent data.
				if (!dataArray) return;
				dataArray.fill(128); 
			}

			// Clear the canvas (with a slight drag effect to increase the afterglow of CRT fluorescence)
			ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; 
			ctx.fillRect(0, 0, width, height);

			// Draw waveform
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#03e303'; // Fluorescent green
			ctx.beginPath();

			const sliceWidth = width * 1.0 / dataArray.length;
			let x = 0;

			for (let i = 0; i < dataArray.length; i++) {
				const v = dataArray[i] / 128.0; // 128 is the reference line of silence
				const y = v * height / 2;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			ctx.lineTo(canvas.width, canvas.height / 2);
			ctx.stroke();

			// Draw grid lines (decoration)
			ctx.strokeStyle = 'rgba(0, 163, 163, 0.1)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0, height / 2);
			ctx.lineTo(width, height / 2);
			ctx.stroke();
		}

		render();
	}

	// ----- Terminal typing effect -----
	function typeWriterLog(messages, index = 0) {
		if (index >= messages.length) return;
		const line = document.createElement('div');
		line.style.marginBottom = '4px';
		terminalOutput.appendChild(line);
		let charIndex = 0;
		const msg = messages[index];
		function typeChar() {
			if (charIndex < msg.length) {
				line.textContent += msg.charAt(charIndex);
				charIndex++;
				setTimeout(typeChar, 1);
			} else {
				setTimeout(() => typeWriterLog(messages, index + 1), 200);
			}
			const terminalWindow = document.querySelector('.terminal-window');
			terminalWindow.scrollTop = terminalWindow.scrollHeight;
		}
		typeChar();
	}
	
	// ----- Calculate FPS -----
	
	let lastTime = performance.now();
	// Variable to count the number of frames
	let frameCount = 0;
	
	function calculateFps() {
		// Get the current timestamp
		const now = performance.now();
	
		frameCount++;
		// Calculate the time difference
		const delta = now - lastTime;
	
		// Check if at least 1 second (1000 milliseconds) has passed
		if (delta >= 1000) {
			// Calculate the FPS
			const fps = Math.round((frameCount * 1000) / delta);
		
			// Get the HTML element
			const fpsElement = document.getElementById('fps');
		
			// Update the element text if it exists
			if (fpsElement) {
				fpsElement.innerText = fps;
			}
			// Reset the frame count and update the last time
			frameCount = 0;
			lastTime = now;
		}
	 
		setTimeout(calculateFps);
	}

	// Start the loop
	calculateFps();
	
	// ----- Time -----
	function getTime() {
		const now = new Date();
		
		// Configure options for time format
		const options = {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		};

		const formatter = new Intl.DateTimeFormat('en-US', options);
		const timeElement = document.getElementById('time');
		timeElement.innerText = formatter.format(now);
		
		setTimeout(getTime);
	}

	getTime();
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