//Как осуществить работу с web3 провайдером на сервере
//const Web3 = require('web3');
const Eth = require('web3-eth');
const ABI = require('./contract/JSON/ABI.json');
const addressContract = process.env['AddressContract'];

var eth = new Eth(Eth.givenProvider || 'http://127.0.0.1:7545');
//console.log(eth.providers);
//console.log(eth.currentProvider);
const contract = new eth.Contract(ABI,addressContract);
const register = async (req,res) =>
{
    const 
    {
        name, 
        surname,
        lastname,
        addressOfResidence,
        addressRegistered,
        insurancePolicy,
        bdate,
        metaAccount: meta
    } = req.body;
    console.log(req.body);
    
    let dataRegistered = new Array();
    for (let key in req.body)
    {
        if(!req.body.hasOwnProperty(key)) continue;
        if(key != "meta")
            dataRegistered.push(req.body[key]);
    }
    console.log(dataRegistered);

    const account = req.body["meta"];
    console.log(account);

    const privateKey = "30a0db45f3de32c354364a486165c91a342b574172c85ee35bd77323b7a3dfb9";
    
    const tx = 
    {
        from: account,
        to: addressContract,
        gas:500000,
        data: await contract.methods.createPatient(dataRegistered).encodeABI()

    }
    const signTX = await eth.accounts.signTransaction(tx,privateKey);

    await eth.sendSignedTransaction(signTX.rawTransaction)
    .on("receipt",function(receipt)
    {
        console.log(receipt);
        res.status(200).json({status:"success", success:"Well done!Reg! "});
    }).on('error', (error) =>
    {
        console.log(error);
        res.status(300).json({status:"bad"});
    });
    
}

module.exports = register;