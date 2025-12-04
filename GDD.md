# 🎮 Game Design Document (GDD)
## Dilema Cívico — por Tiala


**Data:** 2 de dezembro de 2025  
**Desenvolvedores:** Tiala Nobre e Cristiano
**Plataforma:** Web Browser  

---

## 1. Minha Visão Geral do Jogo

### 1.1 Conceito Central
"Dilema Cívico" é um jogo que eu criei com o objetivo de provocar reflexão. Nele, o jogador vive dilemas reais sobre pagar ou sonegar impostos, equilibrando suas próprias moedas com o impacto social. A ideia é mostrar, de forma leve e interativa, como nossas escolhas fiscais afetam o coletivo e a nós mesmos.

### 1.2 Público-Alvo
- Jovens adultos (18 a 30 anos) que querem aprender mais sobre educação fiscal
- Estudantes de economia, direito e ciências sociais  
- Qualquer pessoa interessada em jogos educativos acessíveis

### 1.3 Plataforma e Tecnologia
O jogo foi pensado para rodar direto no navegador, de forma simples e prática.
- HTML5, CSS3 e JavaScript puro
- Funciona tanto no desktop quanto no mobile

---

## 2. Mecânicas do Jogo

### 2.1 Loop Principal
O fluxo das ações é simples e direto, exatamente como eu quis que fosse:
1. O jogador escolhe sua classe social
2. Decide pagar ou sonegar
3. Enfrenta as consequências
4. Avança para a próxima rodada
5. Chega ao resultado final

### 2.2 Classes Sociais
As classes têm características baseadas na realidade, mas simplificadas:

| Classe | Renda Inicial | IRPF | Consumo | Empréstimo |
|--------|---------------|------|---------|------------|
| Baixa  | 50 moedas     | 7.5% | 5       | 120        |
| Média  | 100 moedas    | 15%  | 10      | 240        |
| Alta   | 200 moedas    | 27.5%| 20      | 400        |

### 2.3 Sistema de Decisão
O jogador tem duas escolhas principais:

#### **Pagar Impostos**
- Custo calculado conforme IRPF
- Ganha +10 de bem-estar
- Perde moedas

#### **Sonegar**
- Ganha moedas extras
- Perde bem-estar
- Risco real de auditoria
- Penalidades pesadas caso seja pego

### 2.4 Auditoria
- A chance de ser auditado varia entre 10% e 35%.
- Se for detectado:
  - Perde moedas
  - Perde ainda mais bem-estar
  - Recebe um alerta visual vermelho

### 2.5 Crise Financeira
Quando o jogador chega a 0 moedas, entra em crise.
Ele pode:
1. **Pedir empréstimo**
2. **Sonegar permanentemente** (decisão extrema)

---

## 3. Progressão e Balanceamento

### 3.1 Rodadas
- O jogo tem 6 rodadas
- É linear
- Não há limite de tempo

### 3.2 Economia
Nada de juros, inflação ou investimentos — foco é o básico e o educativo.

### 3.3 Tipos de Final
Não quis criar "vitória", mas sim perfis:
- **Equilíbrio Ideal:** bem-estar alto + moedas suficientes
- **Rico Egoísta:** poucas consequências sociais + muitas moedas
- **Mártir Social:** faz tudo pelo coletivo, mas termina com pouco
- **Neutro:** meio-termo típico da vida real

---

## 4. Interface e Experiência

### 4.1 Fluxo de Telas
```
Menu Principal → Escolher Classe → Rodadas → Resultado Final
                  ↘ Instruções
```

### 4.2 Elementos de UI
- Barras de status de moedas, bem-estar e rodada
- Botões de ação com feedback visual
- Layout limpo, com cores que guiam o jogador

### 4.3 Feedback Visual
- Verde para positivo
- Vermelho para negativo
- Azul para neutro
- Animações suaves, toasts para alertas

---

## 5. Narrativa e Ambientação

### 5.1 Tom e Atmosfera
- **Tom:** Educativo mas não moralista
- **Atmosfera:** Reflexiva, com toques de humor
---

## 5. Narrativa e Ambientação

### 5.1 Tom
Eu quis manter algo educativo, leve, com humor e sem posicionamento político.

### 5.2 Informações Educativas
Ao final, o jogador recebe um pop-up com dados reais sobre impostos.

### 5.3 Consequências Narrativas
Cada final traz uma mensagem sobre decisões e impactos sociais.ltiplas telas
- **CSS:** Responsivo, glassmorphism design
---

## 6. Parte Técnica

### 6.1 Arquitetura
- HTML organizado em telas
- CSS com visual clean e glassmorphism
- JavaScript controlando tudo por eventos e estado global

### 6.2 Estrutura do Estado
```javascript
{
  moedas: number,
  bemEstar: number,
  rodada: number,
  classeAtual: object,
  jogadorEstaSonegando: boolean
}
```

### 6.3 Eventos
- Clicks
- Alternância de telas
- Pequenos timers para transiçõesnuo)
- **Controle:** Auto-play com reinício a cada troca de tela

---

## 7. Audio e Efeitos

### 7.1 Música
Trilha suave em loop.

### 7.2 Efeitos
- Hovers
- Toasters
- Transparências e filtros

---

## 8. Métricas Futuras

Ainda não implementadas, mas previstas:
- Quanto cada classe sonega
- Frequência de auditorias
- Tipo de final mais comum
- Tempo médio gasto em cada rodada
- [ ] Modo multiplayer cooperativo
- [ ] Dashboard de estatísticas pessoais
- [ ] Integração com redes sociais

### 9.2 Melhorias de Balanceamento
- [ ] Ajustar probabilidades de auditoria
- [ ] Implementar inflação por rodada
---

## 9. Planejamento Futuro

### 9.1 Funcionalidades Planejadas
- [ ] Sistema de save
- [ ] Cenários internacionais
- [ ] Modo multiplayer
- [ ] Dashboard de resultados
- [ ] Compartilhamento social

### 9.2 Balanceamento
- [ ] Reajuste das chances de auditoria
- [ ] Inflação
- [ ] Eventos aleatórios
- [ ] Conquistas

### 9.3 Mais Conteúdo
- [ ] Novas classes
- [ ] Novos impostos
- [ ] Sistema de eleições
- [ ] Políticas públicas aprimoradas

---

## 10. Considerações de Design

### 10.1 Minhas Decisões
- O jogo é simples porque o foco é aprender
- Evito qualquer viés
- Quero que qualquer pessoa consiga jogar

### 10.2 Limitações
- Sem salvamento
- Áudio pode falhar
- Balanceamento inicial ainda básico

### 10.3 Princípios
- Educação em primeiro lugar
- Escolhas significativas
- Realismo sem distorção

---

**Fim do Documento**  
*Última atualização: 10 de novembro de 2025*