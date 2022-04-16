import main from './main'
import auth from './auth'
import error404 from './error'

const routes = [
  ...main,
  ...auth,
  ...error404
]

export default routes
