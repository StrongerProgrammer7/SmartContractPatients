//import detectEthereumProvider from '@metamask/detect-provider';
import * as helper from '../utils/helpers.js';
//const provider = null;
var accountUser = null;
var connectedContract = false;

document.addEventListener("DOMContentLoaded", async() =>
{   
    //provider = await detectEthereumProvider();
    try 
    {
        if(!window.ethereum && !window.ethereum.isMetaMask)
            console.log('Please install MetaMask!');
        else
            connectMetamask();
    } catch (error) 
    {
        let btn = document.getElementById("switch__buttonThree");
        btn.checked = false;
        btn.disabled = false;
        showProblem("account","problems_withAccount","Не обнаржуен провайдер ethereum, проверьте свой бразуер, на наличие расширения и поддержки, и попробуйте снова!","Повторное соединение","btnSwitch");             
        console.log(error);
    }
    
    
    $('.slider').slick(
        {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows:false,
            fade: true,
            asNavFor: '.sliderSmall'
        }
    );
    $('.sliderSmall').slick(
        {
            arrows:false,
            dots: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots:false,
            centerMode: true,
            pauseOnHover: true,
            asNavFor: '.slider',
            mobileFirst:true,
            Infinity: true,
            speed: 2000,
            easing: 'ease',
            autoplay: true,
            autoplaySpeed: 7000,
            /*pauseOnFocus: true,
            pauseOnHover: true,
            responsive:
            [
                {
                    breakpoint: 768,
                    setting:
                    {
                        slidesToShow: 2
                    }
                }
            ],*/
        
    });

});

document.addEventListener("click", function(e) 
{
    try 
    {
        if(e.target) 
        {
            if(e.target.id == "btnSwitch")
            {
                try    
                {
                    connectMetamask();
                } catch (error) 
                {
                    console.log("Connect metamask:",error);   
                }
            }
            if(e.target.id == "connectContractAgain")
            {
                try    
                {
                    document.getElementById("connectContractAgain").hidden = true;
                    hideProblemIfExists("problems_withContract");
                    connectContract();
                } catch (error) 
                {
                    console.log("Connect contract again:",error);   
                }
                
            }
            if(e.target.id =="btnRole")
            {
                try
                {
                    giveRoleDoctor();
                }catch(error)
                {
                    console.log("Give role:",error);
                }
            }
            if(e.target.id =="btnRevokeRole")
            {
                try
                {
                    revokeRoleDoctor();
                }catch(error)
                {
                    console.log("Revoke role:",error);
                }
            }
            if(e.target.id =="btnGetBaseInfoPatient")
            {
                try
                {
                    getBaseInfoPatient();
                }catch(error)
                {
                    console.log("Get base info:",error);
                }
            }
            if(e.target.id =="btnSetBaseInfoPatient")
            {
                try
                {
                    btnSetBaseInfoPatient();
                }catch(error)
                {
                    console.log("There is problem with set base infor!:",error);
                }
            }
            if(e.target.id =="btnGetnInfoDiagnos")
            {
                try
                {
                    btnGetnInfoDiagnos();
                }catch(error)
                {
                    console.log("Get diagnosis:",error);
                }
            }
            if(e.target.id =="btnSetDiagnosis")
            {
                try
                {
                    btnSetDiagnosis();
                }catch(error)
                {
                    console.log("Get info diagnosis current doctor:",error);
                }
            }
            if(e.target.id =="btnChangeDiagnosis")
            {
                try
                {
                    btnChangeDiagnosis();
                }catch(error)
                {
                    console.log("Get info diagnosis current doctor:",error);
                }
            }  
            if(e.target.id =="btnGetInfoDiagnosCurDoc")
            {
                try
                {
                    btnGetInfoDiagnosCurDoc();
                }catch(error)
                {
                    console.log("Get info diagnosis current doctor:",error);
                }
            } 
            if(e.target.id =="btnGetHistoryPatient")
            {
                try
                {
                    btnGetHistoryPatient();
                }catch(error)
                {
                    console.log("Get histories:",error);
                }
            }     
            if(e.target.id =="btnDownloadLinks")
            {
                try
                {
                    e.preventDefault();
                    btnDownloadLinks();
                }catch(error)
                {
                    console.log("Download links:",error);
                }
            }      
        }
    } catch (error) 
    {
        console.log("Event :",error);   
    }
    

    
});

