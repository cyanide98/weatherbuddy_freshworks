## Weather Buddy - Freshworks

A Freshdesk app that displays the weather for the support agent in the Ticket Page. The app also allows an agent to pick an alternate city and a future date (within 5 days) and display the weather for the same.

The agent will only be interested in 2 weather parameters - Temperature and Wind Speed. Agents would be pleased if your app remembered and provided quick access to the last 5 locations they viewed.

Expectations:

- The app would be built using the V2 version of our platform.

- The app would primarily use platform features wherever possible.

- A packed zip file would be submitted as a working version of the app that can be deployed, installed and tested in any Freshdesk account.

- The app would adhere to our coding guidelines mentioned here, with a keen eye on security aspects.

- The styling would adhere to our style guide. However, we mainly expect to receive a functional app, not necessarily a pretty one.

### Folder structure explained

    .
    ├── README.md                  This file
    ├── app                        Contains the files that are required for the front end component of the app
    │   ├── app.js                 JS to render the dynamic portions of the app
    │   ├── icon.svg               Sidebar icon SVG file. Should have a resolution of 64x64px.
    │   ├── freshdesk_logo.png     The Freshdesk logo that is displayed in the app
    │   ├── style.css              Style sheet for the app
    │   ├── template.html          Contains the HTML required for the app’s UI
    ├── config                     Contains the installation parameters and OAuth configuration
    │   ├── iparams.json           Contains the parameters that will be collected during installation
    │   └── iparam_test_data.json  Contains sample Iparam values that will used during testing
    └── manifest.json              Contains app meta data and configuration information
Client Link: https://www.freshworks.com/
