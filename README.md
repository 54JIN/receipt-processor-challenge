# Author: Sajin Saju

---
## Setting up the environment

1. Download & install Node.js (Choose the correct environment macOS, Windows, Linux, etc. ) - Installing Node.js should automatiacally provide NPM as its included in the download.
    * https://nodejs.org/en/
        - Verify node is installed by executing the line:
            * node -v
        - Verify npm is installed by executing the line:
            * npm -v
2. Open up a text editor - visual studio code provided 
    * https://code.visualstudio.com
3. Open up the folder
4. Install all necesssary npm packages, in the terminal execute the line:
    * npm i
5. Once the npm packages are installed and a node module folder is created, to activate the API - in the terminal execute the line:
    * npm run dev
        - If port 3000 is already running in your system you have two options:
            * Option 1:
                - Terminate the application running in the port 3000 in your local system
                    1. Execute the line:
                        * lsof -i :3000
                            - This will give you a list of applications running on that port
                            - Identify the `PID` of the application
                                * For example it can look like `90809`, `1035`, or `0000`, etc.
                        * kill -9: `PID`
            * Option 2:
                - Manually Change the port number in the `index.js` file (`src/index.js`)
                    * `const port = 3000`

---
## Storage of data

1. As data does not need to persist when the application stops, data is stored locally in a varaible called receipts.

## Paths

1.  `/receipts/process`
    * Method: `POST`

2.  `/receipts/{id}/points`
    * Method: `GET`



## Rules for Points per receipt

These rules collectively define how many points should be awarded to a receipt.

* One point for every alphanumeric character in the retailer name.
* 50 points if the total is a round dollar amount with no cents.
* 25 points if the total is a multiple of `0.25`.
* 5 points for every two items on the receipt.
* If the trimmed length of the item description is a multiple of 3, multiply the price by `0.2` and round up to the nearest integer. The result is the number of points earned.
* 6 points if the day in the purchase date is odd.
* 10 points if the time of purchase is after 2:00pm and before 4:00pm.