document.getElementById("switch__buttonThree").addEventListener("click",function()
{
    try    
    {
        connectMetamask();
    } catch (error) 
    {
        console.log(error);   
    }
    
});

document.getElementById("links__registerId").addEventListener("click", function()
{
    window.open("/register",'_self');
});
/*
document.getElementById("links_setDiagnosId").addEventListener("click", function()
{ 
    window.open("/setNewDiagnos",'_self');
});
document.getElementById("links_changeDiagnosId").addEventListener("click", function()
{
    window.open("/changeDiagnos",'_self');
});*/

const connectMetamask = async () =>
{
    //console.log(provider);

    if(typeof window.ethereum !== 'undefined')
    {
        if(window.ethereum.isMetaMask == true)
            console.log("Using Metamask's web3 provider");
        else
             console.log("Using other web3 provider");

        try 
        {
            web3 = await new Web3(window.ethereum);
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            if(accounts.length !=0)
            {
                hideProblemIfExists("problems_withAccount");
                accountUser = accounts[0];
                let btn = document.getElementById("switch__buttonThree");
                btn.checked = true;
                btn.disabled = true;
                showMain();

                if(document.getElementById("account")===null)
                {
                    const data = document.getElementById("information").appendChild(document.createElement('span'));
                    /*data.style.color = "green";*/
                    data.className = "accountUsers";
                    data.id = "account";
                    data.textContent = accountUser;
                    
                    helper.createBtn("information","block","btnSwitch","Изменить аккаунт");
    
                    /*if(document.getElementById("btnSwitch") !==null)
                        document.getElementById("btnSwitch").hidden = false;*/
                }else
                {
                    document.getElementById("account").textContent = accountUser;
                    document.getElementById("account").style.color = "#0084ff";
                    if(document.getElementById("btnSwitch") ===null || document.getElementById("btnSwitch") === undefined)
                        helper.createBtn("information","block","btnSwitch","Изменить аккаунт");
                  /*if(document.getElementById("btnSwitch") !=null)
                        document.getElementById("btnSwitch").hidden =false;*/
                }

                if(connectedContract==false)
                    connectContract();

                if(document.getElementById("interactionWithAccounts").style.display == "none")
                {
                    helper.createBtn("interactionWithAccounts","block","btnRole","Дать доступ");
                    helper.createBtn("interactionWithAccounts","block","btnRole","Забрать доступ");
                }
                             
                if(document.getElementById("infoAboutPatient").style.display == "none")
                {
                    document.getElementById("infoAboutPatient").style.display = "block"
                    helper.createBtn("interactionWithPatient","grid","btnGetBaseInfoPatient","Посмотреть основную информацию о пациенте");
                    helper.createBtn("interactionWithPatient","grid","btnSetBaseInfoPatient","Обновить основную информацю");
                    helper.createBtn("interactionWithPatient","block","btnGetnInfoDiagnos","Посмотреть все назначенные диагнозы");
                    helper.createBtn("interactionWithPatient","block","btnGetHistoryPatient","Посмотреть историю болезни");
                }

                if(document.getElementById("DoctorInteractionWithPatients").style.display == "none")
                {
                    helper.createBtn("DoctorInteractionWithPatients","block","btnSetDiagnosis","Поставить диагноз для пациента");
                    helper.createBtn("DoctorInteractionWithPatients","block","btnChangeDiagnosis","Изменить диагноз для пациента");
                    helper.createBtn("DoctorInteractionWithPatients","block","btnGetInfoDiagnosCurDoc","Посмотреть диагнозы назначенные пациенту вами");
      
                    const form = document.getElementById("DoctorInteractionWithPatients").appendChild(document.createElement('form'));
                    form.id = "formElem";
                    const inputFiles = document.getElementById("formElem").appendChild(document.createElement('input'));

                    inputFiles.id = 'files';
                    inputFiles.type = 'file';
                    inputFiles.classList.add("form-control", "mt-3","mb-2");
                    inputFiles.name ='file';
                    inputFiles.multiple = true;

                    helper.createBtn("formElem","block","btnDownloadLinks","Загрузить файлы ");
                }

                /*if(document.getElementById("historyPatient").style.display == "none")
                {
                    let btn = helper.createBtn("historyPatient","block","btnGetHistoryPatient","Get patient's history");
                    btn.style.width="240px";
                }*/

                /*if(document.getElementById("downloadFiles").style.display == "none")
                {
                    let btn  = helper.createBtn("downloadFiles","block","btnDownloadLinks","Download links ipfs!");
                    btn.style.width="240px";
                }*/

                document.getElementById("links__registerId").style.visibility = "visible";
                //document.getElementById("links_setDiagnosId").style.visibility = "visible";
                //document.getElementById("links_changeDiagnosId").style.visibility = "visible";

            }else
            {
                let btn = document.getElementById("switch__buttonThree");
                btn.checked = false;
                btn.disabled = false;
             
                if(document.getElementById("accountProblem") === null || document.getElementById("accountProblem") === undefined)
                showProblem("account","problems_withAccount","Вы не соединилсь с кросчейн-кошельком! Попробуйте снова!","Соединиться с кросчейн-кошельком","btnSwitch");
            }
  
        } catch (error) 
        {    
            let btn = document.getElementById("switch__buttonThree");
            btn.checked = false;
            btn.disabled = false;
            if(document.getElementById("accountProblem") === null || document.getElementById("accountProblem") === undefined)
                showProblem("account","problems_withAccount","Вы не соединилсь с кросчейн-кошельком! Попробуйте снова!","Соединиться с кросчейн-кошельком","btnSwitch");             
            console.log(error);
        } 
    }else
    {
        console.warn('No web3 detected or metamask! Falling back to http://localhost:8545.');
        let web3 = await new Web3("ws://localhost:5000");
        showProblem("account","problems_withAccount","Не обнаружен web3 или кросчейн-кошелек MetaMask! Пожалуйста установите соответствующие расширение для браузера и попробуйте снова!","Повторное соединение","btnSwitch");
    }
}

