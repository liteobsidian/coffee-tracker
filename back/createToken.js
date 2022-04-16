import jwt from 'jsonwebtoken'
import { SECRET_KEY } from './src/config'

const token = jwt.sign(
  {
    id: 1,
    name: 'Admin',
    type: 'admin',
    organization: null
  },
  SECRET_KEY,
  {
    expiresIn: '100h'
  }
)
console.log(token)
