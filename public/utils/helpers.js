function createBtn(parent,typeDisplay,btnId,text)
{
	if(document.getElementById(parent).style.display == "none")
		document.getElementById(parent).style.display = typeDisplay;
	let btn = document.getElementById(parent).appendChild(document.createElement('button'));
    btn.classList.add("button-interaction","button-animation");
    btn.id = btnId;
    btn.textContent = text;
    btn.hidden = false;
    if(parent=="interactionWithPatient" || parent == "DoctorInteractionWithPatients" || parent == "formElem")
    {   
        btn.classList.add("person__button");
    }
    return btn;
}

function off_onLinks(idLinks,pointEvent,styleCursor)
{
	document.getElementById(idLinks).style.pointerEvents = pointEvent;
	document.getElementById(idLinks).style.cursor = styleCursor;
}

function isExistsContract()
{
    if(ABI!=null && addressContract != null && addressContract !="" && ABI != [] && typeof addressContract === 'string' && typeof ABI ==='object')
        return true;
    else
        return false;
}

function displayError_tagP(parent,idElm,text,color)
{
    const error = document.getElementById(parent).appendChild(document.createElement('p'));
    error.id = idElm;
    error.textContent = text;
    error.style.color = color;
}

export {createBtn, off_onLinks, isExistsContract,displayError_tagP};