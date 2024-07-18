// author: Sajin Saju

const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express()

app.use(express.json())

/* 
    Objective: variable receipts is a local memory storage for incoming reciepts
    Use case: Stores points based on Unique ID
    Retrieval: O(1) time complexity for retrieval
*/
let receipts = {};

/* 
    Objective: Creates a Unique ID per reciept posted to server, calculate the necessary points, then associate the points with its Unique ID to local memory, finally send the Unique ID back.
    Request: receipt
    Response: Unique ID
*/
app.post('/receipts/process' , (req, res) => {
    const receipt = req.body;
    const id = uuidv4(); //Creates the unique ID

    try {
        receipts[id] = calculatePoints(receipt)
        res.status(201).send({ id })
    } catch (e) {
        res.status(400).send(e)
    }
})

/* 
    Objective: Send back the amount of points associated with the reciept based on the given Unique ID in params 
    Params: Unique ID associated with a reciept
*/
app.get('/receipts/:id/points', (req, res) => {
    const id = req.params.id;
    res.send({ points: receipts[id] })
})

/* 
    Objective: Calculates the amount of points to be awared per given receipt
    Parameters: receipt
    Returns: return a number value (the value represents the amount of points associated with the receipt)
*/
function calculatePoints(receipt) {
    try {
        //Destructuring
        const { retailer, purchaseDate, purchaseTime, items, total } = receipt;
        
        //Dates
        const dateOfPurchase = new Date(purchaseDate)
        dateOfPurchase.setHours(0,0,0,0)
        const today = new Date()
        today.setHours(0,0,0,0)
        const [ hour, minutes ] = purchaseTime.split(':').map(Number);

        /* Error Checks */
        //Throw error if total is either empty or doesn't exist
        if(!total || total === ''){
            throw new Error('total is either empty or doesn\'t exist')
        } 
        //Throw error if retailer || items is empty
        else if(retailer.length === 0) {
            throw new Error('retailer is empty')
        }
        else if(items.length === 0) {
            throw new Error('items is empty')
        }
        //Throw error purchaseDate || purchaseTime is empty or incorrect
        else if(purchaseDate.length === 0 || isNaN(dateOfPurchase) || (dateOfPurchase > today)) {
            throw new Error('purchaseDate is empty')
        }
        else if(purchaseTime.length === 0 || (hour > 24 || hour < 0) || (minutes > 59 || minutes < 0) ) {
            throw new Error('purchaseTime is empty')
        }

        //Points is the value to be returned
        let points = 0;

        //One Point for every alphanumeric character in the retailer name
        let regex = /^[a-zA-Z0-9]+$/;
        for(let i = 0; i < retailer.length; i++) {
            if(regex.test(retailer[i])){
                points++;
            }
        }

        //50 Points if the total is a round dollar amount with no cents
        points += total % 1 === 0? 50 : 0;

        //25 points if the total is a multiple of 0.25
        points += total % 0.25 === 0? 25 : 0;

        //5 points for every two items on the receipt
        points += Math.floor(items.length/2) * 5;

        /* 
            If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. 
            The result is the number of points earned.
        */
        for(item in items) {
            //Throw error if shortDescription is either empty or doesn't exist
            if (!items[item].shortDescription || items[item].shortDescription === '') {
                throw new Error('shortDescription is empty')
            }
            //Throw error if price is either empty or doesn't exist
            else if (!items[item].price || items[item].price === '') {
                throw new Error('price is empty')
            }
            points += items[item].shortDescription.trim().length % 3 === 0? Math.ceil(items[item].price * 0.2) : 0;
        }

        //6 points if the day in the purchase date is odd
        points += parseInt(purchaseDate.split("-")[2]) % 2 === 1? 6 : 0;

        //10 points if the time of purchase is after 2:00pm and before 4:00pm.
        points += hour >= 14 && hour <= 16? 10 : 0;

        return points;
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = app;