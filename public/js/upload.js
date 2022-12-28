//method="POST" enctype="multipart/form-data"
formElem.onsubmit =  async function(e)
{
        e.preventDefault();
        await fetch("/api/upload",
        {
            method: 'POST',
            enctype:"multipart/form-data",
            body: new FormData(formElem)
        }).then(res => res.json()).then(data =>
        {
            console.log(data);
        });
        
};