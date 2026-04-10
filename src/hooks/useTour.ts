import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import introJs from 'intro.js'
import 'intro.js/introjs.css'
import { tourSteps } from '@/lib/tourSteps'

const TOUR_ROUTES = [
  '/dashboard',
  '/transactions',
  '/accounts',
  '/categories',
  '/recurring',
  '/reports',
  '/budgets',
  '/insights',
  '/alerts',
]

export function useTour() {
  const navigate = useNavigate()

  const startTour = useCallback(() => {
    function runPageTour(routeIndex: number) {
      if (routeIndex >= TOUR_ROUTES.length) return

      const route = TOUR_ROUTES[routeIndex]
      const steps = tourSteps[route]

      if (!steps?.length) {
        if (routeIndex + 1 < TOUR_ROUTES.length) {
          navigate(TOUR_ROUTES[routeIndex + 1])
          setTimeout(() => runPageTour(routeIndex + 1), 500)
        }
        return
      }

      const resolvedSteps = steps
        .map((step) => {
          const el = document.querySelector(step.element)
          if (!el) return null
          return {
            element: el as HTMLElement,
            title: step.title,
            intro: step.intro,
            position: step.position,
          }
        })
        .filter(Boolean)

      if (resolvedSteps.length === 0) {
        if (routeIndex + 1 < TOUR_ROUTES.length) {
          navigate(TOUR_ROUTES[routeIndex + 1])
          setTimeout(() => runPageTour(routeIndex + 1), 500)
        }
        return
      }

      const isLastRoute = routeIndex + 1 >= TOUR_ROUTES.length

      introJs()
        .setOptions({
          steps: resolvedSteps as Parameters<ReturnType<typeof introJs>['setOptions']>[0]['steps'],
          nextLabel: 'Próximo →',
          prevLabel: '← Anterior',
          doneLabel: isLastRoute ? 'Concluir tour' : 'Próxima tela →',
          skipLabel: 'Encerrar tour',
          showBullets: true,
          showProgress: true,
          exitOnOverlayClick: false,
          scrollToElement: true,
          disableInteraction: false,
          overlayOpacity: 0.5,
          tooltipClass: 'finance-tour-tooltip',
          highlightClass: 'finance-tour-highlight',
        })
        .oncomplete(() => {
          if (!isLastRoute) {
            navigate(TOUR_ROUTES[routeIndex + 1])
            setTimeout(() => runPageTour(routeIndex + 1), 500)
          }
        })
        .start()
    }

    navigate(TOUR_ROUTES[0])
    setTimeout(() => runPageTour(0), 500)
  }, [navigate])

  return { startTour }
}
