var Gerencianet = require('gn-api-sdk-node');

var options = {
    // PRODUÇÃO = false
    // HOMOLOGAÇÃO = true
    sandbox: true,
    client_id: 'Client_Id_f8a5f60608952f0e4e34924aa01525e25f1971f2',
    client_secret: 'Client_Secret_2f92053c54c942623a6380a0fca485f2b829979b',
    pix_cert: './homologacao-431013-Testes-Brik.p12',
};

var gerencianet = new Gerencianet(options);

var chargeInput = {
    items: [{
      name: 'Product A',
      value: 2000,
      amount: 1
    }]
  }
  
  gerencianet.createCharge({}, chargeInput)
    .then((resposta) => {
          console.log(resposta)
      })
      .catch((error) => {
          console.log(error);
      })