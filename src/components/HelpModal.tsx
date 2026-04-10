import { useLocation } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import {
  ChartBarIcon,
  ArrowsRightLeftIcon,
  BuildingLibraryIcon,
  TagIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  CalculatorIcon,
  LightBulbIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

type HelpSection = {
  icon: React.ReactNode
  title: string
  description: string
  tips: string[]
}

const helpContent: Record<string, HelpSection> = {
  '/dashboard': {
    icon: <ChartBarIcon className="h-8 w-8 text-blue-500" />,
    title: 'Dashboard',
    description:
      'Visão estratégica das suas finanças com indicadores, gráficos e resumos do período selecionado.',
    tips: [
      'Use os botões de período (7 dias, 30 dias, etc.) para filtrar os dados exibidos.',
      'Os cartões de KPI mostram receitas, despesas, saldo e taxa de poupança do período.',
      'O gráfico de pizza exibe a distribuição de gastos por categoria.',
      'O gráfico de linhas mostra a evolução mensal de receitas, despesas e saldo.',
      'Role para baixo para ver alertas ativos, insights e as últimas transações.',
    ],
  },
  '/transactions': {
    icon: <ArrowsRightLeftIcon className="h-8 w-8 text-green-500" />,
    title: 'Transações',
    description:
      'Registre e gerencie todas as suas movimentações financeiras — receitas e despesas.',
    tips: [
      'Clique em "Nova transação" para adicionar uma receita ou despesa.',
      'Use os filtros de data, tipo, categoria e conta para encontrar transações específicas.',
      'Clique no ícone de edição (lápis) para alterar os dados de uma transação.',
      'Clique no ícone de exclusão (lixo) para remover uma transação permanentemente.',
      'O saldo das contas é atualizado automaticamente a cada transação registrada.',
    ],
  },
  '/accounts': {
    icon: <BuildingLibraryIcon className="h-8 w-8 text-purple-500" />,
    title: 'Contas',
    description:
      'Gerencie suas contas bancárias, carteiras e cartões em um único lugar.',
    tips: [
      'Crie uma conta para cada banco, carteira digital ou cartão que você usa.',
      'O saldo exibido é calculado automaticamente com base nas transações registradas.',
      'Ao criar uma transação, vincule-a à conta correspondente para manter os saldos corretos.',
      'Você pode renomear uma conta a qualquer momento sem perder o histórico.',
      'Não é possível excluir uma conta que possui transações ou movimentações recorrentes.',
    ],
  },
  '/categories': {
    icon: <TagIcon className="h-8 w-8 text-orange-500" />,
    title: 'Categorias',
    description:
      'Organize suas transações com categorias personalizadas para ter relatórios mais precisos.',
    tips: [
      'Crie categorias para cada tipo de gasto ou receita que você tem.',
      'Categorias ajudam a identificar onde você está gastando mais.',
      'As categorias padrão do sistema (marcadas com "Padrão") não podem ser editadas ou excluídas.',
      'Ao excluir uma categoria personalizada, as transações vinculadas passam para a categoria padrão.',
      'Use nomes curtos e descritivos para facilitar a seleção ao criar transações.',
    ],
  },
  '/recurring': {
    icon: <ArrowPathIcon className="h-8 w-8 text-cyan-500" />,
    title: 'Recorrentes',
    description:
      'Configure movimentações que se repetem automaticamente, como assinaturas, salários e contas fixas.',
    tips: [
      'Defina a data de início e o sistema gerará as transações automaticamente nas datas de vencimento.',
      'Frequências disponíveis: diária, semanal, mensal e anual.',
      'As transações são criadas automaticamente todo dia à 01h e também ao iniciar o sistema.',
      'Se houver datas atrasadas, o sistema cria todas as ocorrências pendentes de uma vez.',
      'Você pode desativar uma recorrente sem excluí-la, preservando o histórico.',
    ],
  },
  '/reports': {
    icon: <DocumentChartBarIcon className="h-8 w-8 text-indigo-500" />,
    title: 'Relatórios',
    description:
      'Analise seu histórico financeiro com relatórios detalhados por período.',
    tips: [
      'Use os campos de data inicial e final para filtrar o período do relatório.',
      'O resumo no topo mostra totais de receitas, despesas, saldo e taxa de poupança.',
      'O gráfico de barras horizontais exibe seus gastos por categoria com percentuais.',
      'A tabela de evolução mensal permite comparar cada mês do ano selecionado.',
      'Meses sem movimentação aparecem com valores zerados na evolução.',
    ],
  },
  '/budgets': {
    icon: <CalculatorIcon className="h-8 w-8 text-emerald-500" />,
    title: 'Orçamentos',
    description:
      'Defina limites de gastos por categoria para controlar suas despesas mensais.',
    tips: [
      'Crie um orçamento informando categoria, mês, ano e o valor limite.',
      'O progresso é calculado automaticamente com base nas transações do período.',
      'Verde (Em dia): gastos abaixo de 80% do limite.',
      'Amarelo (Atenção): entre 80% e 100% — cuidado para não ultrapassar.',
      'Vermelho (Ultrapassado): limite excedido — revise seus gastos na categoria.',
      'Você pode ter orçamentos diferentes para o mesmo mês em categorias distintas.',
    ],
  },
  '/insights': {
    icon: <LightBulbIcon className="h-8 w-8 text-yellow-500" />,
    title: 'Insights',
    description:
      'Análises automáticas do seu comportamento financeiro geradas a partir dos seus dados.',
    tips: [
      'Selecione o mês e ano no topo para ver os insights daquele período.',
      'Categoria com mais gastos: identifica onde você está gastando mais.',
      'Comparação mensal: compara seus gastos com o mês anterior.',
      'Tendência de gastos: alerta se uma categoria teve aumento significativo.',
      'Taxa de poupança: quanto da sua renda foi poupada no mês.',
      'Insights de orçamento: informa categorias próximas do limite ou já ultrapassadas.',
    ],
  },
  '/alerts': {
    icon: <BellIcon className="h-8 w-8 text-red-500" />,
    title: 'Alertas',
    description:
      'Notificações automáticas sobre eventos importantes na sua saúde financeira.',
    tips: [
      'Selecione o mês e ano para ver os alertas daquele período.',
      'Vermelho (Perigo): situação crítica — orçamento ultrapassado ou saldo negativo.',
      'Amarelo (Atenção): aviso — orçamento próximo do limite ou gastos elevados.',
      'Azul (Informação): dados gerais sobre receitas, despesas e saldo do mês.',
      'Os alertas são gerados automaticamente e não podem ser criados manualmente.',
      'O sino na barra superior indica quantos alertas existem no mês atual.',
    ],
  },
}

const defaultHelp: HelpSection = {
  icon: <ChartBarIcon className="h-8 w-8 text-gray-400" />,
  title: 'Ajuda',
  description: 'Selecione uma tela no menu lateral para ver informações específicas.',
  tips: [
    'Navegue pelas seções usando o menu lateral.',
    'Cada tela possui seu próprio guia de ajuda.',
  ],
}

type HelpModalProps = {
  open: boolean
  onClose: () => void
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  const location = useLocation()
  const content = helpContent[location.pathname] ?? defaultHelp

  return (
    <Modal open={open} onClose={onClose} title="Como usar esta tela" size="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">{content.icon}</div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {content.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {content.description}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            Dicas de uso
          </p>
          <ul className="space-y-2">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  )
}
