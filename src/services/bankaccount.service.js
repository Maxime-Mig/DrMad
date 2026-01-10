import LocalSource from "@/services/localsource.service.js";

async function shopLoginFromLocalSource(data) {
  // récupération auprès de la source locale
  return LocalSource.shopLogin(data);
}

async function shopLogin(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await shopLoginFromLocalSource(data);
  } catch (err) {
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    response = {
      error: 1,
      status: 404,
      data: "erreur réseau, impossible de se loguer",
    };
  }
  return response;
}

async function getAccountFromLocalSource(data) {
  return LocalSource.getAccount(data);
}

async function getAccount(data) {
  // data = { number: "..." }
  return await getAccountFromLocalSource(data);
}

async function getAccountAmountFromLocalSource(number) {
  return LocalSource.getAccountAmount(number);
}

async function getAccountAmount(number) {
  let response = null;

  response = await getAccountAmountFromLocalSource(number);

  if (response === null)
    return { error: 1, status: 404, data: "aucun numéro fourni" };

  return response;
}

async function getAccountTransactionsFromLocalSource(number) {
  return LocalSource.getAccountTransactions(number);
}

async function getAccountTransactions(number) {
  let response = null;

  response = await getAccountTransactionsFromLocalSource(number);

  if (response === null)
    return { error: 1, status: 404, data: "aucun numéro fourni" };

  return response;
}

async function createWithdrawFromLocalSource(data) {
  return LocalSource.createWithdraw(data);
}

async function createWithdraw(data) {
  // data: { amount, idAccount }
  return await createWithdrawFromLocalSource(data);
}

async function createPaymentFromLocalSource(data) {
  return LocalSource.createPayment(data);
}

async function createPayment(data) {
  // data: { amount, idAccount, destNumber }
  return await createPaymentFromLocalSource(data);
}

export default {
  shopLogin,
  getAccount,
  getAccountAmount,
  getAccountTransactions,
  createWithdraw,
  createPayment,
};
