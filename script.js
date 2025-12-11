const container = document.querySelector('.items');
const cubes = document.querySelectorAll('.item');

let activeCube = null;
let offset = { x: 0, y: 0 };
const cubeSize = 100;
const gap = 10;
const containerPadding = 10;

// --- 1. Load and Apply Saved Positions ---
const savedPositions = JSON.parse(localStorage.getItem('cubePositions')) || {};
let positionsToSave = savedPositions;

cubes.forEach((cube, index) => {
    const cubeId = cube.className.split(' ').find(cls => cls.startsWith('item')); // e.g., 'item1'

    if (positionsToSave[cubeId]) {
        // If position is saved, use it.
        cube.style.left = positionsToSave[cubeId].left;
        cube.style.top = positionsToSave[cubeId].top;
    } else {
        // If no position is saved, calculate the initial grid position.
        const itemsPerRow = Math.floor((container.clientWidth - 2 * containerPadding + gap) / (cubeSize + gap));
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;

        const initialLeft = containerPadding + col * (cubeSize + gap);
        const initialTop = containerPadding + row * (cubeSize + gap);

        cube.style.left = `${initialLeft}px`;
        cube.style.top = `${initialTop}px`;
        
        // Save the initial position so it doesn't recalculate on every load
        positionsToSave[cubeId] = {
            left: `${initialLeft}px`,
            top: `${initialTop}px`
        };
    }
});
// Save the initial/default positions right away if they were just calculated
localStorage.setItem('cubePositions', JSON.stringify(positionsToSave));


function dragStart(e) {
    if (!e.target.classList.contains('item')) return;

    activeCube = e.target;
    activeCube.classList.add('dragging');

    e.preventDefault();

    // ... (unchanged code for dragStart)
    const containerRect = container.getBoundingClientRect();

    offset.x = e.clientX - activeCube.getBoundingClientRect().left;
    offset.y = e.clientY - activeCube.getBoundingClientRect().top;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
}

function drag(e) {
    if (!activeCube) return;

    e.preventDefault();
    const containerRect = container.getBoundingClientRect();
    const cubeRect = activeCube.getBoundingClientRect();
    const rawNewX = e.clientX - offset.x;
    const rawNewY = e.clientY - offset.y;

    let newLeft = rawNewX - containerRect.left;
    let newTop = rawNewY - containerRect.top;

    const maxX = containerRect.width - cubeRect.width - containerPadding * 2;
    const minX = 0;

    const maxY = containerRect.height - cubeRect.height - containerPadding * 2;
    const minY = 0;

    newLeft = Math.min(Math.max(newLeft, minX), maxX);
    newTop = Math.min(Math.max(newTop, minY), maxY);

    activeCube.style.left = `${newLeft}px`;
    activeCube.style.top = `${newTop}px`;
}


function dragEnd() {
    if (!activeCube) return;
    
    // --- 2. Save Position on Drop (New Logic) ---
    const cubeId = activeCube.className.split(' ').find(cls => cls.startsWith('item'));
    
    positionsToSave[cubeId] = {
        left: activeCube.style.left,
        top: activeCube.style.top
    };

    // Save the entire object back to localStorage
    localStorage.setItem('cubePositions', JSON.stringify(positionsToSave));
    // --- End Save Logic ---

    activeCube.classList.remove('dragging');
    activeCube = null;

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
}

container.addEventListener('mousedown', dragStart);