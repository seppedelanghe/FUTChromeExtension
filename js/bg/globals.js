var futTab = null;

const asc = true; // Sorting of players

var store = {
    sessionId: null,
    isInjected: false,
    players: null,
    search: null,
    boughtPlayers: [],
};

var handlers = {}

chrome.runtime.getPackageDirectoryEntry(function(root) {
    root.getFile("data/players.json", {}, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                var myFile = JSON.parse(this.result);
                /*do here whatever with your JS object(s)*/
                store.players = myFile;
            };
            reader.readAsText(file);
        });
    });
});