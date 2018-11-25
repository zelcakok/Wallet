import axios from 'axios';
import https from 'https';

class API {
  static BLOCKCHAIN_API_PORT = 5002;
  static REQUEST_AGENT = new https.Agent({ rejectUnauthorized: false });

  static async profile(){
    var url = API.getIPAddress()+"/profile";
    return axios.get(url, { httpsAgent: API.REQUEST_AGENT });
  }

  static async verify(digest){
    var url = API.getIPAddress()+"/verify?digest="+digest;
    return axios.get(url, { httpsAgent: API.REQUEST_AGENT });
  }

  static async payment(params){
    var query = "digest="+params.digest;
    query += "&payeeAddr="+params.payeeAddr;
    query += "&amount="+params.amount;
    var url = API.getIPAddress()+"/payment?"+query;
    return axios.get(url, { httpsAgent: API.REQUEST_AGENT });
  }

  static getIPAddress(){
    var urlTokens = window.location.href.split(":");
    return [urlTokens[0], urlTokens[1], "5002"].join(":");
  }
}
export default API;
