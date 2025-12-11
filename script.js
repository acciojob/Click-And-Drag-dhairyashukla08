
const container = document.querySelector('.items');
const cubes = document.querySelectorAll('.item');

let activeCube = null; 
let offset = { x: 0, y: 0 }; 
const cubeSize = 100; 
const gap = 10;    
const containerPadding = 10; 

cubes.forEach((cube, index) => {

    const itemsPerRow = Math.floor((container.clientWidth - 2 * containerPadding + gap) / (cubeSize + gap));
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;

    const initialLeft = containerPadding + col * (cubeSize + gap);
    const initialTop = containerPadding + row * (cubeSize + gap);

    cube.style.left = `${initialLeft}px`;
    cube.style.top = `${initialTop}px`;
});



function dragStart(e) {

    if (!e.target.classList.contains('item')) return;

    activeCube = e.target;
    activeCube.classList.add('dragging');

    e.preventDefault();

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

    const maxX = containerRect.width - cubeRect.width - containerPadding * 2; // max Left position
    const minX = 0; 

    const maxY = containerRect.height - cubeRect.height - containerPadding * 2; // max Top position
    const minY = 0; 

    newLeft = Math.min(Math.max(newLeft, minX), maxX);
    newTop = Math.min(Math.max(newTop, minY), maxY);
    activeCube.style.left = `${newLeft}px`;
    activeCube.style.top = `${newTop}px`;
}


function dragEnd() {
    if (!activeCube) return;
    activeCube.classList.remove('dragging');
    activeCube = null;

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
}

container.addEventListener('mousedown', dragStart);