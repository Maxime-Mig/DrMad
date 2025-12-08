import LocalSource from "@/services/localsource.service.js";
import bcrypt from "bcryptjs";

async function shopLoginFromLocalSource(data) {
  // récupération auprès de la source locale
  // LocalSource.shopLogin gère déjà l'authentification et renvoie le user ou une erreur
  return await LocalSource.shopLogin(data);
}
/*
async function shopLoginFromAPI(data) {
  // a écrire quand l'API est fonctionnelle
  return {}
}
 */

async function getAllVirusesFromLocalSource() {
  // récupération auprès de la source locale
  return LocalSource.getAllViruses();
}

/*
async function getAllVirusesFromAPI() {
  // a écrire quand l'API est fonctionnelle
  return {}
}
*/

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

async function getAllViruses() {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await getAllVirusesFromLocalSource();
  } catch (err) {
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    response = {
      error: 1,
      status: 404,
      data: "erreur réseau, impossible de récupérer la liste des viruses",
    };
  }
  return response;
}

async function getBasket(userId) {
  let response = null;
  try {
    response = await LocalSource.getBasket(userId);
  } catch (err) {
    response = { error: 1, status: 404, data: "erreur réseau" };
  }
  return response;
}

async function updateBasket(userId, basket) {
  let response = null;
  try {
    response = await LocalSource.updateBasket(userId, basket);
  } catch (err) {
    response = { error: 1, status: 404, data: "erreur réseau" };
  }
  return response;
}

export default {
  shopLogin,
  getAllViruses,
  getBasket,
  updateBasket,
};
