# FUT Chrome Extension
A Chrome Extension to modify and play with the FIFA Web App JS

![Image of FIFA 21](https://www.logitheque.com/en/wp-content/uploads/sites/6/2020/09/fut-iphone.jpg)

### About
Chrome does not want you to execute JS code from within the loaded web page for security reasons.
Their solution is running the extension as a seperate HTML page and allow you to communicate with the users page through a 'bridge'.
This 'bridge' only allows you to insert/modify CSS and HTML on the users page, not custom JavaScript code.

I wanted to access the loaded web page JS variables and execute custom code, so I built a little work around.

This is coded and tested based on the FIFA 21 Web APP from EA Sports.
The extension is by no means safe to use and could result in a ban for the use of a 'bot' or automated actions, so use at your own risk.

Bellow I have listed the functionality of this extension and the reasoning behind why I have coded this.



### Current functionality
Functionality | Reasoning
------------ | -------------
Read transferlist data | Trying to access variables and data through the RootViewcontroller of the web app.
Name based player search | Storing and reading saved data for time saving and no need to reread certain data every restart
Buy/bid for players automaticly (in progress) | Execute API requests directly from the web app itself. This way the server should have no way of detecting the request is from outside the web app.
^ | Could avoid ban/blocking from sending requests. (Not tested, however I have not received any warning or ban yet)


### Future ideas

Functionality | Reasoning
------------ | -------------
Automatic reselling of bought items | Web workers and backgorund threads => buying and selling at the same time
Automatic SBC based on solved versions on sites like FUTBIN | Getting and using data from an other source


### Future
This project is for fun and experimenting and will only be developed when I have some spare time.
Because of this, updates can take a while. :)
