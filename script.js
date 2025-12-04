document.addEventListener('DOMContentLoaded', () => {
  let moedas = 0;
  let bemEstar = 50;
  let rodada = 1;
  const totalRodadas = 6;

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

  // Pop-up de informações
  const infoPopup = document.getElementById('info-popup');
  const voltarBtn = document.getElementById('voltar-btn');
  let popupTimeoutId = null;

  // Pop-up de crise financeira
  const crisePopup = document.getElementById('crise-popup');
  const criseTexto = document.getElementById('crise-texto');
  const btnPedirEmprestimo = document.getElementById('btn-pedir-emprestimo');
  const btnSonegarCrise = document.getElementById('btn-sonegar-crise');
  let criseAberta = false;

  // Toast de alerta (fiscalização)
  const alertaToast = document.getElementById('alert-toast');
  const alertaToastMsg = document.getElementById('alert-toast-msg');
  let alertaTimeoutId = null;

  // Estado adicional de jogo
  let jogadorEstaSonegando = false; // flag ativada pela escolha na crise
  let classeSelecionada = null;     // mantém a chave da classe ('baixa' | 'média' | 'alta')
  const emprestimosPorClasse = {
    baixa: 120,
    média: 240,
    alta: 400,
  };

  // Áudio
  const audioFundo = document.getElementById('audio-fundo');

  function mostrarTela(nome) {
    Object.values(telas).forEach(t => t.classList.add('hidden'));
    telas[nome].classList.remove('hidden');

   // Parar e reiniciar o áudio de fundo
    audioFundo.currentTime = 0;
    audioFundo.play();

    // Sempre que trocar de tela, garantir que o pop-up esteja oculto
    if (nome !== 'resultado' && infoPopup) {
      infoPopup.style.display = 'none';
    }
    // Cancelar timer pendente ao trocar de tela
    if (popupTimeoutId) {
      clearTimeout(popupTimeoutId);
      popupTimeoutId = null;
    }
    // Sempre esconder crise ao trocar de tela
    if (crisePopup) {
      crisePopup.style.display = 'none';
      criseAberta = false;
    }
    // Ocultar alerta ao trocar de tela
    if (alertaToast) {
      alertaToast.classList.remove('show');
      if (alertaTimeoutId) {
        clearTimeout(alertaTimeoutId);
        alertaTimeoutId = null;
      }
    }
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
      classeSelecionada = classe; // guardamos a chave da classe
      moedas = classeAtual.rendaInicial;
      bemEstar = 50;
      rodada = 1;
      atualizarDisplays();
      mostrarTela('jogo');

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
    // Se o jogador escolheu sonegar via crise, pular pagamento
    if (jogadorEstaSonegando) {
      textoDecisao.textContent = 'Você optou por não pagar impostos nas próximas rodadas.';
      atualizarDisplays();
      setTimeout(proximaRodada, 800);
      return;
    }
    const irpfRodada = Math.round(moedas * classeAtual.irpf);
    const consumoRodada = classeAtual.consumo;
    moedas -= (irpfRodada + consumoRodada);
    bemEstar += 10;
    textoDecisao.textContent = `Você pagou os impostos desta rodada (-${irpfRodada + consumoRodada} moedas).`;
    atualizarDisplays();
    const tratado = verificarCriseFinanceira();
    if (!tratado) {
      setTimeout(proximaRodada, 800);
    }
  }

  function sonegar() {
    // Ganho e fiscalização 
    const ganho = 8 + Math.floor(Math.random() * 8); // 8 a 15 moedas
    moedas += ganho;
    bemEstar -= 5;
    let msg = `Você optou por sonegar nesta rodada (+${ganho} moedas).`;

    // Probabilidade varia entre 10% e 35% a cada tentativa, para parecer mais "na sorte"
    const probFiscalizacao = 0.10 + Math.random() * 0.25; // [0.10, 0.35]
    if (Math.random() < probFiscalizacao) {
      const multa = 30 + Math.floor(Math.random() * 31); // 30 a 60
      const perdaBemEstar = 10 + Math.floor(Math.random() * 11); // 10 a 20
      moedas -= multa;
      bemEstar -= perdaBemEstar;
      msg += ` ⚠️ Você foi pego na auditoria! Penalidade (-${multa} moedas, -${perdaBemEstar} bem-estar).`;
      // Exibe alerta visual de fiscalização
      mostrarAlertaFiscalizacao('ALERTA: Você foi pego na auditoria!');
    }
    textoDecisao.textContent = msg;
    atualizarDisplays();
    const tratado = verificarCriseFinanceira();
    if (!tratado) {
      setTimeout(proximaRodada, 1000);
    }
  }

  function mostrarAlertaFiscalizacao(texto) {
    if (!alertaToast) return;
    if (alertaTimeoutId) {
      clearTimeout(alertaTimeoutId);
      alertaTimeoutId = null;
    }
    if (alertaToastMsg) alertaToastMsg.textContent = texto;
    alertaToast.classList.add('show');
    alertaTimeoutId = setTimeout(() => {
      alertaToast.classList.remove('show');
    }, 2500);
  }

  // Verifica se moedas <= 0 e decide ação: 
  function verificarCriseFinanceira() {
    if (moedas <= 0) {
      // 6ª (última) rodada negativa: pular pop-up e ir direto ao resultado
      if (rodada === totalRodadas) {
        fimDeJogo();
        return true;
      }
      if (crisePopup && !criseAberta && telas.jogo && !telas.jogo.classList.contains('hidden')) {
        // Atualiza texto com valor do empréstimo pela classe
        const chave = classeSelecionada || 'média';
        const valorEmprestimo = emprestimosPorClasse[chave] ?? emprestimosPorClasse['média'];
        if (criseTexto) {
          criseTexto.textContent = `Você ficou sem moedas. Empréstimo disponível para sua classe: ${valorEmprestimo} moedas.`;
        }
        crisePopup.style.display = 'flex';
        criseAberta = true;
        return true;
      }
    }
    return false;
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

    // Exibir pop-up 6 segundos após carregar a tela de resultado
    if (infoPopup) {
      if (popupTimeoutId) {
        clearTimeout(popupTimeoutId);
      }
      popupTimeoutId = setTimeout(() => {
        // Garante que ainda estamos na tela de resultado antes de mostrar
        if (!telas.resultado.classList.contains('hidden')) {
          infoPopup.style.display = 'flex'; // Usa flex para centralização conforme CSS
        }
      }, 6000);
    }
  }

  function reiniciarParaMenu() {
    moedas = 100;
    bemEstar = 50;
    rodada = 1;
    jogadorEstaSonegando = false;
    atualizarDisplays();
    // Oculta pop-up e cancela timer ao voltar ao menu
    if (popupTimeoutId) {
      clearTimeout(popupTimeoutId);
      popupTimeoutId = null;
    }
    if (infoPopup) infoPopup.style.display = 'none';
    if (crisePopup) {
      crisePopup.style.display = 'none';
      criseAberta = false;
    }
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

  // Botão de fechar do pop-up
  if (voltarBtn) {
    voltarBtn.addEventListener('click', () => {
      infoPopup.style.display = 'none';
    });
  }

  // Ações do pop-up de crise
  if (btnPedirEmprestimo) {
    btnPedirEmprestimo.addEventListener('click', () => {
      const chave = classeSelecionada || 'média';
      const valorEmprestimo = emprestimosPorClasse[chave] ?? emprestimosPorClasse['média'];
      moedas += valorEmprestimo;
      textoDecisao.textContent = `Você pegou um empréstimo de ${valorEmprestimo} moedas.`;
      crisePopup.style.display = 'none';
      criseAberta = false;
      atualizarDisplays();
      // Após resolver a crise, seguir para a próxima rodada
      setTimeout(proximaRodada, 600);
    });
  }

  if (btnSonegarCrise) {
    btnSonegarCrise.addEventListener('click', () => {
      jogadorEstaSonegando = true;
      textoDecisao.textContent = 'Você escolheu não pagar impostos nas próximas rodadas.';
      crisePopup.style.display = 'none';
      criseAberta = false;
      atualizarDisplays();
      // Após resolver a crise, seguir para a próxima rodada
      setTimeout(proximaRodada, 600);
    });
  }

  mostrarTela('menu');
  atualizarDisplays();
});
