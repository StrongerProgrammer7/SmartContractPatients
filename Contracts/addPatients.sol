//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Patient.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/Clones.sol";
/*
*@author Abdyukov Z.
*@notice Регистрация пациентов, никто не имеет право на этот контракт, он используется
* только для регистрации, внесение изменений, просмотра
*/
contract Patients
{
    event NewPatient(string notice, address patient, string name, uint256 patientId, address contractPatient);
    event GetRole(string role, address doctor);
    event Diagnosis(string nameDiagnos, address doctor);
    event Log(string func, address sender, bytes data);

    uint256 public countPatients = 0;
    mapping(address => address) public adressesPatient;
 
    address public implementation;
    constructor (address _implementation) 
    {
        implementation = _implementation;
    }

    modifier existsPatient(address _patient)
    {
        require(adressesPatient[_patient]!=address(0),"Patient don't exists!Check patient's account!");
        _;
    }

    function createPatient(string[] memory _data) external 
    {
        require(adressesPatient[msg.sender]==address(0),"You were register!");
        
        address patient = Clones.clone(implementation);

        Patient(patient).register(msg.sender,_data);

        adressesPatient[msg.sender] = patient;
        countPatients++;

        emit NewPatient("Create patient: ",msg.sender, _data[0],countPatients-1,patient);    
    }

    function setDiagnosis(address _patient,string[] memory _diagnosis) external existsPatient(_patient)
    {
        Patient p = Patient(adressesPatient[_patient]);
        p.setNewDataPatient_Diagnos(msg.sender,_diagnosis);
        emit Diagnosis(_diagnosis[0],msg.sender);
     
    }

    function changeStatusIllnes(address _patient,uint _idDiagnosis,string[] memory _data,bool _status) external existsPatient(_patient)
    { 
        require(_data.length < 5, " Exists excess data!");
        Patient p = Patient(adressesPatient[_patient]);
        p.changeStatusDiagnosis_Treatment(msg.sender,_idDiagnosis,_data,_status);
    }

    function downloadFileLinks(address _patient,string memory _fileLinks) external existsPatient(_patient)
    {
        Patient p = Patient(adressesPatient[_patient]);
        p.downloadLinksFile(msg.sender,_fileLinks);
    }

    function setNewBaseData(string[] memory _data) external existsPatient(msg.sender)
    {
        Patient p = Patient(adressesPatient[msg.sender]);
        p.setNewBaseDataPatient(msg.sender,_data);
    }
    
    function getDataPatientForCurrentDoc(address _patient) external view existsPatient(_patient) returns(string[] memory)
    {
        Patient p = Patient(adressesPatient[_patient]);
        return p.getDataDiagnosisForCurrentDoctor(msg.sender);
    }

    function getDiagnosisPatient(address _patient) external view existsPatient(_patient) returns(string[] memory)
    {
        Patient p = Patient(adressesPatient[_patient]);
        return p.getDataDiagnosisPatient(msg.sender);
    }
    
    function getHistoryPatient(address _patient) external view existsPatient(_patient) returns(string[] memory)
    {
        Patient p = Patient(adressesPatient[_patient]);
        return p.getHistoryPatient();
    }
    
    function getInformationPatient(address _patient) external view existsPatient(_patient) returns(string[] memory)
    {
        Patient p = Patient(adressesPatient[_patient]);
        return p.getBaseDataPatient(msg.sender);
    }

    function giveRole(address _doctor) external
    {
        require(msg.sender != _doctor, "You can not be a doctor!");
        Patient p = Patient(adressesPatient[msg.sender]);
        p.setupRole_Doctor(msg.sender,_doctor);
        emit GetRole("Doctor", _doctor);
    }

    function anualRole(address _doctor) external
    {
        require(msg.sender != _doctor, "You can not be a doctor and nothing anual!");
        Patient p = Patient(adressesPatient[msg.sender]);
        p.revokeRole_Doctor(msg.sender,_doctor);
    }

    fallback() external 
    {
        emit Log("fallback", msg.sender, msg.data);
    }
}