const connectContract = async () =>
{
    try
    {
        if(helper.isExistsContract() == true)
        {
            
            window.contract = await new window.web3.eth.Contract(ABI,addressContract);
            connectedContract = true;
            document.getElementById("navigationPanel-header__input").checked = true;
            document.getElementById("navigationPanel-header__input").disabled = true;
            helper.off_onLinks("links__registerId","auto","pointer");
            
           /* if(document.getElementById("contract")==null)
            {
                const data = document.getElementById("connectedContract").appendChild(document.createElement('h4'));
                data.style.color = "green";
                data.className = "accountUsers";
                data.id = "contract";
                data.textContent = "Successfully";
                
            }else
            {
                document.getElementById("contract").textContent ="Successfully";
                ocument.getElementById("contract").style.color ="green";
                if(document.getElementById("connectContractAgain") !=null)
                    document.getElementById("connectContractAgain").hidden = true;

                helper.off_onLinks("links__registerId","auto","pointer");
               // helper.off_onLinks("links_setDiagnosId","auto","pointer");
                //helper.off_onLinks("links_changeDiagnosId","auto","pointer");
            }*/
        }else
        {
            showProblem("contracts","problems_withContract","Существует проблема с контрактом. Сообщите о проблеме администратору сайта по почте (внизу страницы).","Попытаться соединиться с контрактом еще раз","connectContractAgain");
        }
        
        
    }catch(err)
    {
        showProblem("contracts","problems_withContract","Существует проблема с контрактом. Сообщите о проблеме администратору сайта по почте (внизу страницы).","Попытаться соединиться с контрактом еще раз","connectContractAgain");
        console.log(err);
    }
    
}

