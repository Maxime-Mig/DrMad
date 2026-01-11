import {
  items,
  shopusers,
  bankaccounts,
  transactions,
} from "@/datasource/data.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

function shopLogin(data) {
  if (!data.login || !data.password)
    return { error: 1, status: 404, data: "aucun login/pass fourni" };

  let user = shopusers.find((e) => e.login === data.login);
  if (!user) return { error: 1, status: 404, data: "login/pass incorrect" };

  // Vérification du mot de passe avec bcryptjs
  if (!bcrypt.compareSync(data.password, user.password)) {
    return { error: 1, status: 404, data: "login/pass incorrect" };
  }

  if (!user.session) {
    user.session = uuidv4();
  }

  let u = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session,
  };
  return { error: 0, status: 200, data: u };
}

function getAllViruses() {
  return { error: 0, data: items };
}

function getAccount(number) {
  if (!number) {
    return { error: 1, status: 404, data: "aucun numéro fourni" };
  }

  let num = number.number || number;
  let bankaccount = bankaccounts.find((e) => e.number === num);
  if (!bankaccount){
    return { error: 1, status: 404, data: "aucun compte avec ce numéro" };
  }

  return {
    error: 0,
    status: 200,
    data: JSON.parse(JSON.stringify(bankaccount)),
  };
}

function getAccountAmount(number) {
  if (!number) return { error: 1, status: 404, data: "aucun numéro fourni" };
  let bankaccount = bankaccounts.find((e) => e.number === number);
  if (!bankaccount)
    return { error: 1, status: 404, data: "aucun compte avec ce numéro" };
  return { error: 0, status: 200, data: bankaccount.amount };
}

function getAccountTransactions(number) {
  if (!number) return { error: 1, status: 404, data: "aucun numéro fourni" };
  let bankaccount = bankaccounts.find((e) => e.number === number);
  if (!bankaccount)
    return { error: 1, status: 404, data: "aucun compte avec ce numéro" };
  let accountTransactions = transactions.filter(
    (t) => t.account === bankaccount._id
  );
  return { error: 0, status: 200, data: accountTransactions };
}

function getBasket(userId) {
  let user = shopusers.find((u) => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "utilisateur inconnu" };

  if (!user.basket) {
    user.basket = { items: [] };
  }

  let basket = JSON.parse(JSON.stringify(user.basket));
  return { error: 0, status: 200, data: basket };
}

function updateBasket(userId, basket) {
  let user = shopusers.find((u) => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "utilisateur inconnu" };

  user.basket = JSON.parse(JSON.stringify(basket));
  return { error: 0, status: 200, data: user.basket };
}

function orderBasket(userId, basket) {
  let user = shopusers.find((u) => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "utilisateur inconnu" };

  let orderItems = [];
  let total = 0;

  for (let basketItem of basket.items) {
    let item = items.find((i) => i._id === basketItem.item);
    if (item) {
      let price = item.price * basketItem.amount;
      let discount = 0;

      if (item.promotion) {
        let applicablePromo = item.promotion
          .filter((p) => basketItem.amount >= p.amount)
          .sort((a, b) => b.amount - a.amount)[0];

        if (applicablePromo) {
          discount = applicablePromo.discount;
        }
      }

      total += price * (1 - discount / 100);

      orderItems.push({
        item: item,
        amount: basketItem.amount,
      });
    }
  }

  let order = {
    items: orderItems,
    date: new Date(),
    total: total,
    status: "waiting_payment",
    uuid: uuidv4(),
  };

  if (!user.orders) user.orders = [];
  user.orders.push(order);

  return { error: 0, status: 200, data: order.uuid };
}

function getOrder(userId, uuid) {
  let user = shopusers.find((u) => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "utilisateur inconnu" };

  let order = user.orders.find((o) => o.uuid === uuid);
  if (!order) return { error: 1, status: 404, data: "commande inconnue" };

  return { error: 0, status: 200, data: JSON.parse(JSON.stringify(order)) };
}

function payOrder(userId, uuid, transactionUuid) {
  let user = shopusers.find((u) => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "utilisateur inconnu" };

  let order = user.orders.find((o) => o.uuid === uuid);
  if (!order) return { error: 1, status: 404, data: "commande inconnue" };

  // Vérification de la transaction bancaire
  if (transactionUuid) {
    let transaction = transactions.find((t) => t.uuid === transactionUuid);
    if (!transaction)
      return { error: 1, status: 404, data: "transaction inconnue" };

    if (Math.abs(transaction.amount) !== order.total)
      return { error: 1, status: 404, data: "montant transaction incorrect" };

    if (transaction.destination !== "65d721c44399ae9c8321832c")
      return { error: 1, status: 404, data: "destinataire incorrect" };
  }

  order.status = "finalized";
  return { error: 0, status: 200, data: order.uuid };
}

function createWithdraw(data) {
  let account = bankaccounts.find((a) => a._id === data.idAccount);
  if (!account) return { error: 1, status: 404, data: "id de compte invalide" };

  let amount = parseFloat(data.amount);

  let transaction = {
    uuid: uuidv4(),
    amount: -amount,
    date: { $date: new Date() },
    account: account._id,
  };
  transactions.push(transaction);

  account.amount -= amount;

  return {
    error: 0,
    status: 200,
    data: { uuid: transaction.uuid, amount: account.amount },
  };
}

function createPayment(data) {
  let account = bankaccounts.find((a) => a._id === data.idAccount);
  if (!account) return { error: 1, status: 404, data: "id de compte invalide" };

  let destAccount = bankaccounts.find((a) => a.number === data.destNumber);
  if (!destAccount)
    return { error: 1, status: 404, data: "compte destinataire inexistant" };

  let amount = parseFloat(data.amount);

  // Debit
  let transactionDebit = {
    uuid: uuidv4(),
    amount: -amount,
    date: { $date: new Date() },
    account: account._id,
    destination: destAccount._id,
  };
  transactions.push(transactionDebit);
  account.amount -= amount;

  // Credit
  let transactionCredit = {
    uuid: uuidv4(), 
    amount: amount,
    date: transactionDebit.date, 
    account: destAccount._id,
  };
  transactions.push(transactionCredit);
  destAccount.amount += amount;

  return {
    error: 0,
    status: 200,
    data: { uuid: transactionDebit.uuid, amount: account.amount },
  };
}

function getAllOrders(userId) {
  let user = shopusers.find((u) => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "utilisateur inconnu" };

  let orders = user.orders || [];
  return { error: 0, status: 200, data: JSON.parse(JSON.stringify(orders)) };
}

function cancelOrder(userId, uuid) {
  let user = shopusers.find((u) => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "utilisateur inconnu" };

  let order = user.orders.find((o) => o.uuid === uuid);
  if (!order) return { error: 1, status: 404, data: "commande inconnue" };

  order.status = "cancelled";
  return { error: 0, status: 200, data: order.uuid };
}

export default {
  shopLogin,
  getAllViruses,
  getAccount,
  getAccountAmount,
  getAccountTransactions,
  getBasket,
  updateBasket,
  orderBasket,
  getOrder,
  payOrder,
  getAllOrders,
  cancelOrder,
  createWithdraw,
  createPayment,
};
