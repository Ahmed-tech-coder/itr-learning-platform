import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Loading = () => {
  const canvasRef = useRef(null);

  // Matrix Rain Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "ITRLOADING...";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0000F4"; // ITR Primary Blue
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen w-full overflow-hidden bg-background-dark text-foreground">
      {/* Matrix Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>

      {/* Center Content */}
      <motion.div
        className="z-10 text-center bg-background-darker/70 p-10 rounded-2xl shadow-[var(--shadow-large)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Glitch Loading Text */}
        <h1
          className="text-6xl font-arabic-bold text-primary-light mb-4 glitch"
          data-text="LOADING..."
        >
          LOADING...
        </h1>

        <motion.p
          className="text-sm font-mono text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Please wait while ITR is preparing your content 🚀
        </motion.p>
      </motion.div>

      {/* Glitch CSS */}
      <style>{`
        .glitch {
          position: relative;
          font-weight: bold;
          animation: glitch 1s infinite;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          width: 100%;
          overflow: hidden;
          clip: rect(0, 900px, 0, 0);
        }
        .glitch::before {
          animation: glitchTop 1s infinite linear alternate-reverse;
          color: hsl(var(--primary-light));
        }
        .glitch::after {
          animation: glitchBottom 1s infinite linear alternate-reverse;
          color: #A4B1FF;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 #0000F4, -2px 0 #A4B1FF; }
          20% { text-shadow: -2px -2px #A4B1FF, 2px 2px #0000F4; }
          40% { text-shadow: 2px -2px #0000F4, -2px 2px #A4B1FF; }
          60% { text-shadow: 0px 0px hsl(var(--primary)); }
          100% { text-shadow: 2px 0 #0000F4, -2px 0 #A4B1FF; }
        }
        @keyframes glitchTop {
          0% { clip: rect(0, 9999px, 0, 0); transform: translate(0); }
          50% { clip: rect(0, 9999px, 100%, 0); transform: translate(-5px, -3px); }
          100% { clip: rect(0, 9999px, 0, 0); transform: translate(0); }
        }
        @keyframes glitchBottom {
          0% { clip: rect(100%, 9999px, 100%, 0); transform: translate(0); }
          50% { clip: rect(0, 9999px, 100%, 0); transform: translate(5px, 3px); }
          100% { clip: rect(100%, 9999px, 100%, 0); transform: translate(0); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
