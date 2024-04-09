document.addEventListener('DOMContentLoaded', function() {
  const svg = document.getElementById('stars');
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cursor = { x: width / 2, y: height / 2 };
  let startTime = Date.now(); // Variable to track animation start time
  const duration = 10000; // Duration in milliseconds

  function createStar() {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      const speed = size; // Speed based on size
      let opacity;

    // Determine opacity
    if (Math.random() < 0.9) {
        opacity = Math.random() * 0.3 * (1 - size / 10); // Random opacity between 0 and 0.3, adjusted by size for 80% of stars
    } else {
        opacity = Math.random() * (1 - 0.3) * (1 - size / 3) + 0.3; // Random opacity between 0.3 and 1, adjusted by size for the remaining 20% of stars
    }
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', size);
      dot.setAttribute('opacity', opacity);
      dot.classList.add('star');
      svg.appendChild(dot);
      return { element: dot, speed: speed, x: x, y: y, size: size }; // Store initial position and size
  }

  const numStars = 500;
  const stars = [];
  for (let i = 0; i < numStars; i++) {
      stars.push(createStar());
  }

  function cubicBezier(t, p0, p1, p2, p3, p4) {
    return (
      Math.pow(1 - t, 5) * p0 +
      5 * Math.pow(1 - t, 4) * t * (p1 + 0.001) +
      10 * Math.pow(1 - t, 3) * Math.pow(t, 2) * (p2 + 0.01) +
      10 * Math.pow(1 - t, 2) * Math.pow(t, 3) * (p3 - 0.3) +
      5 * (1 - t) * Math.pow(t, 4) * (p4 - 0.01) +
      Math.pow(t, 5) * p4
    );
  }

function updateScene() {
    const elapsedTime = Date.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Progress from 0 to 1
    const speedMultiplier = cubicBezier(t, 0, 1, 20, 5, 0); // Get speed multiplier using cubic Bezier function

    stars.forEach(star => {
        const cy = parseFloat(star.element.getAttribute('cy')) - (star.speed * speedMultiplier);
        if (cy < -parseFloat(star.element.getAttribute('r'))) {
            star.element.setAttribute('cx', Math.random() * width);
            star.element.setAttribute('cy', height + parseFloat(star.element.getAttribute('r')));
        } else {
            star.element.setAttribute('cy', cy);
        }

        if (Math.random() < 0.001) {
          const newOpacity = Math.random() * 0.3 * (1 - star.size / 10);
          star.element.setAttribute('opacity', newOpacity);
  
          // Change location
          if (Math.random() < 0.2) { // 50% chance of changing location
            const newX = Math.random() * width;
            const newY = Math.random() * height;
            star.element.setAttribute('cx', newX);
            star.element.setAttribute('cy', newY);
          }
        }  

        // Calculate rate of change of each star
        star.dx = star.x - star.prevX;
        star.dy = star.y - star.prevY;

        // Update previous position
        star.prevX = star.x;
        star.prevY = star.y;

        // Parallax effect including cursor movement
        const dx = cursor.x - star.x;
        const dy = cursor.y - star.y;
        const parallaxFactor = 0.05 * (star.size/5);

        // Constant upward movement proportional to star size
        const upwardMovement = -star.size * 0.1 * speedMultiplier;

        // Apply the transformation to move the star
        star.element.style.transform = `translate(${dx * parallaxFactor}px, ${dy * parallaxFactor + upwardMovement}px)`;
    });
  }

  function updateCursor(event) {
      cursor.x = event.clientX;
      cursor.y = event.clientY;
  }

  function updateSpeed(event) {
      startTime = Date.now(); // Update start time when speed changes
      // Other speed update logic
  }

  document.addEventListener('mousemove', updateCursor);
  document.getElementById('speedControl').addEventListener('input', updateSpeed);
  setInterval(updateScene, 10);
});
