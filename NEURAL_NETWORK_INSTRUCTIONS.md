# Neural Network Animation - Implementation Instructions

## Step 1: Find the particle animation section in index.html

Look for this code around line 3092-3195:
```javascript
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
let gridParticles;
```

## Step 2: Replace the entire GridParticle class (around line 3119-3150)

DELETE the existing `class GridParticle { ... }` and REPLACE with the code from `neural_network_code.js` lines 1-127 (the Neuron and NervePulse classes).

## Step 3: Replace the initGrid function (around line 3152-3160)

DELETE:
```javascript
function initGrid() {
    gridParticles = [];
    let gap = 30;
    for (let y = 0; y < particleCanvas.height; y += gap) {
        for (let x = 0; x < particleCanvas.width; x += gap) {
            gridParticles.push(new GridParticle(x, y, 2, `rgb(${hexToRgb(primaryColor)})`));
        }
    }
}
```

REPLACE with:
```javascript
function initGrid() {
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
```

## Step 4: Replace the animateGrid function (around line 3168-3175)

DELETE:
```javascript
function animateGrid() {
    animationFrameId = requestAnimationFrame(animateGrid);
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (let i = 0; i < gridParticles.length; i++) {
        gridParticles[i].update();
    }
}
```

REPLACE with the animateNeuralNetwork function from `neural_network_code.js` lines 160-220.

## What you'll get:
- 🧠 Neural network with neurons (purple glowing nodes)
- ⚡ Electrical pulses (orange) racing along nerve pathways
- 🔗 Connections only visible when you hover
- 💫 Pulses speed up near your cursor
- 🎯 Perfect medical/pharmaceutical theme

The complete replacement code is in: `neural_network_code.js`
