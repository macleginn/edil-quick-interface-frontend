function byId(id) {
    return document.getElementById(id);
}

const requestURL = 'http://127.0.0.1:9000'

document.addEventListener('DOMContentLoaded', () => {
    if (byId('wordform-input') !== null)
        byId('wordform-input').oninput = worformHandler;

    if (byId('lemma-input') !== null)
        byId('lemma-input').oninput = lemmaHandler;
});

async function worformHandler(event) {
    const form = event.target.value;
    if (form === "")
        return;
    const response = await fetch(`${requestURL}/query/wordforms/${form}?numvars=300`);
    if (!response.ok) {
        const error = await response.text();
        alert(`Server communication failure: ${error}`);
        return;
    }
    const data = await response.json();
    let variantDiv = byId('variants');
    while (variantDiv.hasChildNodes()) {
        variantDiv.removeChild(variantDiv.lastChild);
    }
    for (const triple of data) {
        let linkDiv = document.createElement('div');
        let variantSpan = document.createElement('span');
        variantSpan.innerText = triple[0] + ' => ';
        linkDiv.append(variantSpan);
        let pseudoLink = document.createElement('span');
        pseudoLink.style.textDecoration = 'underline';
        pseudoLink.style.color = 'blue';
        pseudoLink.style.cursor = 'pointer';
        pseudoLink.innerText = triple[2];
        pseudoLink.onclick = () => { showEntry(triple[1]); }
        linkDiv.append(pseudoLink);
        variantDiv.append(linkDiv);
    }
}

async function lemmaHandler(event) {
    const form = event.target.value;
    if (form === "")
        return;
    const response = await fetch(`${requestURL}/query/lemmas/${form}?numvars=300`);
    if (!response.ok) {
        const error = await response.text();
        alert(`Server communication failure: ${error}`);
        return;
    }
    const data = await response.json();
    let variantDiv = byId('variants');
    while (variantDiv.hasChildNodes()) {
        variantDiv.removeChild(variantDiv.lastChild);
    }
    for (const triple of data) {
        let linkDiv = document.createElement('div');
        let pseudoLink = document.createElement('span');
        pseudoLink.style.textDecoration = 'underline';
        pseudoLink.style.color = 'blue';
        pseudoLink.style.cursor = 'pointer';
        pseudoLink.innerText = triple[0];
        pseudoLink.onclick = () => { showEntry(triple[1]); }
        linkDiv.append(pseudoLink);
        variantDiv.append(linkDiv);
    }
}

async function showEntry(entryId) {
    const response = await fetch(`${requestURL}/dil/${entryId}`);
    if (!response.ok) {
        const error = await response.text();
        alert(`No connection to the DIL server: ${error}`);
        return;
    }
    const data = await response.text();
    byId('results').innerHTML = data.slice('<?xml version="1.0"?>'.length);
}