const giveRoleDoctor = async () =>
{
    let accountDoctor = document.getElementById("accounts_doctor_patient").value;
    document.getElementById("accounts_doctor_patient").style = "border: none;";
    if(accountDoctor !== null && accountDoctor !== undefined && accountDoctor != "")
    {
        try 
        {
            await window.contract.methods.giveRole(accountDoctor).send({from :accountUser});   
            document.getElementById("accounts_doctor_patient").style = "border: thick double green;";
            window.contract.getPastEvents("allEvents",
            {                               
                fromBlock: 'latest',     
                toBlock: 'latest'     
            }).then((events) => console.log(events))
            .catch((err) => console.error(err));
        } catch (error) 
        {
            console.log(error);
        }
    }else
    {
        document.getElementById("accounts_doctor_patient").style = "border: thick double red;";
    }
    
    
       
}
const revokeRoleDoctor = async () =>
{
    document.getElementById("accounts_doctor_patient").style = "border: none;";
    let accountDoctor = document.getElementById("accounts_doctor_patient").value;
    if(accountDoctor !== null && accountDoctor !== undefined && accountDoctor != "")
    {
        try 
        {
            await window.contract.methods.anualRole(accountDoctor).send({from :accountUser});
            document.getElementById("accounts_doctor_patient").style = "border: thick double green;";
            
        } catch (error) 
        {
            console.log(error);
        }
    }else
    {
        document.getElementById("accounts_doctor_patient").style = "border: thick double red;";
    }
    
    
    
}

const getBaseInfoPatient = async() =>
{  
    if(accountUser !== null && accountUser !== undefined && accountUser != "")
    {
        if(document.getElementById("aboutPatient") === null || document.getElementById("aboutPatient") === undefined)
        {
            try 
            {
                let baseDataAboutPatient;

                if(document.getElementById("accounts_doctor_patient").value === null || document.getElementById("accounts_doctor_patient").value === undefined || document.getElementById("accounts_doctor_patient").value == "")
                    baseDataAboutPatient= await window.contract.methods.getInformationPatient(accountUser).call({from :accountUser});
                else
                {
                    let account_patient = document.getElementById("accounts_doctor_patient").value;
                    console.log(account_patient);
                    baseDataAboutPatient= await window.contract.methods.getInformationPatient(account_patient).call({from :accountUser});
                }

                if(document.getElementById("errorAccountBaseDate") !== null && document.getElementById("errorAccountBaseDate") !== undefined)
                    document.getElementById("btnGetBaseInfoPatient").removeChild(document.getElementById("errorAccountBaseDate"));
                if(document.getElementById("errorBaseData") !== null && document.getElementById("errorBaseData") !== undefined)
                    document.getElementById("btnGetBaseInfoPatient").removeChild(document.getElementById("errorBaseData"));

                if(baseDataAboutPatient!==null && baseDataAboutPatient.length !=0)
                {
            
                        let aboutPatient = document.getElementById("interactionWithPatient").appendChild(document.createElement('div'));
                        aboutPatient.classList.add("informationAboutPatient-box","box__b");
                        aboutPatient.id = "aboutPatient";
                    
                        for (let elem = 0; elem < baseDataAboutPatient.length; elem++) 
                        {
                            const element = baseDataAboutPatient[elem];
                            let name = document.getElementById("aboutPatient").appendChild(document.createElement('h6'));
                            name.style.display = "inline";
                            name.innerText = element;
                            aboutPatient.appendChild(document.createElement('br'));
                        }
                            
                        /*let hiddenDiv = document.getElementById("interactionWithPatient").appendChild(document.createElement('div'));
                        hiddenDiv.classList.add("informationAboutPatient-box","c");   */     
                }
            } catch (error) 
            {
                console.log(error);
                if(document.getElementById("errorBaseData") === null || document.getElementById("errorBaseData") === undefined)
                    helper.displayError_tagP("btnGetBaseInfoPatient","errorBaseData","Есть проблема, если вы врач, проверьте поле ввода, если нет, обратитесь к администратору!","red"); 
            }          
            
        }else
        {
           // document.getElementById("interactionWithPatient").removeChild(document.getElementById("interactionWithPatient").children[2]);
            document.getElementById("interactionWithPatient").removeChild(document.getElementById("interactionWithPatient").lastChild);
        }
    }else
    {
        if(document.getElementById("errorAccountBaseDate") === null || document.getElementById("errorAccountBaseDate") === undefined)
            helper.displayError_tagP("btnGetBaseInfoPatient","errorAccountBaseDate","Error! Check your account!","red");
    }       

}

