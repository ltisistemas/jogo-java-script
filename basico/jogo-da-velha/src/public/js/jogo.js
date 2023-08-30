const startScreen = document.getElementById("start-screen");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const info = document.querySelector("[data-info]");

let dialogBox;

const startLoading = () => {
  dialogBox = bootbox.dialog({
    centerVertical: true,
    message:
      '<p class="text-center mb-0"><i class="fas fa-spin fa-cog"></i> Carregando o jogo, aguarde...</p>',
    closeButton: false,
  });
};

const stopLoading = () => {
  setTimeout(() => dialogBox.modal("hide"), 2000);
};

const message = (msg) => {
  bootbox.dialog({
    message: msg,
    closeButton: false,
    size: "small",
    centerVertical: true,
    buttons: {
      ok: {
        label: "Ok!",
        className: "btn-info",
      },
    },
  });
};

const configuracoes = {
  podeJogar: true,
  jogadasExecutadas: 0,
  jogador: "0",
  matriz: [
    ["1", "1", "1"],
    ["1", "1", "1"],
    ["1", "1", "1"],
  ],
  lines: {
    rows: 3,
    cols: 3,
  },
  dimensoes: {
    width: 400,
    height: 400,
    left: canvas.offsetLeft + canvas.clientLeft,
    top: canvas.offsetTop + canvas.clientTop,
  },
  quadrado: {
    width: 0,
    height: 0,
    totais: {
      width: 0,
      height: 0,
    },
  },
};

const configurarCanvas = () => {
  configuracoes.jogador = "O";
  canvas.width = configuracoes.dimensoes.width;
  canvas.height = configuracoes.dimensoes.height;

  let larguraFixa = 0;
  larguraFixa = configuracoes.dimensoes.width * configuracoes.lines.cols;
  larguraFixa =
    larguraFixa / (configuracoes.lines.cols * configuracoes.lines.rows);

  larguraFixa = Math.floor(larguraFixa);

  configuracoes.quadrado.width = larguraFixa;

  configuracoes.quadrado.height = larguraFixa;

  configuracoes.quadrado.totais.width = Math.floor(
    configuracoes.quadrado.width * configuracoes.lines.cols
  );

  configuracoes.quadrado.totais.height = Math.floor(
    configuracoes.quadrado.height * configuracoes.lines.rows
  );
};

const quadros = [];

const desenhar = () => {
  ctx.clearRect(0, 0, configuracoes.width, configuracoes.height);

  let x = 0;
  let y = 0;

  let posicaoX = 0;
  let posicaoY = 0;

  const { width: w, height: h } = configuracoes.quadrado;
  do {
    posicaoY = 0;
    do {
      const quadro = {
        positions: { x, y },
        dimensions: { w, h },
        text: `${x}+${y}`,
        ctx,
        matriz: { x: posicaoX, y: posicaoY },
      };

      quadro.ctx.fillStyle = "white";
      quadro.ctx.fillRect(x, y, w, h);

      quadro.ctx.strokeStyle = "#313131";
      quadro.ctx.lineWidth = 2;
      quadro.ctx.strokeRect(x, y, w, h);
      quadro.ctx.textAlign = "center";

      const gradient = quadro.ctx.createLinearGradient(0, 0, 160, 0);
      gradient.addColorStop("0", "magenta");
      gradient.addColorStop("0.5", "blue");
      gradient.addColorStop("1.0", "red");

      quadro.ctx.fillStyle = gradient;

      quadros.push(quadro);

      y += configuracoes.quadrado.height;
      posicaoY++;
    } while (y <= configuracoes.quadrado.totais.height);

    x += configuracoes.quadrado.width;
    y = 0;
    posicaoX++;
  } while (x <= configuracoes.quadrado.totais.width);

  const jogador = configuracoes.jogador === "X" ? "O" : "X";
  info.innerHTML = jogador;
};

