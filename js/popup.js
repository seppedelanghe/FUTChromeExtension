var port = null;

var futstorage = {
    isInjected: false,
    searchResults: [],
}

const baseRequests = () => {
    console.log(futstorage);

    if (futstorage.isInjected) {
        // Disable inject button
        let button = document.getElementById('btn-inject');
        button.disabled = true;

        setTimeout(() => {
            // If injected, ask for initial data
            port.postMessage({ action: 'init' });
        }, 500);
    }
}

const injectBackdoor = () => {
    port.postMessage({ action: 'inject' });
}

const checkInjection = () => {
    port.postMessage({ action: 'checkInjection' });
}

const notifyMessage = (msg, warning=false) => {
    if (warning) {
        console.warn(msg);
    } else {
        console.log(msg);
    }
}


// Getters
const fetchLowestForFilters = async () => {
    port.postMessage({action: 'update', update: { id: 'result-lowest-price', data: 'getLowestForFilters' }});
}

const searchPlayers = () => {
    const searchInput = document.getElementById('player-search');
    if (searchInput.value !== null && searchInput.value !== "") {
        port.postMessage({ action: 'searchPlayers', data: searchInput.value });
    } else {
        notifyMessage("No search entered!", true);
    }
}


// Updates
const updatePlayerList = (players) => {
    // update temp cache
    futstorage.searchResults = players;

    // get html list
    let list = document.getElementById('player-search-list');

    // Clear last searches
    list.innerHTML = "";

    // insert new players
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        let row = document.createElement('tr');

        let name = document.createElement('td');
        name.innerHTML = player.Name;

        let photo = document.createElement('td');
        photo.innerHTML = `<img src="${player.Photo}" alt="${player.name}">`;

        let nation = document.createElement('td');
        nation.innerHTML = `<img src="${player.Flag}" alt="${player.Nationality}" >`;

        let rating = document.createElement('td');
        rating.innerHTML = player.Overall;

        let club = document.createElement('td');
        club.innerHTML = player.Club;

        row.appendChild(photo);
        row.appendChild(name);
        row.appendChild(club);
        row.appendChild(nation);
        row.appendChild(rating);

        // add click event and data
        row.dataset.playerId = player.ID;
        row.addEventListener('click', addPlayerToBuyList, true);

        list.appendChild(row);
    }
}

const addPlayerToBuyList = (event) => {
    if (futstorage.searchResults.length === 0) {
        notifyMessage('No search results... please try searching again.', true);
        return;
    }

    let row = event.srcElement.parentElement;
    let id = row.dataset.playerId;
    const player = futstorage.searchResults.find(p => p.ID.toString() === id);

    if (player === null) {
        notifyMessage('Could not add player.', true);
        return;
    }

    // get html list
    let list = document.getElementById('player-buy-list');
    let listrow = document.createElement('tr');

    let name = document.createElement('td');
    name.innerHTML = player.Name;

    let photo = document.createElement('td');
    photo.innerHTML = `<img src="${player.Photo}" alt="${player.name}">`;

    let bid = document.createElement('td');
    bid.innerHTML = `<input type="number" step="100" name="player-bid" id="player-bid-${id}">`;

    let bin = document.createElement('td');
    bin.innerHTML = `<input type="number" step="100" name="player-bin" id="player-bin-${id}">`;

    let options = document.createElement('td');
    options.innerHTML = "<button>snipe</button>";

    listrow.appendChild(photo);
    listrow.appendChild(name);
    listrow.appendChild(bid);
    listrow.appendChild(bin);
    listrow.appendChild(options);

    // add data id
    listrow.dataset.playerId = player.ID;

    // insert row into list
    list.appendChild(listrow);

    showBuyList();
};

const showBuyList = () => {
    let div = document.getElementById('player-buy-list-tool');
    if (div.classList.contains('tool-hidden')) {
        div.classList.remove('tool-hidden');
    }
}

const hideBuyList = () => {
    let div = document.getElementById('player-buy-list-tool');
    if (!div.classList.contains('tool-hidden')) {
        div.classList.add('tool-hidden');
    }
}

responseHandeler = (response) => {
    switch (response.action) {
        case 'init':
            if (response.updates && response.updates.length > 0) {
                response.updates.forEach(u => {
                    document.getElementById(u.id).innerText = u.value;
                });
            } else {
                console.warn('Could not get UI updates');
            }
            break;
        
        case 'update':
            document.getElementById(response.update.id).innerHTML = response.update.value;
            break;
        
        case 'inject':
            futstorage.isInjected = true;
            baseRequests();
            break;
        
        case 'checkInjection':
            futstorage.isInjected = response.isInjected;
            // after check, do base requests
            baseRequests();
            break;

        case 'searchPlayers':
            updatePlayerList(response.data);
            break;
    
        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Open connection with background
    port = chrome.runtime.connect({ name: "popup" });

    // add event listener for messages
    port.onMessage.addListener(responseHandeler);

    // Event listeners
    document.getElementById('btn-search-players').addEventListener('click', searchPlayers);
    document.getElementById('btn-inject').addEventListener('click', injectBackdoor);

    // check injection
    checkInjection();
});