function btnSetDiagnosis()
{ 
    window.open("/setNewDiagnos",'_self');
}

function btnChangeDiagnosis()
{ 
    window.open("/changeDiagnos",'_self');
}

const btnSetBaseInfoPatient = async() =>
{
    if(accountUser !== null && accountUser !== undefined && accountUser !="")
    {
        window.location.href = '/register?setNewDataBase=1';
    }else
    {
        if(document.getElementById("errorAccountDiagnosisFull") === null || document.getElementById("errorAccountDiagnosisFull") === undefined)
            helper.displayError_tagP("btnGetnInfoDiagnos","errorAccountDiagnosisFull","Error! Check your account!","red");
        
    }
    
    
}

const btnGetnInfoDiagnos = async() =>
{
    if(accountUser !== null && accountUser !== undefined && accountUser !="")
    {
        if(document.getElementById("accounts_doctor_patient").value !== null && document.getElementById("accounts_doctor_patient").value !== undefined && document.getElementById("accounts_doctor_patient").value!="")
        {
            const acc_patient = document.getElementById("accounts_doctor_patient").value;
            const accountCurrent = accountUser;
            window.location.href = '/getDiagnosisPatient?accountPatient='+acc_patient + '&account='+accountCurrent +'&list=full';
        }else
        {
            document.getElementById("accounts_doctor_patient").style = "border: thick double red;";
        }
    }else
    {
        if(document.getElementById("errorAccountDiagnosisFull") === null || document.getElementById("errorAccountDiagnosisFull") === undefined)
            helper.displayError_tagP("btnGetnInfoDiagnos","errorAccountDiagnosisFull","Error! Check your account!","red");
        
    }
    
}

const btnGetInfoDiagnosCurDoc = async() =>
{
    if(accountUser !== null && accountUser !== undefined && accountUser !="")
    {
        if(document.getElementById("account_patient").value !== null && document.getElementById("account_patient").value !== undefined && document.getElementById("account_patient").value!="")
        {
            const acc_patient = document.getElementById("account_patient").value;
            const accountCurrent = accountUser;
            window.location.href = '/getDiagnosisForCurDoc?accountPatient=' + acc_patient + '&account=' + accountCurrent+'&list=curDoc';
        }else
        {
            document.getElementById("account_patient").style = "border: thick double red;";
        }
    }else
    {
        if(document.getElementById("errorAccountDiagnosisCurrDoc") === null || document.getElementById("errorAccountDiagnosisCurrDoc") === undefined)
            helper.displayError_tagP("btnGetInfoDiagnosCurDoc","errorAccountDiagnosisCurrDoc","Error! Check your account!","red");
        
    }    
}

const btnGetHistoryPatient = async() =>
{
    if(accountUser !== null && accountUser !== undefined && accountUser !="")
    {
        if(document.getElementById("accounts_doctor_patient").value !==null && document.getElementById("accounts_doctor_patient").value !==undefined && document.getElementById("accounts_doctor_patient").value!="")
        {
            const acc_patient = document.getElementById("accounts_doctor_patient").value;
            const accountCurrent = accountUser;
            window.location.href = '/getHistoryPatient?accountPatient='+acc_patient + '&account='+accountCurrent + '&list=history';
        }else
        {
            document.getElementById("accounts_doctor_patient").style = "border: thick double red;";
        }
    }else
    {
        if(document.getElementById("errorAccountDiagnosisHistory") === null || document.getElementById("errorAccountDiagnosisHistory") === undefined)
            helper.displayError_tagP("btnGetHistoryPatient","errorAccountDiagnosisHistory","Error! Check your account!","red");
        
    } 
}

