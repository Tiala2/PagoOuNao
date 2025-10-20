document.addEventListener('DOMContentLoaded', () => {
  let moedas = 100;
  let bemEstar = 50;
  let rodada = 1;
  const totalRodadas = 5;

  // Classes sociais
  const classesSociais = {
    baixa: { rendaInicial: 50, irpf: 0.075, consumo: 5 },
    média: { rendaInicial: 100, irpf: 0.15, consumo: 10 },
    alta: { rendaInicial: 200, irpf: 0.275, consumo: 20 }
  };
  let classeAtual = null;

  // Telas
  const telas = {
    menu: document.getElementById('tela-menu'),
    classe: document.getElementById('tela-classe'),
    instrucoes: document.getElementById('tela-instrucoes'),
    jogo: document.getElementById('tela-jogo'),
    resultado: document.getElementById('tela-resultado')
  };

  // Displays
  const displayRodada = document.getElementById('display-rodada');
  const displayMoedas = document.getElementById('display-moedas');
  const displayBemestar = document.getElementById('display-bemestar');
  const textoDecisao = document.getElementById('texto-decisao');
  const finalMoedas = document.getElementById('final-moedas');
  const finalBemestar = document.getElementById('final-bemestar');
  const mensagemFinal = document.getElementById('mensagem-final');

  // Botões
  const btnJogar = document.getElementById('btn-jogar');
  const btnInstrucoes = document.getElementById('btn-instrucoes');
  const btnVoltarInstrucoes = document.getElementById('btn-voltar-instrucoes');
  const btnSair = document.getElementById('btn-sair');
  const btnPagar = document.getElementById('btn-pagar');
  const btnSonegar = document.getElementById('btn-sonegar');
  const btnVoltarMenu = document.getElementById('btn-voltar-menu');

  // Áudio
  const audioFundo = document.getElementById('audio-fundo');

  function mostrarTela(nome) {
    Object.values(telas).forEach(t => t.classList.add('hidden'));
    telas[nome].classList.remove('hidden');
  }

  function atualizarDisplays() {
    displayRodada.textContent = `${rodada}/${totalRodadas}`;
    displayMoedas.textContent = moedas;
    displayBemestar.textContent = bemEstar;
  }

  function iniciarSelecaoClasse() {
    mostrarTela('classe');
  }

  document.querySelectorAll('.class-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const classe = btn.dataset.classe;
      classeAtual = classesSociais[classe];
      moedas = classeAtual.rendaInicial;
      bemEstar = 50;
      rodada = 1;
      atualizarDisplays();
      mostrarTela('jogo');

      audioFundo.currentTime = 0;
      audioFundo.play().catch(() => console.log("Clique para habilitar o áudio."));
    });
  });

  function iniciarJogo() {
    iniciarSelecaoClasse();
  }

  function proximaRodada() {
    rodada++;
    if (rodada > totalRodadas) fimDeJogo();
    else {
      atualizarDisplays();
      textoDecisao.textContent = 'Aguardando sua decisão...';
    }
  }

  function pagar() {
    const irpfRodada = Math.round(moedas * classeAtual.irpf);
    const consumoRodada = classeAtual.consumo;
    moedas -= (irpfRodada + consumoRodada);
    bemEstar += 10;
    textoDecisao.textContent = `Você pagou os impostos desta rodada (-${irpfRodada + consumoRodada} moedas).`;
    atualizarDisplays();
    setTimeout(proximaRodada, 800);
  }

  function sonegar() {
    moedas += 10;
    bemEstar -= 5;
    let msg = 'Você optou por sonegar nesta rodada.';
    if (Math.random() < 0.2) {
      const multa = 40;
      moedas -= multa;
      bemEstar -= 15;
      msg += ` ⚠️ Você foi pego na auditoria! Penalidade aplicada (-${multa} moedas).`;
    }
    textoDecisao.textContent = msg;
    atualizarDisplays();
    setTimeout(proximaRodada, 1000);
  }

  function fimDeJogo() {
    mostrarTela('resultado');
    finalMoedas.textContent = moedas;
    finalBemestar.textContent = bemEstar;

    if (bemEstar >= 70 && moedas >= 100)
      mensagemFinal.textContent = 'Parabéns! Você manteve equilíbrio entre finanças e bem-estar.';
    else if (bemEstar < 60 && moedas > 150)
      mensagemFinal.textContent = 'Você ficou rico, mas a sociedade entrou em colapso!';
    else if (bemEstar >= 60 && moedas < 80)
      mensagemFinal.textContent = 'Você se sacrificou pelas pessoas — a sociedade agradece!';
    else
      mensagemFinal.textContent = 'Resultado neutro — há espaço para melhorias!';
  }

  function reiniciarParaMenu() {
    moedas = 100;
    bemEstar = 50;
    rodada = 1;
    atualizarDisplays();
    mostrarTela('menu');
  }

  // Eventos dos botões
  btnJogar.addEventListener('click', iniciarJogo);
  btnInstrucoes.addEventListener('click', () => mostrarTela('instrucoes'));
  btnVoltarInstrucoes.addEventListener('click', () => mostrarTela('menu'));
  btnSair.addEventListener('click', () => window.close());
  btnPagar.addEventListener('click', pagar);
  btnSonegar.addEventListener('click', sonegar);
  btnVoltarMenu.addEventListener('click', reiniciarParaMenu);

  mostrarTela('menu');
  atualizarDisplays();
});
