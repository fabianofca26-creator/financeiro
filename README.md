# Controle Financeiro

Controle de finanças pessoais em **um único arquivo HTML**. Sem instalar nada, sem servidor, sem conta, sem internet. Você baixa o arquivo, abre no navegador e usa.

Feito para quem paga contas no cartão, parcela compras e vive pagando coisa que não é sua — reembolso da empresa, rateio de conta com amigos, empréstimo pra família — e precisa saber quanto disso vai voltar.

## Como usar

Abra direto no navegador: **https://fabianofca26-creator.github.io/financeiro/**

No celular, abra esse endereço no Chrome e use **"Instalar app"** no menu (⋮). Ele instala de verdade: ganha ícone próprio, abre em tela cheia sem a barra do navegador e **funciona sem internet**, porque um service worker guarda o app no aparelho.

> Se aparecer só "Adicionar à tela inicial" em vez de "Instalar app", é o navegador segurando a versão antiga em cache. Recarregue a página forçando (puxe para baixo) e tente de novo.

Ou baixe o [`index.html`](index.html) e abra com duplo clique — funciona igual, sem depender de nada.

Depois vá em **Mais › Ajustes** e cadastre suas contas com o saldo de hoje, e então os cartões.

> **Seus dados ficam só no seu aparelho**, no `localStorage` do navegador. Nada é enviado para lugar nenhum. Isso também quer dizer que **limpar os dados de navegação apaga tudo** — exporte o backup de vez em quando. O app avisa quando passa de 7 dias sem backup.

## Como ele pensa

Estas são as decisões que fazem os números baterem. Vale ler antes de estranhar algum total.

### Pendente e pago

Todo lançamento tem um estado:

- **Pendente** — vai acontecer. Não mexe no saldo, aparece em "vence nos próximos 7 dias".
- **Pago** — aconteceu. Mexe no saldo.

Por isso a tela inicial mostra dois números: o **saldo atual** (o dinheiro que existe hoje) e o **previsto para o fim do mês** (como você termina o mês se tudo correr como planejado, já descontando as faturas que vencem até lá).

### Cartão de crédito

Compra no cartão **não tira dinheiro de conta nenhuma** — ela entra numa fatura. O cartão guarda o dia de fechamento e o de vencimento, e o app calcula sozinho qual fatura recebe cada compra:

> Cartão fecha dia 28, vence dia 5.
> Compra em 27/jan → fatura que fecha 28/jan, vence 05/fev.
> Compra em 29/jan → fatura que fecha 28/fev, vence 05/mar.

Parcelamento vira N lançamentos, um em cada fatura seguida. A tela do cartão mostra o quanto já está **comprometido em parcelas de meses futuros** — que costuma ser o número que dói e que quase nenhum controle mostra.

A fatura é paga inteira, num clique. Esse é o único momento em que o cartão mexe no seu dinheiro.

### O mês em que um gasto conta

O saldo das contas é **regime de caixa**: só muda quando o dinheiro se move de verdade.

Já o orçamento e os relatórios são **regime de competência**: uma compra no cartão conta no mês em que foi feita, não no mês em que a fatura é paga. Sem isso, o teto de "mercado" misturaria compras de dois meses diferentes e não serviria para nada.

### Quando alguém vai te devolver

Um interruptor no lançamento abre dois campos: **de quem** é a dívida e **quanto** dela. A parte devida:

- **sai do seu dinheiro / entra na fatura normalmente**, porque saiu mesmo;
- **fica fora das suas estatísticas**, porque essa parte não é gasto seu;
- **vira um crédito a receber** daquela pessoa.

O que sobra continua sendo gasto seu, na categoria normal. É isso que faz o rateio funcionar:

| Lanche de R$ 120, os amigos devem R$ 80 | |
|---|---|
| Sai da conta | R$ 120 |
| Vira gasto seu | R$ 40, em "Alimentação fora" |
| Vira dívida do João | R$ 80 |

