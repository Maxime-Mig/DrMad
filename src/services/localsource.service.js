import { items, shopusers, bankaccounts, transactions } from '@/datasource/data.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

function shopLogin(data) {
  if ((!data.login) || (!data.password)) return {error: 1, status: 404, data: 'aucun login/pass fourni'}

  let user = shopusers.find(e => e.login === data.login)
  if (!user) return {error: 1, status: 404, data: 'login/pass incorrect'}

  // Vérification du mot de passe avec bcryptjs
  if (!bcrypt.compareSync(data.password, user.password)) {
    return {error: 1, status: 404, data: 'login/pass incorrect'}
  }

  if (!user.session) {
    user.session = uuidv4()
  }

  let u = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session
  }
  return {error: 0, status: 200, data: u}
}

function getAllViruses() {
  return {error: 0, data: items}
}


function getAccountAmount(number) {
  if (!number) return {error: 1, status: 404, data: 'aucun numéro fourni'}
  let bankaccount = bankaccounts.find(e => e.number === number) 
  if (!bankaccount) return {error: 1, status: 404, data: 'aucun compte avec ce numéro'}
  return {error: 0, status: 200, data: bankaccount.amount}
}

function getAccountTransactions(number) {
  if (!number) return {error: 1, status: 404, data: 'aucun numéro fourni'}
  let bankaccount = bankaccounts.find(e => e.number === number)
  if (!bankaccount) return {error: 1, status: 404, data: 'aucun compte avec ce numéro'}
  let accountTransactions = transactions.filter(t => t.account === bankaccount._id)
  return {error: 0, status: 200, data: accountTransactions}
}

export default{
  shopLogin,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
}