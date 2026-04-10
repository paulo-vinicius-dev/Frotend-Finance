export type TourStep = {
  element: string  // CSS selector
  title: string
  intro: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const tourSteps: Record<string, TourStep[]> = {
  '/dashboard': [
    {
      element: '[data-tour="dashboard-hero"]',
      title: 'Dashboard Estratégico',
      intro: 'Bem-vindo ao seu painel financeiro! Aqui você tem uma visão completa das suas finanças com indicadores, gráficos e resumos do período selecionado.',
      position: 'right',
    },
    {
      element: '[data-tour="dashboard-filters"]',
      title: 'Filtro de Período',
      intro: 'Selecione o período que deseja analisar. Use os atalhos rápidos (7 dias, 30 dias, mês atual…) ou defina um intervalo personalizado de datas.',
      position: 'bottom',
    },
    {
      element: '[data-tour="dashboard-kpis"]',
      title: 'Indicadores Financeiros',
      intro: 'Estes cartões mostram suas receitas, despesas, saldo do período, taxa de economia e o percentual de uso dos seus orçamentos.',
    },
    {
      element: '[data-tour="dashboard-charts"]',
      title: 'Gráficos',
      intro: 'Visualize a distribuição de gastos por categoria (pizza) e a evolução mensal de receitas, despesas e saldo ao longo do tempo (linhas).',
    },
    {
      element: '[data-tour="dashboard-bottom"]',
      title: 'Resumo Geral',
      intro: 'Aqui você encontra um resumo dos seus orçamentos, os alertas financeiros mais recentes, insights automáticos e suas últimas transações.',
    },
  ],

  '/transactions': [
    {
      element: '[data-tour="transactions-header"]',
      title: 'Transações',
      intro: 'Esta é a tela de transações. Aqui você registra e gerencia todas as suas entradas e saídas financeiras.',
    },
    {
      element: '[data-tour="transactions-new-btn"]',
      title: 'Nova Transação',
      intro: 'Clique aqui para registrar uma nova receita ou despesa. Informe a conta, categoria, valor, data e descrição.',
    },
    {
      element: '[data-tour="transactions-filters"]',
      title: 'Filtros',
      intro: 'Use os filtros para encontrar transações específicas por data, tipo (entrada/saída), categoria ou conta bancária.',
    },
    {
      element: '[data-tour="transactions-list"]',
      title: 'Lista de Transações',
      intro: 'Aqui aparecem todas as suas transações. Use os ícones de lápis para editar e lixeira para excluir cada uma delas.',
    },
  ],

  '/accounts': [
    {
      element: '[data-tour="accounts-header"]',
      title: 'Contas',
      intro: 'Gerencie suas contas bancárias, carteiras digitais e cartões. Cada conta mantém seu próprio saldo calculado a partir das transações.',
    },
    {
      element: '[data-tour="accounts-new-btn"]',
      title: 'Nova Conta',
      intro: 'Crie uma conta para cada banco ou carteira que você usa. É recomendado ter uma conta por instituição para melhor controle.',
    },
    {
      element: '[data-tour="accounts-list"]',
      title: 'Suas Contas',
      intro: 'O saldo de cada conta é atualizado automaticamente conforme você registra transações. Você pode editar ou excluir contas que não possuem movimentações.',
    },
  ],

  '/categories': [
    {
      element: '[data-tour="categories-header"]',
      title: 'Categorias',
      intro: 'Organize suas transações com categorias personalizadas. Categorias bem definidas geram relatórios mais precisos.',
    },
    {
      element: '[data-tour="categories-new-btn"]',
      title: 'Nova Categoria',
      intro: 'Crie categorias para classificar seus gastos e receitas. Exemplos: Alimentação, Transporte, Salário, Freelance.',
    },
    {
      element: '[data-tour="categories-list"]',
      title: 'Suas Categorias',
      intro: 'Categorias marcadas com o ícone de cadeado são padrão do sistema e não podem ser excluídas. As categorias personalizadas podem ser editadas e removidas.',
    },
  ],

  '/recurring': [
    {
      element: '[data-tour="recurring-header"]',
      title: 'Movimentações Recorrentes',
      intro: 'Configure aqui transações que se repetem automaticamente: assinaturas, salário, aluguel, contas mensais e muito mais.',
    },
    {
      element: '[data-tour="recurring-new-btn"]',
      title: 'Nova Recorrência',
      intro: 'Crie uma nova movimentação recorrente informando conta, categoria, valor, frequência e data de início.',
    },
    {
      element: '[data-tour="recurring-list"]',
      title: 'Recorrências Ativas',
      intro: 'O sistema gera as transações automaticamente nas datas de vencimento. Se houver datas atrasadas, todas são criadas de uma vez na próxima execução.',
    },
  ],

  '/reports': [
    {
      element: '[data-tour="reports-filters"]',
      title: 'Filtro de Período',
      intro: 'Defina o período do relatório selecionando uma data inicial e final. Deixe em branco para ver todos os registros.',
    },
    {
      element: '[data-tour="reports-summary"]',
      title: 'Resumo Financeiro',
      intro: 'Totais consolidados do período: receitas, despesas, saldo líquido e taxa de poupança (quanto da renda foi economizada).',
    },
    {
      element: '[data-tour="reports-by-category"]',
      title: 'Gastos por Categoria',
      intro: 'Gráfico de barras mostrando quanto foi gasto em cada categoria, com percentuais em relação ao total de despesas.',
    },
    {
      element: '[data-tour="reports-monthly"]',
      title: 'Evolução Mensal',
      intro: 'Tabela comparativa mês a mês com receitas, despesas e saldo. Use o seletor de ano para comparar períodos diferentes.',
    },
  ],

  '/budgets': [
    {
      element: '[data-tour="budgets-header"]',
      title: 'Orçamentos',
      intro: 'Defina limites de gastos por categoria para controlar suas despesas mensais. O sistema acompanha o progresso automaticamente.',
    },
    {
      element: '[data-tour="budgets-new-btn"]',
      title: 'Novo Orçamento',
      intro: 'Crie um orçamento selecionando a categoria, o mês, o ano e o valor limite. Você pode ter múltiplos orçamentos no mesmo mês.',
    },
    {
      element: '[data-tour="budgets-period"]',
      title: 'Período',
      intro: 'Selecione o mês e ano para visualizar os orçamentos daquele período.',
    },
    {
      element: '[data-tour="budgets-list"]',
      title: 'Seus Orçamentos',
      intro: 'Verde = dentro do limite · Amarelo = atenção (acima de 80%) · Vermelho = limite ultrapassado. O progresso é atualizado em tempo real com as suas transações.',
    },
  ],

  '/insights': [
    {
      element: '[data-tour="insights-header"]',
      title: 'Insights Financeiros',
      intro: 'Análises automáticas geradas a partir dos seus dados. Selecione o mês e ano para ver os insights daquele período.',
    },
    {
      element: '[data-tour="insights-list"]',
      title: 'Seus Insights',
      intro: 'Cada card traz uma análise específica: maior categoria de gasto, comparação com o mês anterior, tendências de gastos, taxa de poupança e status dos orçamentos.',
    },
  ],

  '/alerts': [
    {
      element: '[data-tour="alerts-header"]',
      title: 'Alertas Financeiros',
      intro: 'Notificações automáticas sobre sua saúde financeira. Selecione o mês e ano para consultar o histórico de alertas.',
    },
    {
      element: '[data-tour="alerts-list"]',
      title: 'Seus Alertas',
      intro: 'Os alertas são ordenados por gravidade: Vermelho (perigo) → Amarelo (atenção) → Azul (informação). Eles são gerados automaticamente pelo sistema, não podem ser criados manualmente.',
    },
  ],
}
