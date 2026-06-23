export type Route = 'home' | 'chat' | 'business' | 'admin' | 'profile'

export function getRoute(): Route {
  const hash = window.location.hash.replace('#/', '')
  const valid: Route[] = ['home', 'chat', 'business', 'admin', 'profile']
  return valid.includes(hash as Route) ? (hash as Route) : 'home'
}

export function navigate(route: Route) {
  window.location.hash = `/${route}`
}
