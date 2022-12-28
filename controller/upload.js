const IPFS = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');
const ipfs = IPFS.create();

const upload = async (req,res) =>
{
    let data = new Map();
    const myFile = (Array.isArray(req.files.file)?req.files.file:[req.files.file]).filter(e=>e);
    try 
    {
        for(let i =0;i<myFile.length;i++)
        {
            let file = myFile[i];
            let extfiles = path.extname(file.name);
            let fileName = path.basename(file.name, extfiles) + "_" + Date.now();
            let filePath = path.resolve('files',fileName);
            file.mv(filePath,async(err) => 
            {
                if(err) 
                {
                    console.log('Error: failed to download the file',err);
                    return res.status(500).send(err);
                }
                const fileHash = await addFile(fileName,filePath);
                //console.log(fileHash);
                fs.unlink(filePath,(err) =>
                {
                    if(err) 
                        console.log(err);
                });
                data.set(fileName, fileHash); 
                
                //res.locals.query = {fileName,fileHash};
               // res.redirect('/upload');
            });
            await sleep(1000); 
        }
        //console.log({data});
        //console.log(data.size);
        let jsonFormat = JSON.stringify(Object.fromEntries(data));
        //console.log(jsonFormat);
        res.status(200).json(jsonFormat);
    } catch (error) 
    {
        res.status(500).json({"Error with file ": error});
    }
    
}

const addFile = async(fileName,filePath) =>
{
        const file = fs.readFileSync(filePath);
        const fileAdded = await ipfs.add({path: fileName, content: file});
        const fileHash = fileAdded.cid.toString();
        return fileHash;      
}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = upload;


  