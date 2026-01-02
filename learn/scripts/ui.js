const ui = {};

ui.init = function() {
    ui.startButtonHeight = startButton.getBoundingClientRect().height;
    ui.inputHeight = keyboard.getBoundingClientRect().height;
    for (let i = 1; i <= 9; i++) ui.createButton(i, i);
    ui.createButton("⌫", "del");
    ui.createButton("0", 0);
    ui.createButton("↵", "enter");
};

ui.createButton = function(text, action) {
    const button = document.createElement("div");
    keyboard.appendChild(button);
    button.innerHTML = text;
    button.classList.add("button");
    button.addEventListener("pointerdown", () => input(action));
};

ui.setElmVisibility = function(elm, visible) {
    if (typeof elm === "string") elm = document.getElementById(elm);
    if (elm instanceof HTMLElement) elm.style.display = visible ? "" : "none";
    else console.warn("could not find element:", elm);
};

ui.hide = function(...elms) {
    for (const elm of elms) setElmVisibility(elm, false);
};

ui.show = function(...elms) {
    for (const elm of elms) setElmVisibility(elm, true);
};

ui.setStartButtonVisibility = function(visible) {
    startButtonContainer.style.height = visible ? ui.startButtonHeight+"px" : "0px";
};

ui.setTaskVisibility = function(visible) {
    ui.setElmVisibility(taskDigitsDiv, visible);
};

ui.setSolutionVisibility = function(visible) {
    ui.setElmVisibility(solutionDisplay, visible);
};

ui.setKeyboardVisibility = function(visible) { 
    inputDiv.style.height = visible ? ui.inputHeight+"px" : "0px";
};

ui.setSettingsVisibility = function(visible) {
    settings.style.opacity = visible ? "1" : "0";
    settings.style.pointerEvents = visible ? "" : "none";
};

ui.setVisibility = function(data) {
    for (const key in data) {
        switch (key) {
            case "startButton": ui.setStartButtonVisibility(data[key]); break;
            case "task": ui.setTaskVisibility(data[key]); break;
            case "solution": ui.setSolutionVisibility(data[key]); break;
            case "keyboard": ui.setKeyboardVisibility(data[key]); break;
            case "settings": ui.setSettingsVisibility(data[key]); break;
            default: console.warn("Unknown element: "+key);
        }
    }
};

ui.animateKeyPress = function(action) {
    let key;
    if (action instanceof HTMLElement) key = action;
    else if (action === 0) key = keyboard.children[10];
    else if (action === "del") key = keyboard.children[9];
    else if (action === "enter") key = keyboard.children[11];
    else key = keyboard.children[action-1];
    key.animate(
        [
            { scale: 1 },
            { scale: 0.8 },
            { scale: 1 }
        ], {
            duration: 100,
            iterations: 1
        }
    );
};

ui.updatePositionDisplay = function() {
    const text = `Position ${progress+1} to ${progress+blockLength*queriedBlocks}`;
    positionDisplay.innerHTML = text;
};
