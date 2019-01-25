import test from 'ava'
import { matchWithSchema } from '../lib/spec-schema'
import enumSchema from './enumSchema'

test(`matchWithSchema doesn't match different enum (fixed)`, t => {
  const body = {
    firstName: 'Bray',
    lastName: 'Wicklow',
    email: 'bray@test.com',
    password: 'Ou812!'
  }
  const { match, errors } = matchWithSchema(enumSchema, body)
  t.false(match)
  t.is(errors[0].dataPath, '.password')
})