const btnDownloadLinks = async() =>
{

    const acc_patient = document.getElementById("account_patient").value;
    if(accountUser !== null && accountUser !== undefined && accountUser !="")
    {
        if(acc_patient !== null && acc_patient !== undefined && acc_patient !== "")
        {
            document.getElementById("account_patient").style = "border: thick double green;";
            if(document.getElementById("errorAccountDownloadLinks") !== null && document.getElementById("errorAccountDownloadLinks") !== undefined)
                document.getElementById("btnDownloadLinks").removeChild(document.getElementById("errorAccountDownloadLinks"));
            
            let ipfsLinks = "";
            if(document.getElementById("files").files.length != 0 && document.getElementById("account_patient").value !="")
            {
                console.log(document.getElementById("files").files);
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
        
                
                try 
                {
                    await window.contract.methods.downloadFileLinks(acc_patient,ipfsLinks).send({from :accountUser});
                    document.getElementById("files").style = "border: thick double green;";
                    window.contract.getPastEvents("allEvents",
                    {                               
                        fromBlock: 0,     
                        toBlock: 'latest'     
                    }).then((events) => console.log(events))
                    .catch((err) =>console.error(err));
                } catch (error) 
                {
                    helper.displayError_tagP("btnDownloadLinks","errorDownload","There are problems with download on the contract!","red");
                    console.log(error);
                }
            }
            else
            {
                document.getElementById("account_patient").style = "border: thick double red;";
                document.getElementById("files").style = "border: thick double red;";
            }
        }else
        {
            document.getElementById("account_patient").style = "border: thick double red;";
        }
        
    }else
    {
        if(document.getElementById("errorAccountDownloadLinks") === null || document.getElementById("errorAccountDownloadLinks") === undefined)
            helper.displayError_tagP("btnDownloadLinks","errorAccountDownloadLinks","Error! Check your account!","red");
        
    }
    
}

function showMain()
{				
    document.getElementById('mainContentInteraction').style.display="block";
    // document.getElementById("wr").style.position ="unset";
    document.getElementById("problems").style.paddingBottom = "0";		   
}


function hideProblemIfExists(problem)
{
	if(document.getElementById(problem).style.display != "none")
    {
        const problems = document.getElementById(problem);
		while(problems.lastChild)
		{
			problems.removeChild(problems.lastChild);
		}
        problems.style.display = "none";
        document.getElementById("problems").style.paddingBottom = "8.4%";
    }
}


function showProblem(parentDiv,problem,text,textForButton,idForButton)
{
	document.getElementById("problems").style.paddingBottom = "1.4%";
    // document.getElementById("wr").style.position ="fixed";      
	document.getElementById('mainContentInteraction').style.display="none";
	helper.off_onLinks("links__registerId","none","default");
    //helper.off_onLinks("links_setDiagnosId","none","default");
    //helper.off_onLinks("links_changeDiagnosId","none","default");
	
    if(document.getElementById(parentDiv)===null)
    {
        document.getElementById(problem).style.display="block";
        const data = document.getElementById(problem).appendChild(document.createElement('h5'));

        data.className = "problems";
        data.id = parentDiv + "Problem";
        data.textContent = text;

        if(document.getElementById(idForButton) === null)
        {
            const btn = helper.createBtn(problem,"block",idForButton,textForButton);
            btn.style.hidden = true;
        }else
        {
            document.getElementById(idForButton).style.hidden = true;
            
        }
                        
    }else
    {
        document.getElementById(problem).style.display="block";
        document.getElementById(parentDiv).innerText ="";
        const data = document.getElementById(problem).appendChild(document.createElement('h5'));
        data.className = "problems";
        data.id = parentDiv+"Problem";
        data.textContent = text;

        if(document.getElementById(idForButton)  === null)
        {
            const btn = helper.createBtn(problem,"block",idForButton,textForButton);
            btn.style.hidden = true;
        }else
        {
            document.getElementById(problem).appendChild(document.getElementById(idForButton));
            document.getElementById(idForButton).style.hidden = true;
            document.getElementById(problem).style.display="block";
        }
    }
}
