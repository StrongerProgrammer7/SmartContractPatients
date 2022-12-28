<sub>**This work was done as part of the Course work by Author: Abdyukov Z.M. **</sub> 
<h3>Content</h3>

[Brief introduction](https://github.com/StrongerProgrammer7/SmartContractPatients/edit/main/README.md#optimization-contract)  
[Development tools and Programming Language](https://github.com/StrongerProgrammer7/SmartContractPatients/edit/main/README.md#development-tools-and-programming-language)  
[Prototype architecture](https://github.com/StrongerProgrammer7/SmartContractPatients/edit/main/README.md#prototype-architecture)  
[Optimization contract](https://github.com/StrongerProgrammer7/SmartContractPatients/edit/main/README.md#optimization-contract)  
[Some problem and TODO:](https://github.com/StrongerProgrammer7/SmartContractPatients/edit/main/README.md#some-problem-and-todo)  
[View Prototype](https://github.com/StrongerProgrammer7/SmartContractPatients/edit/main/README.md#-view-prototype-)  


<div align="center">
<h1>Smart contract EHTEREUM:</h1>
<h2>Interaction Patient with Doctor </h2>
</div>
<div>
<h3 align="center"> Brief introduction </h3>
 <p>The main goal of the work is to develop the architecture and prototype of a system of decentralized interaction between doctors and patients.<br><br>
The scientific novelty of the work lies in the fact that a new approach to the interaction of the patient with doctors is proposed.</p>
    <h4 align="center">Blockchain in healthcare</h4>
    <p align="justify">When a medical record is generated and signed, it can be recorded in the blockchain, which gives patients proof and confidence that the record cannot be changed. These personal medical records can be encoded and stored on the blockchain using a private key so that they are accessible only to certain individuals, thereby ensuring confidentiality.</p>
    <h4 align="center">Smart Contract in healthcare</h4>
    <p align="justify">Smart contracts can make data accessible and transparent to both patients and doctors by working as a gatekeeper who manages who is given access to information. </p>
     <h4 align="center">IPFS</h4>
    <p align="justify">The Interplanetary File System (IPFS) can be considered as a peer-to-peer distributed file system that seeks to connect all computing devices into a single file system. </p>
</div>
<div>
<h3 align="center">Development tools and Programming Language</h3>
<p align="justify"> For Smart Contract, i used Solidity and IDE Remix, also Personal Blockchain Ganache</p>
<p align="justify"> For Web-Site, used HTML/CSS/JS and NodeJS (express,body-parser,browserify,dotenv,ejs,ejs-mate,express-fileupload,ganache,ipfs-core,ipfs-http-client,node-abort-controller,web3,web3-eth),</p>
<code>npm install -S express body-parser browserify dotenv ejs ejs-mate express-fileupload ganache ipfs-core ipfs-http-client node-abort-controller web3 web3-eth</code> 
<p><b>Node v13.14.0 ,<br>npm v6.14.4</b></p>
</div>
<div>
<h3 align="center">Prototype architecture</h3>
<p>Interaction patient with doctor</p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209840941-cff0bdb3-60c4-4bd9-827e-813d30aa29c0.png"></p>
<p>Interaction Doctor with patient's contract</p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209840742-9e23b6f1-ce36-41e4-ad08-79d6ec908e60.png"></p>
<p>Interaction patient with contract</p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209842086-e5868565-8098-44c0-8f74-fb11abade873.png"></p>
</div>
<div>
<h3 align="center">Optimization contract</h3>
<p align="justify"> The developed prototype works with two contracts, with the contract of the patient <b>(Patient)</b> and the contract that interacts with the contract of the patient <b>(addPatient)</b>. The patient contract stores and processes data about a particular patient, and the patient does not have direct access to this contract. The second contract allows the patient to interact with the patient contract. Thus, each patient will have his own separate contract.</p>
  <p align="justify">Since each patient has his own personal contract, it puts a lot of pressure on the system and is quite an expensive operation. <b>In this regard, the concept of "Clone Factory" from OpenZepplin is used</b>, this library allows you to reduce the load on the system and reduce costs. It turns out this is due to the fact that the library works in the Assembly language, which directly works with memory. The essence of the library is that the patient's contract is first deployed, and then the main contract, which will create clones. Clones simply refer to the functions of the parent, thereby reducing their volume and increasing the processing speed, while each clone stores its own patient data</p>
<p align="justify">
    The contract also contains a function that converts an integer to a string. This function requires optimization, since the cost is high for large numbers, and the larger the number, the higher the cost <b>(for example, for 9997779 the cost is 42676 gas).</b> After the translation of the function into the Assembly language, the cost of the function has significantly decreased and with an increase in the number, it does not increase significantly (for example, for the same number the cost is already equal to <b>24576 gas</b> and with an increase in the number, the cost increases by only a few hundred, against several thousand)
</p>
<p align="justify">The rest of the functions in the contract were not translated into the Assembly language significantly, since the Assembly language requires more time to learn, and the Solidity developers do not recommend using it often, due to the fact that, quoting from the Solidity language developers <b>this is a way to access the virtual machine Ethereum is at a low level and this drops several important security features of Solidity.”</b>"</p>
</div>
<div>
<h3 align="center">Some problem and TODO:</h3>
<p align="justify">
      The first problem is <b>the limited size of the contract</b>. The developers of the Ethereum network and smart contracts have limited the size of contracts, which does not allow adding a lot of functionality. <b>The maximum contract size is 24576 bytes</b>, you can also use the built-in optimizer, but they also have a "too deep stack" limit of no more than 16 local variables. This was done in order to prevent DDos attacks. It is also possible to optimize the contract if it is translated into the Assembly (Assembler) language, but the developers strongly do not recommend it, since in this case there is work with memory, as a result of which it can cause problems in the Ethereum network. As a result, a smart contract can only be used with little functionality and a limited number of checks in the contract itself.</p>
<p align="justify">The second problem is that the contract is <b>too expensive</b>. The write functions are not expensive, but the display functions have nested loops, which greatly increases the price of the contract. <b>So, for example, displaying one diagnosis costs 35,000 gas, if there are already two, then 70,000 gas.</b> But I also note that the Ethereum network switched to “ProofOfStake” in the fall of 2022, perhaps next year the cost of computing will fall, and the contract will become cheaper.</p>
<p align="justify">The third problem is file storage. About 75 million people use cloud storage. Part of the campaign, another part uses intentionally, and still others only indirectly. The rest may not know about it, because there is simply no need. IPFS, on the other hand, is still a very young technology that requires development, testing and implementation to the masses (for example, a default installation along with the OS).<b> As a result, the use of IPFS as a storage is not very advisable in the near future, since in addition to those mentioned above, there are few users, and, therefore, the data will be loaded for a long time, and the receipt can also be long.</b></p>
<p align="justify">Also, <b>the developed application is only partially decentralized, as it works on the basis of a central node - a server.</b> For an application to be fully decentralized, the contract must be published to IPFS and the application deployed to a distributed file system. Only in this case, the dependence on the central node will disappear and the application will be truly decentralized.</p>
<h4>TODO: </h4>

+ 1. Contract optimization: learn Solc and apply

+ 2. WebSite optimization (the main page slows down)

+ 3. WebSite: remove jQuery (only used for slider), manually create slider

+ 4. Test on large volumes of data

+ 5. In case of successful solution of the problems above, create an Android App

</div>
<div>
<h3 align="center"> View Prototype </h3>
<p align="center"> MAIN PAGE </p>
<video src='https://user-images.githubusercontent.com/71569051/209843339-80a5c747-c117-4e0f-b797-0973439b64fd.mp4' width=100px autoplay></video>
<p align="center"> Chapter Patient </p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209844796-e684c547-6eff-4b46-8456-b3506c4a8228.png"></p>
<p align="center"> Chapter Doctor</p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209844812-38c34d39-6df8-41a6-b8c7-2ae0a7e231c9.png"></p>
<p align="center"> Show Base info </p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209844820-92f4b4c6-83d2-445c-bfe0-e2840a1c4619.png"></p>
<p align="center"> Check connect: circle is check connect with wallet, check mark is connect with contract</p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209845019-f09c4b36-4ce8-40b5-ae43-b1ccc227423c.png"></p>
<p align="center"> Register Form </p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209845519-22f03c6d-b76d-4c60-a715-a7e29ce78b01.png"></p>
<p align="center"> Success Register </p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209845605-bc97cd67-9d58-4f17-9ee4-ef3222f53048.png"></p>
<p align="center"> Success access </p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209845658-aeb1e251-0417-42e6-83bc-60221fcb1434.png"></p>
<p align="center"> Set diagnosis Form </p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209845698-f830d13b-4d20-4c16-9570-a59737226faf.png"></p>
<p align="center"> Info diagnos </p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209845727-964a7f51-01a5-4497-aaf5-9b94a3a3fcda.png"></p>
<p align="center"> History </p>
<p align="center"><img src="https://user-images.githubusercontent.com/71569051/209845766-78e8bdb1-95c7-48fd-8a96-1f903bf4347e.png"></p>
</div>
<h4> Author: Abdyukov Z.M. </h4>
