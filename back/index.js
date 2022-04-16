import log from './src/logger'
import { PORT } from './src/config'
import app from './src/app'
import { version } from './package.json'

app.listen(PORT, () => {
  log.info(`Сервер v${version} запущен на порту ${PORT}`)
})
