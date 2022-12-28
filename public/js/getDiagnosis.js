const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const accountPatient = urlParams.get('accountPatient');
const accountCurrent = urlParams.get('account');
const typeContainerData = urlParams.get('list');

console.log(accountPatient,accountCurrent,typeContainerData);
window.addEventListener("DOMContentLoaded", async function()
{
    let dataAboutIllPatient;
    error.style.display = "none";
    success.style.display = "none";

    try 
    {
        window.web3 = await new Web3(window.ethereum);
        window.contract = await new window.web3.eth.Contract(ABI,addressContract);
    } catch (error) 
    {
        errorMessage("There is problem with connect contract, check console!","block");
        console.log(error);
    }
    

    if(typeContainerData =="full")
    {
        try 
        {
            dataAboutIllPatient = await window.contract.methods.getDiagnosisPatient(accountPatient).call({from :accountCurrent});
        } catch (error) 
        {
            console.log("Diagnosis: ",error); 
            errorMessage("There is problem get data!","block");   
        }
       
    }else
    {
        if(typeContainerData == "history")
        {
            try 
            {
                dataAboutIllPatient = await window.contract.methods.getHistoryPatient(accountPatient).call({from :accountCurrent});
            } catch (error) 
            {
                console.log("Histories: ",error);
                errorMessage("There is problem get data!","block");    
            }
        }else
        {
            try 
            {
                dataAboutIllPatient = await window.contract.methods.getDataPatientForCurrentDoc(accountPatient).call({from :accountCurrent});
            } catch (error) 
            {
                console.log("For current doctor: ",error);
                errorMessage("There is problem get data!","block");    
            }
        }
            
        
            
    }   
    console.log(dataAboutIllPatient.length,dataAboutIllPatient);
    if(dataAboutIllPatient!==null && dataAboutIllPatient.length !=1)
    {        
        for (let elem = 0; elem < dataAboutIllPatient.length; elem++) 
        {
            

            let str = dataAboutIllPatient[elem];
            let name = "", id = "";
           // console.log(str.substr(0,4));
            if(elem == dataAboutIllPatient.length-1 || str.substr(0,4)=="IPFS")
            {
                getLinks(str);
                break;
            }
            
            let aboutPatient = document.getElementById("diagnosisId").appendChild(document.createElement('div'));
            aboutPatient.classList.add("box");
            aboutPatient.style = "grid-column: 1;";
            for (let charInd = 0; charInd < str.length; charInd++) 
            {
                const charStr = str[charInd];
                if(charStr==":" || charStr=="/"|| charStr==";")
                {
                    if(charStr==":")
                    {
    
                        name+=charStr +" ";
                        let nameAtribute = aboutPatient.appendChild(document.createElement('h6'));
                        nameAtribute.style.display = "inline";
                        nameAtribute.innerText = name;
                        name="";
                    }else
                    {
     
                        let valueAtribue = aboutPatient.appendChild(document.createElement('p'));
                        valueAtribue.style.display ="inline";
                        valueAtribue.innerText = name;
                        valueAtribue.style.fontSize = "14px";
                        aboutPatient.appendChild(document.createElement('br'));
                        name="";
                    }
                    if(charStr==";")
                    {
                        if(typeContainerData==="curDoc")
                        {
                            formationOfParameters(str,aboutPatient);

                        }
                        
                        break;
                    }
                        

                }else
                {
                    name +=charStr;
                }
                
                
            }//for str end
               
        }
    }else
    {
        document.getElementById("twoBlocks").style.display = "none";
        let text = document.getElementById("diagnoses").appendChild(document.createElement('h1'));
        text.innerText = "DATA IS EMPTY!";
        text.style.textAlign = "center";
    } 
});

document.getElementById("home").addEventListener("click", function()
{
    window.open("/",'_self');
});



function getLinks(str)
{
    let name ="";
    let allLinksPatients = document.getElementById("linksId");
    for (let indLinks = 0; indLinks < str.length; indLinks++) 
    {
        const charIPFS = str[indLinks];
        if(charIPFS ==";") break;
        if(charIPFS==":" || charIPFS =="|")
        {
            if(charIPFS==":")
            {
                name+=charIPFS +" ";
                let nameAtribute = allLinksPatients.appendChild(document.createElement('h5'));
                nameAtribute.style.display = "inline";
                nameAtribute.innerText = name;
                allLinksPatients.appendChild(document.createElement('br'));
                name="";
            }else
            {
                let valueAtribue = allLinksPatients.appendChild(document.createElement('a'));
                valueAtribue.href = "https://ipfs.io/ipfs/" +name;
                valueAtribue.innerText = name;
                valueAtribue.style.fontSize = "10px";
                allLinksPatients.appendChild(document.createElement('br'));
                name="";
            }

        }else
        {
            name +=charIPFS;
        }
        
    }
}

function formationOfParameters(str,parent)
{
    let arrayStr = str.split('/');
    console.log(arrayStr);
    let linksChange =  parent.appendChild(document.createElement('a'));
    linksChange.style.fontSize = "12px";
    linksChange.id = "changeDiagnos";
    linksChange.innerText = " Изменить диагноз";

    let link = "/changeDiagnos?";
    if(arrayStr[0].substr(0,2)=="id")
    {
        link += "id=" + arrayStr[0].substr(3) + "&";
        console.log(arrayStr[0].substr(3));
    }
    if(arrayStr[1].substr(0,9)=="diagnosis")
    {
        link += "name=" + arrayStr[1].substr(10) + "&";
        console.log(arrayStr[1].substr(10) + "&");
    }
    if(arrayStr[3].substr(0,12)=="info diagnos")
    {
        link += "more=" + arrayStr[3].substr(13) + "&";
        console.log(arrayStr[3].substr(13));
    }
    if(arrayStr[4].substr(0,9)=="treatment")
    {
        link += "treat=" + arrayStr[4].substr(10);
        console.log(arrayStr[4].substr(10));
    }
    linksChange.href=link;
}

function errorMessage(message, displayerr)
{
    error.style.display = displayerr;
    error.innerText = message;
}