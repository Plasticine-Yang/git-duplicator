import { duplicate } from '@git-duplicator/core'
import { resolve } from 'path'

const dest = resolve(__dirname, 'target')

duplicate('Plasticine-Yang/templates', dest, { overwrite: true })
