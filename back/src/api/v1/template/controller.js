'use strict'

import { schemaDB } from './db'

export const schema = async data => await schemaDB(data)
