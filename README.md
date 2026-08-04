# Controle Financeiro

Controle de finanças pessoais em **um único arquivo HTML**. Sem instalar nada, sem servidor, sem conta, sem internet. Você baixa o arquivo, abre no navegador e usa.

Feito para quem paga contas no cartão, parcela compras e ainda gasta dinheiro próprio em coisas de terceiros esperando reembolso depois.

## Como usar

1. Baixe o [`controle-financeiro.html`](controle-financeiro.html)
2. Abra no navegador (duplo clique)
3. Vá em **Mais › Ajustes** e cadastre suas contas com o saldo de hoje, depois os cartões

No celular, vale usar "Adicionar à tela inicial" pelo menu do navegador — ele abre como se fosse um aplicativo.

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

### Gastos de terceiros com reembolso

Um interruptor no lançamento marca o gasto como reembolsável. Ele:

- **sai do seu dinheiro / entra na fatura normalmente**, porque saiu mesmo;
- **fica fora de todas as suas estatísticas**, porque o gasto não é seu;
- **vira um crédito a receber**.

Quando o reembolso cai, ele também **não conta como receita** — senão o "entrou no mês" ficaria inflado. É só o dinheiro voltando pro lugar.

A tela **Empresa** lista o que está aguardando, agrupado por mês, destaca o que passou de 60 dias e gera uma lista pronta para copiar e mandar para quem faz o pagamento. Reembolso parcial deixa a diferença pendente; se ela nunca for paga, um botão transforma o valor em gasto seu.

Compra parcelada com reembolso lança o crédito **cheio no mês da compra**, porque quem reembolsa costuma devolver tudo de uma vez enquanto as parcelas ainda estão correndo.

### Contas fixas

Cadastre uma vez (aluguel, luz, internet, salário) e elas nascem sozinhas como pendentes quando o mês vira. As marcadas como "valor estimado" aprendem o valor novo quando você paga um valor diferente.

## Dinheiro em centavos

Valores são guardados como **inteiros em centavos**, nunca como número decimal. Uma compra de R$ 1.000,00 em 3× vira 333,34 + 333,33 + 333,33 — a sobra de centavos vai na primeira parcela e a soma fecha exata. É a razão de não aparecer aquele centavo perdido que assombra planilha de controle financeiro.

## Backup e uso em dois aparelhos

O backup é um arquivo `.json` exportado pelo botão em **Ajustes**. Importar **substitui tudo**, não mescla.

Se usar no celular e no PC, escolha um como oficial (o celular, normalmente, que é onde você lança na hora) e deixe o outro só para consultar. Editar nos dois e importar depois faz um lado perder lançamentos.

## Testes

Abra o arquivo com `?teste` no fim da URL e veja o console do navegador. Ele roda as asserções de conversão de dinheiro, divisão de parcelas, virada de mês, cálculo de fatura e um cenário completo de compra parcelada com reembolso parcial, além de conferir que todas as telas desenham sem erro.

```
controle-financeiro.html?teste
```

## O que ele não faz

Investimentos, metas de economia, juros do rotativo, importar extrato ou OFX, foto de comprovante, multiusuário e contabilidade de empresa. Tudo isso é de propósito — o app resolve o controle do dia a dia e para por aí.
