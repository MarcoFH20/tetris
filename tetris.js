
// --- TETRIS COMPLETO ---
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const columnas = 10;
const filas = 18;
const TAM_BLOQUE = 32;
const tablero = Array.from({ length: filas }, () => Array(columnas).fill(0));

const PIEZAS = [
	{ matriz: [[1, 1, 1, 1]], color: '#00e5ff' }, // I
	{ matriz: [[1, 1], [1, 1]], color: '#ffe600' }, // O
	{ matriz: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: '#b400ff' }, // T
	{ matriz: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: '#ff1744' }, // S
	{ matriz: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: '#00e676' }, // Z
	{ matriz: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: '#2979ff' }, // J
	{ matriz: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: '#ff9100' } // L
];

function piezaAleatoria() {
	const p = PIEZAS[Math.floor(Math.random() * PIEZAS.length)];
	return {
		matriz: p.matriz.map(row => [...row]),
		color: p.color,
		x: Math.floor(columnas / 2) - Math.ceil(p.matriz[0].length / 2),
		y: 0
	};
}

let pieza = piezaAleatoria();

function dibujarMatriz(matriz, offsetX, offsetY, color) {
	for (let y = 0; y < matriz.length; y++) {
		for (let x = 0; x < matriz[y].length; x++) {
			if (matriz[y][x]) {
				context.fillStyle = color;
				context.fillRect((offsetX + x) * TAM_BLOQUE, (offsetY + y) * TAM_BLOQUE, TAM_BLOQUE, TAM_BLOQUE);
				context.strokeStyle = '#222';
				context.lineWidth = 2;
				context.strokeRect((offsetX + x) * TAM_BLOQUE, (offsetY + y) * TAM_BLOQUE, TAM_BLOQUE, TAM_BLOQUE);
			}
		}
	}
}

function dibujarTablero() {
	for (let y = 0; y < filas; y++) {
		for (let x = 0; x < columnas; x++) {
			context.strokeStyle = '#444';
			context.lineWidth = 1.5;
			context.strokeRect(x * TAM_BLOQUE, y * TAM_BLOQUE, TAM_BLOQUE, TAM_BLOQUE);
			if (tablero[y][x]) {
				context.fillStyle = tablero[y][x];
				context.fillRect(x * TAM_BLOQUE, y * TAM_BLOQUE, TAM_BLOQUE, TAM_BLOQUE);
				context.strokeStyle = '#222';
				context.lineWidth = 2;
				context.strokeRect(x * TAM_BLOQUE, y * TAM_BLOQUE, TAM_BLOQUE, TAM_BLOQUE);
			}
		}
	}
}

function dibujar() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	dibujarTablero();
	dibujarMatriz(pieza.matriz, pieza.x, pieza.y, pieza.color);
}

function colision(tablero, pieza) {
	for (let y = 0; y < pieza.matriz.length; y++) {
		for (let x = 0; x < pieza.matriz[y].length; x++) {
			if (
				pieza.matriz[y][x] &&
				(tablero[pieza.y + y] && tablero[pieza.y + y][pieza.x + x]) !== 0
			) {
				return true;
			}
		}
	}
	return false;
}

function fijarPieza() {
	for (let y = 0; y < pieza.matriz.length; y++) {
		for (let x = 0; x < pieza.matriz[y].length; x++) {
			if (pieza.matriz[y][x]) {
				tablero[pieza.y + y][pieza.x + x] = pieza.color;
			}
		}
	}
}

function limpiarLineas() {
	for (let y = tablero.length - 1; y >= 0; y--) {
		if (tablero[y].every(cell => cell !== 0)) {
			tablero.splice(y, 1);
			tablero.unshift(Array(columnas).fill(0));
			y++;
		}
	}
}

function rotar(matriz) {
	const N = matriz.length;
	const resultado = Array.from({ length: N }, () => Array(N).fill(0));
	for (let y = 0; y < N; y++) {
		for (let x = 0; x < N; x++) {
			resultado[x][N - 1 - y] = matriz[y][x];
		}
	}
	return resultado;
}

let ultimaCaida = Date.now();
const intervaloCaida = 700;

function actualizar() {
	const ahora = Date.now();
	if (ahora - ultimaCaida > intervaloCaida) {
		moverAbajo();
		ultimaCaida = ahora;
	}
	requestAnimationFrame(actualizar);
}

function moverAbajo() {
	pieza.y++;
	if (colision(tablero, pieza)) {
		pieza.y--;
		fijarPieza();
		limpiarLineas();
		pieza = piezaAleatoria();
		if (colision(tablero, pieza)) {
			alert('¡Juego terminado!');
			for (let y = 0; y < filas; y++) tablero[y].fill(0);
		}
	}
	dibujar();
}

actualizar();

document.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowDown') {
		moverAbajo();
		ultimaCaida = Date.now();
	} else if (event.key === 'ArrowLeft') {
		pieza.x--;
		if (colision(tablero, pieza)) pieza.x++;
		dibujar();
	} else if (event.key === 'ArrowRight') {
		pieza.x++;
		if (colision(tablero, pieza)) pieza.x--;
		dibujar();
	} else if (event.key === 'ArrowUp') {
		const matrizRotada = rotar(pieza.matriz);
		const anterior = pieza.matriz;
		pieza.matriz = matrizRotada;
		if (colision(tablero, pieza)) pieza.matriz = anterior;
		dibujar();
	}
});
