// Neural Network Animation - Replace the particle animation section

// Neural Network System
class Neuron {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 6;
        this.alpha = 0;
        this.targetAlpha = 0;
        this.connections = [];
    }
    
    draw() {
        if (this.alpha < 0.01) return;
        
        const accentRgb = '142, 68, 173'; // Purple for neurons
        
        // Outer glow
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        const gradient = particleCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        gradient.addColorStop(0, `rgba(${accentRgb}, ${this.alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(${accentRgb}, 0)`);
        particleCtx.fillStyle = gradient;
        particleCtx.fill();
        
        // Neuron body
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        particleCtx.fillStyle = `rgba(${accentRgb}, ${this.alpha})`;
        particleCtx.fill();
        particleCtx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.8})`;
        particleCtx.lineWidth = 2;
        particleCtx.stroke();
    }
    
    update() {
        // Check distance to mouse
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            this.targetAlpha = Math.max(0, 1 - (distance / mouse.radius));
        } else {
            this.targetAlpha = 0;
        }
        
        this.alpha += (this.targetAlpha - this.alpha) * 0.1;
        this.draw();
    }
}

class NervePulse {
    constructor(startNeuron, endNeuron) {
        this.start = startNeuron;
        this.end = endNeuron;
        this.progress = 0;
        this.speed = 0.02 + Math.random() * 0.03;
        this.size = 4;
        this.alpha = 1;
    }
    
    draw() {
        if (this.progress > 1) return;
        
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;
        
        const accentRgb = '230, 126, 34'; // Orange for electrical pulses
        
        // Pulse glow trail
        const trailLength = 0.15;
        for (let i = 0; i < 5; i++) {
            const trailProgress = Math.max(0, this.progress - (i * trailLength / 5));
            const trailX = this.start.x + (this.end.x - this.start.x) * trailProgress;
            const trailY = this.start.y + (this.end.y - this.start.y) * trailProgress;
            const trailAlpha = this.alpha * (1 - i / 5);
            
            particleCtx.beginPath();
            particleCtx.arc(trailX, trailY, this.size * (1 - i / 5), 0, Math.PI * 2);
            particleCtx.fillStyle = `rgba(${accentRgb}, ${trailAlpha * 0.3})`;
            particleCtx.fill();
        }
        
        // Main pulse
        particleCtx.beginPath();
        particleCtx.arc(x, y, this.size, 0, Math.PI * 2);
        const gradient = particleCtx.createRadialGradient(x, y, 0, x, y, this.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
        gradient.addColorStop(0.5, `rgba(${accentRgb}, ${this.alpha})`);
        gradient.addColorStop(1, `rgba(${accentRgb}, 0)`);
        particleCtx.fillStyle = gradient;
        particleCtx.fill();
    }
    
    update() {
        this.progress += this.speed;
        
        // Speed up near mouse
        if (mouse.x != null && mouse.y != null) {
            const x = this.start.x + (this.end.x - this.start.x) * this.progress;
            const y = this.start.y + (this.end.y - this.start.y) * this.progress;
            let dx = mouse.x - x;
            let dy = mouse.y - y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                this.speed = 0.05;
            }
        }
        
        this.draw();
        return this.progress <= 1;
    }
}

let neurons = [];
let activePulses = [];
let pulseTimer = 0;

// Replace initGrid function
function initNeuralNetwork() {
    neurons = [];
    activePulses = [];
    
    const cols = 8;
    const rows = 5;
    const marginX = 100;
    const marginY = 80;
    const spacingX = (particleCanvas.width - marginX * 2) / (cols - 1);
    const spacingY = (particleCanvas.height - marginY * 2) / (rows - 1);
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = marginX + col * spacingX + (Math.random() - 0.5) * 30;
            const y = marginY + row * spacingY + (Math.random() - 0.5) * 30;
            neurons.push(new Neuron(x, y));
        }
    }
    
    neurons.forEach((neuron, i) => {
        neurons.forEach((other, j) => {
            if (i !== j) {
                const dx = other.x - neuron.x;
                const dy = other.y - neuron.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200 && neuron.connections.length < 4) {
                    neuron.connections.push(other);
                }
            }
        });
    });
}

// Replace animateGrid function
function animateNeuralNetwork() {
    animationFrameId = requestAnimationFrame(animateNeuralNetwork);
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    const rgb = hexToRgb(primaryColor);
    
    // Draw nerve pathways (connections)
    neurons.forEach(neuron => {
        if (neuron.alpha > 0.1) {
            neuron.connections.forEach(connected => {
                if (connected.alpha > 0.1) {
                    const avgAlpha = (neuron.alpha + connected.alpha) / 2;
                    
                    particleCtx.beginPath();
                    particleCtx.moveTo(neuron.x, neuron.y);
                    particleCtx.lineTo(connected.x, connected.y);
                    particleCtx.strokeStyle = `rgba(${rgb}, ${avgAlpha * 0.4})`;
                    particleCtx.lineWidth = 2;
                    particleCtx.stroke();
                    
                    // Synaptic glow at connection points
                    particleCtx.beginPath();
                    particleCtx.arc(connected.x, connected.y, 3, 0, Math.PI * 2);
                    particleCtx.fillStyle = `rgba(${rgb}, ${avgAlpha * 0.6})`;
                    particleCtx.fill();
                }
            });
        }
    });
    
    // Update and draw neurons
    neurons.forEach(neuron => neuron.update());
    
    // Create new pulses periodically
    pulseTimer++;
    if (pulseTimer > 20 && mouse.x != null && mouse.y != null) {
        pulseTimer = 0;
        
        // Find visible neurons
        const visibleNeurons = neurons.filter(n => n.alpha > 0.3);
        
        if (visibleNeurons.length > 1) {
            const randomNeuron = visibleNeurons[Math.floor(Math.random() * visibleNeurons.length)];
            if (randomNeuron.connections.length > 0) {
                const randomConnection = randomNeuron.connections[Math.floor(Math.random() * randomNeuron.connections.length)];
                activePulses.push(new NervePulse(randomNeuron, randomConnection));
            }
        }
    }
    
    // Update and draw pulses
    activePulses = activePulses.filter(pulse => pulse.update());
}