Deixar o campo em branco quer dizer "me devem tudo", que é o caso do reembolso da empresa e do empréstimo. Empréstimo, por definição, não aparece em estatística nenhuma: não é consumo, é dinheiro que volta.

Quando o pagamento cai, ele também **não conta como receita** — senão o "entrou no mês" ficaria inflado. É só o dinheiro voltando pro lugar.

A tela **Me devem** separa **Empresa** (com lista pronta para copiar e mandar para quem faz o pagamento, e destaque no que passou de 60 dias) de **Pessoas**, agrupado por quem deve. Recebimento parcial deixa a diferença pendente; se ela nunca for paga, um botão transforma o valor em gasto seu.

Compra parcelada lança o crédito **cheio no mês da compra**, porque quem deve costuma devolver tudo de uma vez enquanto as parcelas ainda estão correndo.

As pessoas são cadastradas em **Ajustes › Pessoas que me devem**. A marcada como "empresa" é a que ganha a seção separada.

### O Relatório

Quatro gráficos, desenhados em SVG puro — o app não carrega biblioteca nenhuma:

- **Para onde foi** — rosca das 5 maiores categorias do mês, o resto somado em "Outros". Os valores ficam na legenda, não em cima das fatias.
- **Saldo ao longo do mês** — dia a dia, traço cheio no que já aconteceu e tracejado na projeção até o fim do mês, já descontando o que vence e as faturas.
- **Já comprometido** — quanto dos próximos 6 meses está vendido antes de começar, separando parcelas do cartão de contas fixas.
- **Entrou e saiu** — 12 meses lado a lado, para enxergar em que época do ano aperta.

Tocar em qualquer barra, fatia ou dia escreve o valor embaixo do título. Nenhum valor depende disso: cada gráfico já mostra o seu número principal sem nenhum toque, e a rosca traz a tabela inteira na legenda.

As cores não foram escolhidas no olho — passaram por um validador de contraste e de daltonismo contra as duas superfícies do app, clara e escura.

### Contas fixas

Cadastre uma vez (aluguel, luz, internet, salário) e elas nascem sozinhas como pendentes quando o mês vira. As marcadas como "valor estimado" aprendem o valor novo quando você paga um valor diferente.

## Dinheiro em centavos

Valores são guardados como **inteiros em centavos**, nunca como número decimal. Uma compra de R$ 1.000,00 em 3× vira 333,34 + 333,33 + 333,33 — a sobra de centavos vai na primeira parcela e a soma fecha exata. É a razão de não aparecer aquele centavo perdido que assombra planilha de controle financeiro.

## Backup e uso em dois aparelhos

O backup é um arquivo `.json` exportado pelo botão em **Ajustes**. Importar **substitui tudo**, não mescla.

Se usar no celular e no PC, escolha um como oficial (o celular, normalmente, que é onde você lança na hora) e deixe o outro só para consultar. Editar nos dois e importar depois faz um lado perder lançamentos.

> **Escolha um endereço e fique nele.** O navegador guarda os dados separados por endereço, então o site e o arquivo baixado são **duas bases diferentes** — o que você lançar num não aparece no outro. Abrir sempre pelo mesmo lugar evita a impressão de que "sumiram os lançamentos".

## Testes

Abra o arquivo com `?teste` no fim da URL e veja o console do navegador. Ele roda as asserções de conversão de dinheiro, divisão de parcelas, virada de mês, cálculo de fatura, a migração do formato antigo e um cenário completo de compra parcelada com rateio e recebimento parcial. Depois clica nos controles de verdade — cadastrar conta e pessoa, lançar um rateio, navegar pelo menu — porque testar só as funções já deixou passar um bug que travava todos os botões das janelas.

```
https://fabianofca26-creator.github.io/financeiro/?teste
```

Para testar o service worker e a instalação é preciso servir por HTTP — arquivo local não registra service worker:

```bash
node serve.js
```

## O que ele não faz

Investimentos, metas de economia, juros do rotativo, importar extrato ou OFX, foto de comprovante, multiusuário e contabilidade de empresa. Tudo isso é de propósito — o app resolve o controle do dia a dia e para por aí.
