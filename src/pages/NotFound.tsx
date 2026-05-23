import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Matrix Rain Effect (Blue instead of Green)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "01ITREDUCATIONCYBERSECURITY";
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0000F4"; // Primary blue
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-foreground bg-background-dark">
      {/* Matrix Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>

      {/* Content */}
      <motion.div
        className="text-center z-10 bg-background-darker/70 p-8 rounded-2xl shadow-[var(--shadow-large)]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Glitch 404 */}
        <h1
          className="text-8xl font-arabic-bold mb-4 text-primary-light drop-shadow-lg relative glitch"
          data-text="404"
        >
          404
        </h1>

        <motion.p
          className="text-xl text-primary-light mb-6 tracking-wider font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          🚫 Access Denied: Page not found
        </motion.p>

        <motion.p
          className="text-sm text-muted-foreground mb-8 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          [ Error Code: 404-ITR | Path: {location.pathname} ]
        </motion.p>

        <div className="flex justify-center gap-4">
          <motion.button
            className="btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}

          >
            ⬅ Back
          </motion.button>

          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
          >
            🏠 Home
          </motion.button>
        </div>
      </motion.div>

      {/* Glitch CSS */}
      <style>{`
        .glitch {
          position: relative;
          color: hsl(var(--primary));
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

export default NotFound;