const registrarJogada = (event) => {
  const x = event.pageX - configuracoes.dimensoes.left;
  const y = event.pageY - configuracoes.dimensoes.top;

  const quadro = quadros.find((q) => {
    const xInicial = q.positions.x;
    const xFinal = q.positions.x + configuracoes.quadrado.width;

    const yInicial = q.positions.y;
    const yFinal = q.positions.y + configuracoes.quadrado.height;

    const validateX = x >= xInicial && x <= xFinal;

    const validateY = y >= yInicial && y <= yFinal;

    return validateX && validateY ? q : null;
  });

  const matriz = configuracoes.matriz[quadro.matriz.y][quadro.matriz.x];

  if (matriz === "1") {
    switch (configuracoes.jogador) {
      case "X":
        quadro.ctx.fillStyle = "#ff0000";
        break;
      default:
        quadro.ctx.fillStyle = "#006699";
        break;
    }

    configuracoes.matriz[quadro.matriz.y][quadro.matriz.x] =
      configuracoes.jogador;

    quadro.ctx.font = "bold 80px serif";
    quadro.ctx.fillText(
      configuracoes.jogador,
      quadro.positions.x + configuracoes.quadrado.width / 2,
      quadro.positions.y + configuracoes.quadrado.height - 80 / 2
    );

    const total = configuracoes.lines.cols * configuracoes.lines.rows;
    configuracoes.jogadasExecutadas++;

    if (configuracoes.jogadasExecutadas === total) {
      message("Fim do Jogo");
      configuracoes.podeJogar = false;

      info.innerHTML = "";
      return;
    }

    const jogador = configuracoes.jogador === "X" ? "O" : "X";
    info.innerHTML = jogador;
  }
};

const proximoJogador = () => {
  const jogador = configuracoes.jogador === "X" ? "O" : "X";
  configuracoes.jogador = jogador;
};

const verificarPorJogador = (jogador) => {
  const { matriz } = configuracoes;

  let jogadorVenceu = false;

  // Verificar em linha
  for (let x = 0; x < configuracoes.lines.rows; x++) {
    const line = matriz[x].join("");

    if (line === `${jogador}${jogador}${jogador}`) jogadorVenceu = true;
  }

  let emLinha = "";

  // Diagonal 01
  emLinha = [matriz[0][0], matriz[1][1], matriz[2][2]].join("");
  if (emLinha === `${jogador}${jogador}${jogador}`) jogadorVenceu = true;

  // Diagonal 02
  emLinha = [matriz[2][0], matriz[1][1], matriz[0][2]].join("");
  if (emLinha === `${jogador}${jogador}${jogador}`) jogadorVenceu = true;

  // Coluna 01
  emLinha = [matriz[0][0], matriz[1][0], matriz[2][0]].join("");
  if (emLinha === `${jogador}${jogador}${jogador}`) jogadorVenceu = true;

  // Coluna 02
  emLinha = [matriz[1][0], matriz[1][1], matriz[1][2]].join("");
  if (emLinha === `${jogador}${jogador}${jogador}`) jogadorVenceu = true;

  // Coluna 03
  emLinha = [matriz[2][0], matriz[2][1], matriz[2][2]].join("");
  if (emLinha === `${jogador}${jogador}${jogador}`) jogadorVenceu = true;

  if (jogadorVenceu) {
    return { result: true, jogador_Vendedor: jogador };
  }

  return { result: false };
};

const verificarVitoria = () => {
  let response = verificarPorJogador("X");
  if (response.result) return response;

  response = verificarPorJogador("O");
  if (response) return response;

  return response;
};

const handdle = () => {
  canvas.addEventListener("click", (event) => {
    if (!configuracoes.podeJogar) {
      message("Todas as jogadas já foram feitas");

      return;
    }

    // Trocar par o proximo Jogador
    proximoJogador();

    // Realizar jogada
    registrarJogada(event);

    // Verificar se Venceu
    const response = verificarVitoria();

    if (response.result) {
      message(`O vencendor foi o jogador <b>${response.jogador_Vendedor}</b>`);

      info.innerHTML = "";
      configuracoes.podeJogar = false;
      configuracoes.jogador = "";
    }
  });
};

const init = () => {
  startLoading();

  configurarCanvas();
  desenhar();
  handdle();

  stopLoading();
};

init();
