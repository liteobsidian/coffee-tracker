import passport from 'passport'
import PassportJWT from 'passport-jwt'
import { SECRET_KEY } from '@config'
import log from './logger'
import db from './db'

const ExtractJWT = PassportJWT.ExtractJwt
const StrategyJWT = PassportJWT.Strategy

const optionsUser = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}

export const authUser = passport.authenticate('user', { session: false })


export const isAdmin = (req, res, next) => {
  if (!req.user) return next(new Error('Нарушение прав доступа. Пользователь не авторизован'))
  if (req.user.type !== 'admin') return next(new Error('Нарушение прав доступа. Пользователь не является локальным администратором'))
  next()
}

passport.use('user',
  new StrategyJWT(optionsUser, async ({ id, name }, done) => {
    try {
      const { rowCount, rows } = await db.query(`
        SELECT * FROM auth_users AS a
        WHERE a.name =$1 AND a.id= $2
      `,
      [
        name, id
      ])
      if (!rowCount) {
        done(null, false)
      } else {
        const { id, name, type, organization_id: organization } = rows[0]
        done(null, { id, name, type, organization })
      }
    } catch (error) {
      log.error(error)
      return done(error, false)
    }
  })
)

export default passport
