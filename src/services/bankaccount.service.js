import LocalSource from "@/services/localsource.service.js";

async function shopLoginFromLocalSource(data) {
  // récupération auprès de la source locale
  return LocalSource.shopLogin(data)
}


async function shopLogin(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await shopLoginFromLocalSource(data)
  }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'  }
  }
  return response
}


async function getAccountAmountFromLocalSource(number){
  return LocalSource.getAccountAmount(number)
}


async function getAccountAmount(number) {
    let response = null;

    response = await getAccountAmountFromLocalSource(number)
  
    if (response === null) return {error: 1, status: 404, data: 'aucun numéro fourni'}
  
    return response
}


async function getAccountTransactionsFromLocalSource(number){
  return LocalSource.getAccountTransactions(number)
}


async function getAccountTransactions(number) {
    let response = null;

    response = await getAccountTransactionsFromLocalSource(number)
  
    if (response === null) return {error: 1, status: 404, data: 'aucun numéro fourni'}
  
    return response
}


export default {
  shopLogin,
  getAccountAmount,
  getAccountTransactions
}