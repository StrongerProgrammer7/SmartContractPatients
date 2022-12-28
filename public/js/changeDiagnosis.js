var accountUser;
const month = new Date().getUTCMonth() + 1; //months from 1-12
const day = new Date().getUTCDate();
const year = new Date().getUTCFullYear();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


window.addEventListener("DOMContentLoaded",async() =>
{
    if(typeof window.ethereum !== 'undefined')
    {
        if(window.ethereum.isMetaMask)
            console.log("Using Metamask's web3 provider");
        window.web3 = await new Web3(window.ethereum);

        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        accountUser = accounts[0];
        document.getElementById("meta").value = accountUser;       
    }else
    {
        console.warn('No web3 detected. Falling back to http://localhost:8545.');
        web3 = await new Web3("ws://localhost:8545");
        
        success.style.display = "none";
        error.style.display = "block";
        error.innerText = 'No web3 detected. Falling back to http://localhost:8545.';
        document.querySelector('#btn-open-form').disabled = true;
    }    
    document.getElementById('dataDiags').innerHTML = day + "/" + month + "/" + year;
    
    if(urlParams !== null && urlParams !== undefined)
    {
        const numberDiag = 

        document.getElementById("diagnos").value = urlParams.get('name');
        document.getElementById("infoDiagnos").value = urlParams.get('more');
        document.getElementById("treatment").value =  urlParams.get('treat');
        document.getElementById("numberDiagnos").value =  urlParams.get('id');
    }
});

document.getElementById("home").addEventListener("click", function()
{
    window.open("/",'_self');
});


formElem.onsubmit = async function(e)
{
    e.preventDefault();
    error.style.display = "none";
    success.style.display = "none";
    document.getElementById("statusIll").style = "border: none";
    document.getElementById("patient").style = "border: none";
    document.getElementById("numberDiagnos").style = "border: none";

    const diagnosData = 
    {
        diag: diagnos.value,
        infoDiag: infoDiagnos.value,
        medicine: treatment.value,
    };

    if(checkData(diagnosData)==true)
    {
        let patientAccount = patient.value;
        let statusPat = false;
        if(statusIll.value == "Cured")
            statusPat = true;
    
        try 
        {
            window.contract = await new window.web3.eth.Contract(ABI,addressContract);
        } catch (error)
        {
            errorMessage('There is problem with contract, check console!',"block");
            console.log(error);
        }
        let data = new Array();
        
        for (let key in diagnosData)
        {
            if(!diagnosData.hasOwnProperty(key)) 
                continue;
            data.push(diagnosData[key]);
        }
       
        data.push(day+"-"+month+"-"+year);
        console.log(data);

        try 
        {
            await window.contract.methods.changeStatusIllnes(patientAccount,numberDiagnos.value,data,statusPat).send({from :accountUser});

            success.style.display = "block";
            success.innerText = 'Great!';

            window.contract.getPastEvents("allEvents",
            {                               
                fromBlock: 0,     
                toBlock: 'latest'     
            }).then((events) => console.log(events))
            .catch((err) => console.log(err));
        } catch (error) 
        {
            console.log(error);   
            errorMessage('There is problem with contract, check console!!!',"block");
        }
    }else
    {
        errorMessage('There are fields empty or incorrectly filled in!!!',"block");
    }
};

function checkData(data)
{
    console.log(data);
    
    if(patient.value == "")
    {
        document.getElementById("patient").style = "border: thick double red;";
        errorMessage("Empty fields patient!");
        return false;
    }
    if((statusIll.value != "Ill") && (statusIll.value != "Cured") )
    {
        document.getElementById("statusIll").style = "border: thick double red;";
        errorMessage("There is problem with status only Ill or Cured!");
        return false;
    }

    let notOnlyWord = new RegExp("^.*[^A-zА-яЁё].*$");
    if(notOnlyWord.test(statusIll.value))
    {
        document.getElementById("statusIll").style = "border: thick double red;";
        errorMessage("There is problem with status only word! Ill/Cured!","block");
        console.log("status");
        return false; 
    }

    let notOnlyDigit = new RegExp("^.*[^0-9].*$");
    if(notOnlyDigit.test(numberDiagnos.value))
    {
        console.log("digit");
        document.getElementById("numberDiagnos").style = "border: thick double red;";
        errorMessage('There is problem with numberDiag(only digit)!',"block");
        return false; 
    }

    return true;
}

function errorMessage(message, displayerr)
{
    error.style.display = displayerr;
    error.innerText = message;
}