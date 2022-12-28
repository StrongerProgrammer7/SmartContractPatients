var accountUser;
var styleStatusIll;
const month = new Date().getUTCMonth() + 1; //months from 1-12
const day = new Date().getUTCDate();
const year = new Date().getUTCFullYear();

window.addEventListener("DOMContentLoaded",async() =>
{  
    styleStatusIll = document.getElementById("statusIll").style;
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
});

document.getElementById("home").addEventListener("click", function()
{
    window.open("/",'_self');
});


formElem.onsubmit = async function(e)
{
    e.preventDefault();
    errorMessage("","none");
    success.style.display = "none";
    document.getElementById("statusIll").style = "border:none;";

    let ipfsLinks = "";

    if(document.getElementById("files").files.length != 0)
    {
        try 
        {
            const dataHash = await fetch("/api/upload",
            {
                method: 'POST',
                enctype:"multipart/form-data",
                body: new FormData(formElem)
            }).then(hashFiles => hashFiles.json());
           
            var dataFIle = new Map(Object.entries(JSON.parse(dataHash)));
            console.log(dataFIle);
    
            for(const [key,value] of dataFIle)
                ipfsLinks += key + ":" + value + "\n";
        } catch (error) 
        {
            errorMessage("There is problem with download links!! Check console!","block");
        }
        
    }
    const diagnosData = 
    {
        diag: diagnos.value,
        doc: NS_doctor.value,
        infoDiag: infoDiagnos.value,
        medicine: treatment.value,
        status: statusIll.value
    };
    if(checkData(diagnosData)==true)
    {
        console.log(patient.value);
        let patientAccount = patient.value;
        try 
        {
            window.contract = await new window.web3.eth.Contract(ABI,addressContract);
        } catch (error)
        {
            errorMessage("There is problem with contract, check console!","block");
            console.log(error);
        }
        
        let data = new Array();
        
        for (let key in diagnosData)
        {
            if(!diagnosData.hasOwnProperty(key)) 
                continue;
            data.push(diagnosData[key]);
        }

        data.push(ipfsLinks);
        data.push(day+"-"+month+"-"+year);
        //console.log(data);

        try 
        {
            await window.contract.methods.setDiagnosis(patientAccount,data).send({from :accountUser});
            success.style.display = "block";
            error.style.display = "none";
            success.innerText = 'Great!';
           
            window.contract.getPastEvents("allEvents",
            {                               
                fromBlock: 'latest',     
                toBlock: 'latest'     
            }).then((events) => console.log(events))
            .catch((err) =>console.error(err));
        } catch (error) 
        {
            errorMessage("There are problems with connect contract,check console!","block");
            console.log(error);
        }
    }else
    {
        errorMessage("There is fields empty or incorrectly filled in!!!","block");
    }
};

function checkData(data)
{

    if(data.diag === undefined || data.doc === undefined || data.infoDiag === undefined || data.medicine === undefined || data.status === undefined)
    {
        return false;
    }
    if(data.diag === null || data.doc === null || data.infoDiag === null || data.medicine === null || data.status === null )
    {
        return false;
    }
    if(data.diag == "" || data.doc == "" || data.infoDiag == "" || data.medicine == "" || data.status == "")
    {
        return false;
    }
    if((data.status != "Ill" && data.status != "ill") && (data.status != "Cured" && data.status != "cured") )
    {
        document.getElementById("statusIll").style = "border: thick double red;";
        errorMessage("There is problem with status only Ill or Cured!");
        return false;
    }

    let notOnlyWord = new RegExp("^.*[^A-zА-яЁё].*$");
    if(notOnlyWord.test(data.status))
    {
        document.getElementById("statusIll").style = "border: thick double red;";
        errorMessage("There is problem with status only word! Ill/Cured!","block");
        return false; 
    }
    return true;
}

function errorMessage(message, displayerr)
{
    error.style.display = displayerr;
    error.innerText = message;
}