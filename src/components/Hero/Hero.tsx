import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Store canvas dimensions
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    // Update dimensions on resize
    const handleResize = () => {
      canvasWidth = canvas.width;
      canvasHeight = canvas.height;
    };
    window.addEventListener('resize', handleResize);

    // Particle system
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvasWidth) this.x = 0;
        if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        if (this.y < 0) this.y = canvasHeight;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw mushroom
      const time = Date.now() * 0.001;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Mushroom cap
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.ellipse(
        centerX,
        centerY - 50 + Math.sin(time) * 10,
        100,
        60,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Mushroom stem
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.rect(centerX - 20, centerY - 50, 40, 100);
      ctx.fill();

      // Glowing effect
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        200
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-b from-green-900 to-green-800 overflow-hidden min-h-screen">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 transform transition-all duration-700 hover:scale-105">
            <span className="block animate-fade-in">Discover the Hidden</span>
            <span className="block text-green-300 mt-2 animate-fade-in-delay">Kingdom of Fungi</span>
          </h1>
          <h2 className="text-2xl font-light text-green-100 leading-relaxed max-w-3xl mx-auto animate-fade-in-delay-2">
            <span className="italic">Explore the Fascinating World of Fungi</span>
          </h2>
          <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto animate-fade-in-delay-3">
            Join our community of mycologists and nature enthusiasts in documenting and preserving the diverse world of fungi.
          </p>
          <div className="mt-10 flex justify-center gap-4 animate-fade-in-delay-4">
            <a
              href="/discover"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Start Exploring
            </a>
            <a
              href="/submit"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Submit a Discovery
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;



/*import React from 'react';

const Hero: React.FC = () => {
    return (
      <section className="w-full h-48 bg-gradient-to-r from-green-800 to-green-600 flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: 'url(https://cdn.naturettl.com/wp-content/uploads/2016/09/22014332/how-to-photograph-fungi-7.jpg)'
          }}
        />
        <div className="relative z-10 text-center">
          <h2 className="text-xl font-medium text-white">
            Explore the Fascinating World of Fungi
          </h2>
        </div>
      </section>
    );
  };
  
  export default Hero; */