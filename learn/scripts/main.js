const textElm = document.getElementById("text");

let pi;
let piDigits;

let progress = 0;

let cursor;

const blockLength = 10;
const queriedBlocks = 2;

main();

async function main() {
    await loadPi();
    ui.init();
    ui.setVisibility({task: false, solution: false, settings: false});
    ui.updatePositionDisplay();
    for (let i = 0; i < blockLength*queriedBlocks; i++) {
        if (i%blockLength === 0) digitsInput.innerHTML += " ";
        digitsInput.innerHTML += '<span style="outline: 1px solid gray;">&nbsp;</span>';
    }
    document.onkeydown = evt => {
        if (evt.key === "Enter") start();
        else if (evt.key === "S") setTimeout(showSettings, 1);
    }
}

async function loadPi() {
    const file = await fetch("../digits/pi5.txt");
    pi = await file.text();
    piDigits = 1e5;
}

function start() {
    ui.setVisibility({startButton: false, task: true, solution: false, keyboard: true});
    
    ui.updatePositionDisplay();
    
    const pos = progress+2;
    
    digitsBeforeDisplay.innerHTML = solutionDisplayBefore.innerHTML = (pos <= blockLength) ? pi.slice(0, pos) : ("... " + pi.slice(pos-blockLength, pos));
    for (let i = 0; i < blockLength*queriedBlocks; i++) {
        digitsInput.children[i].innerHTML = "&nbsp;";
        digitsInput.children[i].style.backgroundColor = "";
    }
    digitsAfterDisplay.innerHTML = solutionDisplayAfter.innerHTML = pi.slice(pos+blockLength*queriedBlocks, pos+blockLength*(queriedBlocks+1)) + " ...";
    
    cursor = 0;
    
    document.onkeydown = evt => {
        switch (evt.key) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                input(evt.key*1);
                break;
            case "Enter":
                input("enter");
                break;
            case "Backspace":
                input("del");
                break;
            case "S":
                setTimeout(showSettings, 1);
                break;
        }
    }
}

function input(action) {
    if (typeof action === "number") {
        ui.animateKeyPress(action);
        if (cursor === blockLength*queriedBlocks) return;
        digitsInput.children[cursor].innerHTML = action;
        cursor++;
    } else if (action === "del") {
        ui.animateKeyPress(action);
        if (cursor === 0) return;
        cursor--;
        digitsInput.children[cursor].innerHTML = "&nbsp;";
    } else if (action === "enter") {
        ui.animateKeyPress(action);
        if (cursor !== blockLength*queriedBlocks) return;
        check();
    }
}

async function check() {
    ui.setVisibility({solution: true, keyboard: false});
    
    document.onkeydown = evt => {
        if (evt.key === "Enter") start();
        else if (evt.key === "S") setTimeout(showSettings, 1);
    }
    
    let solution = "";
    
    const pos = progress+2;
    
    solutionDisplayTask.innerHTML = "";
    for (let i = 0; i < blockLength*queriedBlocks; i += blockLength) solutionDisplayTask.innerHTML += " " + pi.slice(pos+i, pos+i+blockLength);
    
    let result = [];
    
    for (let i = 0; i < blockLength*queriedBlocks; i++) {
        const elm = digitsInput.children[i];
        const correct = (elm.innerHTML === pi[pos+i]);
        elm.style.backgroundColor = correct ? "#afa" : "#fdc";
        result.push(correct);
        await new Promise(r => setTimeout(r, 10));
    }
    
    let mistakes = 0;
    for (let i = 0; i < blockLength*queriedBlocks; i++) {
        if (!result[i]) mistakes ++;
    }
    
    let mistakeInFirstBlock = false;
    for (let i = 0; i < blockLength; i++) {
        if (!result[i]) mistakeInFirstBlock = true;
    }
    
    if (mistakeInFirstBlock) {
        if (progress > 0) progress -= blockLength;
    } else if (mistakes === 0) {
        progress += blockLength;
    }
    
    ui.setVisibility({startButton: true});
}

function showSettings() {
    ui.setVisibility({settings: true});
    
    positionSetting.value = progress;
    positionSetting.focus();
    
    const previousEventAction = document.onkeydown;
    document.onkeydown = evt => {
        if (evt.key === "Enter") apply();
        else if (evt.key === "Escape") {
            settings.style.opacity = "0";
            settings.style.pointerEvents = "none";
            document.onkeydown = previousEventAction;
        }
    }
}

function isPositionValid(position) {
    position = Number(position);
    if (isNaN(position)) return false;
    if (position%1 !== 0) return false;
    if (position < 0) return false;
    if (position > piDigits - blockLength * queriedBlocks) return false;
    if (position % blockLength !== 0) return false;
    return true;
}

function updatePositionSetting() {
    const valid = isPositionValid(positionSetting.value);
    
    positionSetting.style.backgroundColor = valid ? "" : "#f88";
    
    return valid;
}

async function apply() {
    ui.animateKeyPress(applyButton);
    
    if (updatePositionSetting()) {
        progress = positionSetting.value*1;
    }
    
    ui.setVisibility({settings: false, task: false, solution: false, keyboard: false, startButton: true});
    ui.updatePositionDisplay();
    
    document.onkeydown = evt => {
        if (evt.key === "Enter") start();
        else if (evt.key === "S") setTimeout(showSettings, 1);
    }
}
