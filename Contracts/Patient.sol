//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./library/translateTypes.sol";
import "./library/dataCheck.sol";
import "./access/Owner.sol";//Основной автор openZepplin , для этого контракта немного переделанo
import "./access/Roles.sol"; // ~

/*
*
*
*@title Данные о пациенте
*Данные о пациенте хранятся в виде структуры и IPFS хранилище для больших файлов(№снимков)
*@author Abdyukov Z.
*
*@notice каждый пользователь сначала регистрируется , вносит базовые данные (структура BaseData)
*Данные о диагнозе и лечение, а также изменении может вносить врач , которому дал право сам пациент
* 
*@dev TODO: Необходима оптимизация кода для сокращения расходов
* 
*/

contract Patient is Owner,AccessControl
{
    using TranslateTypes for string;
    using DataCheck for string;
    using TranslateTypes for uint;
  
    /*
    *@notice Базовая информация о пациенте, почти константа
    */
    struct BaseData
    {
        bytes name;
        bytes surname;
        bytes lastname;
        bytes birthday;
        string addressOfResidence; // адрес проживания
        string addressRegistered;
        string insurancePolicy; // страховой полис
    }

    /*
    *@notice Информация о лечении и болезнях
    */
    struct DataDiagnosisTreatment
    {
        uint id;
        
        string nameDiagnosis;
        string nameSurname_doctor;

        string moreInformationAboutDiagnosis;
        string treatment;

        string dataDiagnosis;
        string dataChangeDiagnosis;

        bool status;
    }
    
    BaseData private dataPatient; 
    

    /*
    *@notice Информацию вносит врач о болезнях и их лечение, те что вылечили удаляются
    *@param address адрес врача
    *@param DataDiagnosisTreatment[] массив болезней пациента
    */
    mapping(address => DataDiagnosisTreatment[]) private doctor_diagnosis;
    /*
    *@notice для получения доступа к болезням нужен адресс врача
    *@dev TODO: можно как-то оптимизировать этот момент
    */
    address[] private docs; 
    string[] private linksStorage;//содержит хэш файлов в IPFS
    DataDiagnosisTreatment[] private histories; // хранит историю болезней

    bytes32 private constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

    modifier onlyePatientOrDoctor(address account)
    {
        require(hasRole(DOCTOR_ROLE,account) || hasRole(DEFAULT_ADMIN_ROLE,account), " Caller is not doc or patient!");
        _;
    }

    constructor() Owner(msg.sender) { }
	
	/*
    *@notice регистрация пациента и получение прав админа
    *
    */
    function register(address _patient,string[] memory _data ) external
    {
        require(DataCheck.isEmptyData(_data,false)==false,"Data is empty!!!");
        transferOwnership(_patient);
        setAdmin(_patient);
        _setupRole(DEFAULT_ADMIN_ROLE,_patient);
        dataPatient = BaseData(bytes(_data[0]),bytes(_data[1]),bytes(_data[2]),bytes(_data[3]),_data[4],_data[5],_data[6]);
    } 
	
    /*
    *@notice Врач вносит данные о пациенте
    *@param _doctor врач
    *@param _data данные о диагнозе
    */
    function setNewDataPatient_Diagnos(address _doctor,string[] memory _data) external onlyRole(DOCTOR_ROLE,_doctor) 
    {
        require(DataCheck.isEmptyData(_data,true)==false,"Data is empty!!!");
        DataDiagnosisTreatment memory diagnosis;
        diagnosis.id = doctor_diagnosis[_doctor].length;
        diagnosis.nameDiagnosis = _data[0];
        diagnosis.nameSurname_doctor = _data[1];
        diagnosis.moreInformationAboutDiagnosis = _data[2];
        diagnosis.treatment = _data[3];
		if(_data[5].isEmptyCurrentString() == false)
            linksStorage.push(_data[5]);      
        diagnosis.dataDiagnosis = _data[6]; 
        diagnosis.dataChangeDiagnosis = _data[6];

        if(keccak256(abi.encodePacked(_data[4]))==keccak256("Ill"))
            diagnosis.status = false;
        else
            diagnosis.status = true;

        if(diagnosis.status == true)
            histories.push(diagnosis);
        else
            doctor_diagnosis[_doctor].push(diagnosis);
        
        for(uint i = 0; i < docs.length;i++)
            if(docs[i] == _doctor)
            {
                return;
            }
        docs.push(_doctor);
    }

    /*
    *@notice Врач может изменить не все данные о пациенте
    *@param _doctor врач
    *@param _status Вылечен/Лечение продолжается
    *@param _data данные о диагнозе
    *@param _idDiagnosis № диагноза( можно узнать вызыва функцию о болезнях
    *@dev TODO: получать диагноз проще
    */
    function changeStatusDiagnosis_Treatment(address _doctor,uint _idDiagnosis,string[] memory _data,bool _status) external onlyRole(DOCTOR_ROLE,_doctor)
    { 
        doctor_diagnosis[_doctor][_idDiagnosis].status = _status;
        if(_data[0].isEmptyCurrentString() == false)
            doctor_diagnosis[_doctor][_idDiagnosis].nameDiagnosis = _data[0];
        if(_data[1].isEmptyCurrentString() == false)
            doctor_diagnosis[_doctor][_idDiagnosis].moreInformationAboutDiagnosis = _data[1];
        if(_data[2].isEmptyCurrentString() == false)
            doctor_diagnosis[_doctor][_idDiagnosis].treatment = _data[2];
        doctor_diagnosis[_doctor][_idDiagnosis].dataChangeDiagnosis = _data[3];

        if(_status == true)
        {
            histories.push(doctor_diagnosis[_doctor][_idDiagnosis]); 
            for(uint i=_idDiagnosis;i<doctor_diagnosis[_doctor].length-1;i++)
            {
                doctor_diagnosis[_doctor][i] = doctor_diagnosis[_doctor][i+1];
                if(doctor_diagnosis[_doctor][i].id!=0)
                    doctor_diagnosis[_doctor][i].id -=1;
            }
            doctor_diagnosis[_doctor].pop();
        }
            
    }
	
	/*
    *@notice сохранение ссылки на большие данные о пациенте
    */
    function downloadLinksFile(address _doctor,string memory _fileLinks) external onlyRole(DOCTOR_ROLE,_doctor)
    {
        linksStorage.push(_fileLinks);
    }
      
    /*
    *@notice получить данные для текущего врача
    */
    function getDataDiagnosisForCurrentDoctor(address _doctor)external view  onlyRole(DOCTOR_ROLE,_doctor)  returns(string[] memory)
    {
        string[] memory data = new string[](doctor_diagnosis[_doctor].length+1);
        uint indexDiagnosis = 0;
        for(uint i = 0;i< doctor_diagnosis[_doctor].length;i++)
        {
            data[indexDiagnosis] = _getDiagnos(doctor_diagnosis[_doctor][i]);
            indexDiagnosis++;
        }
        data[indexDiagnosis] = _getLinksIPFS();
        return data;
    }
    
    /*
    *@notice Возвращает все актуальные болезни пациента(остальные находятся в истории болезни)
    *@dev Можно ускорить , отсылка к проблеме mapping(address => struct[])
    *@dev Есть проблемы с переполнением 
	*@return Строка со всеми диагнозами
    */
    function getDataDiagnosisPatient(address _account) external view  onlyePatientOrDoctor(_account) returns(string[] memory)
    {     
        uint indexDiagnosis = 0;
        uint countDiag = 0;

        for(uint i=0;i<docs.length;i++)
        {
            address doctor = docs[i];
            countDiag +=doctor_diagnosis[doctor].length;
        }

        string[] memory data = new string[](countDiag+2);
        for(uint i =0;i<docs.length;i++)
        {
            address doctor = docs[i];
            for(uint j=0;j<doctor_diagnosis[doctor].length;j++)
            {    
                data[indexDiagnosis] = _getDiagnos(doctor_diagnosis[doctor][j]);
                assembly
                {
                    indexDiagnosis:=add(indexDiagnosis,0x1)
                }
                
            }
        }
        data[indexDiagnosis] = _getLinksIPFS();
        return data;
    }

	/*
    *@notice Возвращает в истории болезни
	*@return Строка со всеми диагнозами
    */
    function getHistoryPatient() external view  returns(string[] memory)
    {
        string[] memory data = new string[](histories.length+1);
        uint indexDiagnosis = 0;
        for(uint i = 0;i< histories.length;i++)
        {
            data[indexDiagnosis] = _getDiagnos(histories[i]);
            assembly
            {
                indexDiagnosis:=add(indexDiagnosis,0x1)
            }
        }
        data[indexDiagnosis] = _getLinksIPFS();
        return data;
    }

	/*
    *@notice Вычисление отдельного диагноза и перевод в строку
	*@return Строку с диагнозом
    */
    function _getDiagnos(DataDiagnosisTreatment memory _patient) private pure returns(string memory)
    {
        string memory id = _patient.id.uintTostring();
        string memory dataDiag = _patient.dataDiagnosis;
        string memory dataChange = _patient.dataChangeDiagnosis;
        string memory statusIll ="";
        if(_patient.status == true)
            statusIll  = "Cured";
        else
            statusIll  = "Ill";
        
        string memory nameDiagnos = _patient.nameDiagnosis;
        string memory nameSurnameDoc = _patient.nameSurname_doctor;
        string memory infoDiagnos = _patient.moreInformationAboutDiagnosis;
        string memory treatment = _patient.treatment;
      
        string memory all = "";
        all = string(abi.encodePacked("id:" , id , "/diagnosis:" , nameDiagnos , "/name surname doctor:" ,
                    nameSurnameDoc , "/info diagnos:", infoDiagnos ,
                    "/treatment:" , treatment , "/data: " , 
                    dataDiag ,"/dataChangeDiagnosis:",dataChange, "/status:", statusIll, 
                     ";"));
  
        return all;
    }

	/*
	*@return Строку с ссылками
    */
    function _getLinksIPFS() private view returns(string memory)
    {
        string memory links = "IPFS:";
        for (uint i =0;i<linksStorage.length;i++)
        {
            bytes memory temp = abi.encodePacked(linksStorage[i], "|");
            links = string(abi.encodePacked(links, temp));
        }
        links = string(abi.encodePacked(links,';'));
        return links;
    }


    function getBaseDataPatient(address _account) external view  onlyePatientOrDoctor(_account)  returns(string[] memory)
    {
        
        if(owner() == _account)
        {
            string[] memory baseData = new string[](7);
            baseData[0] = string(abi.encodePacked("Name: ",dataPatient.name));
            baseData[1] = string(abi.encodePacked("Surname: ",dataPatient.surname));
            baseData[2] = string(abi.encodePacked("Lastname: ",dataPatient.lastname));
            baseData[3] = string(abi.encodePacked("Birthday: ",dataPatient.birthday));
            baseData[4] = string(abi.encodePacked("Address of redisdence: ",dataPatient.addressOfResidence));
            baseData[5] = string(abi.encodePacked("Address of register: ",dataPatient.addressRegistered));
            baseData[6] = string(abi.encodePacked("Insurance policy: ",dataPatient.insurancePolicy));
            return baseData;
        }else
        {
            string[] memory baseData = new string[](3);
            baseData[0] = string(abi.encodePacked("Name: ",dataPatient.name));
            baseData[1] = string(abi.encodePacked("Surname: ",dataPatient.surname));
            baseData[2] = string(abi.encodePacked("Insurance policy: ",dataPatient.insurancePolicy));
            return baseData;
        }
       
    }

    /*
    *
    *@dev на случай изменени персональных данных по обстоятельствам
    * 
    **/
    function setNewBaseDataPatient(address _patient,string[] memory _data) external  onlyOwner(_patient)
    {        
        if(_data[0].isEmptyCurrentString() == false)
            dataPatient.name = bytes(_data[0]);
        if(_data[1].isEmptyCurrentString() == false)
            dataPatient.surname = bytes(_data[1]);
        if(_data[2].isEmptyCurrentString()==false)
            dataPatient.lastname = bytes(_data[2]);
        if(_data[3].isEmptyCurrentString() == false)
            dataPatient.birthday = bytes(_data[3]);
        if(_data[4].isEmptyCurrentString()==false)
            dataPatient.addressOfResidence = _data[4];
        if(_data[5].isEmptyCurrentString()==false)
            dataPatient.addressRegistered = _data[5];
        if(_data[6].isEmptyCurrentString()==false)
            dataPatient.insurancePolicy = _data[6];
    }

    function setupRole_Doctor(address _patient, address _doctor) external  onlyOwner(_patient) onlyRole(DEFAULT_ADMIN_ROLE,_patient)
    {
        grantRole(DOCTOR_ROLE,_doctor);
    }

    function revokeRole_Doctor(address _patient,address _doctor) external  onlyOwner(_patient) onlyRole(DEFAULT_ADMIN_ROLE,_patient)
    {
        revokeRole(DOCTOR_ROLE,_doctor);
    }

}