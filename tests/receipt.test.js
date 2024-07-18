const request = require('supertest')
const app = require('../src/app')

test('Tests no spaces or special chars for retailer letters for alphanumeric, not a round dollar amoutn 00, if total is not multiple of 0.25, awards 5 points per two items on reciept, shortDescription length multiple of 3, purchase day odd, before 2pm', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [
              {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
              },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
              },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
              },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
              },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
              }
            ],
            "total": "35.35"
        }
    )

    const responsePoints = await request(app).get(`/receipts/${responseID.body.id}/points`)
    expect(responsePoints.body.points).toEqual(28)
})

test('Tests with spaces or special chars for retailer letters for alphanumeric, is a round dollar amoutn 00, if total is a multiple of 0.25, awards 5 points per two items on reciept, shortDescription length is not a multiple of 3, purchase day is not odd, during 2pm', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": "M&M Corner Market",
            "purchaseDate": "2022-03-20",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    )

    const responsePoints = await request(app).get(`/receipts/${responseID.body.id}/points`)
    expect(responsePoints.body.points).toEqual(109)
})

test('Tests without spaces or special chars for retailer letters for alphanumeric, is not a round dollar amoutn 00, if total is not a multiple of 0.25, awards 5 points per two items on reciept, shortDescription length is a multiple of 3, purchase day is not odd, before 2pm', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": "Walgreens",
            "purchaseDate": "2022-01-02",
            "purchaseTime": "08:13",
            "total": "2.65",
            "items": [
                {"shortDescription": "Pepsi - 12-oz", "price": "1.25"},
                {"shortDescription": "Dasani", "price": "1.40"}
            ]
        }
    )

    const responsePoints = await request(app).get(`/receipts/${responseID.body.id}/points`)
    expect(responsePoints.body.points).toEqual(15)
})

test('Tests without spaces or special chars for retailer letters for alphanumeric, is not a round dollar amoutn 00, if total is a multiple of 0.25, doesn\'t awards 5 points per two items on reciept, shortDescription length is not a multiple of 3, purchase day is not odd, before 2pm', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "2022-01-02",
            "purchaseTime": "13:13",
            "total": "1.25",
            "items": [
                {"shortDescription": "Pepsi - 12-oz", "price": "1.25"}
            ]
        }
    )

    const responsePoints = await request(app).get(`/receipts/${responseID.body.id}/points`)
    expect(responsePoints.body.points).toEqual(31)
})

test('Tests with spaces or special chars for retailer letters for alphanumeric, is a round dollar amoutn 00, if total is a multiple of 0.25, doesn\'t awards 5 points for one item on reciept, shortDescription length is not a multiple of 3, purchase day is not odd, during 2pm', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": " M&!@#$%^*()_-+=M Corner Market ",
            "purchaseDate": "2022-03-20",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    )

    const responsePoints = await request(app).get(`/receipts/${responseID.body.id}/points`)
    expect(responsePoints.body.points).toEqual(99)
})

test('Tests for no retailers', async () => {
    await request(app).post('/receipts/process').send(
        {
            "purchaseDate": "2022-03-20",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests for no purchaseDate', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "M&M Corner Market",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests for no purchaseTime', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "M&M Corner Market",
            "purchaseDate": "2022-03-20",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests for no items', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "M&M Corner Market",
            "purchaseDate": "2022-03-20",
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests for no total', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "M&M Corner Market",
            "purchaseDate": "2022-03-20",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ]
        }
    ).expect(400)
})

test('Tests for no shortDescription', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "M&M Corner Market",
            "purchaseDate": "2022-03-20",
            "purchaseTime": "14:33",
            "items": [
              {
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests for no price', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [
              {
                "shortDescription": "Mountain Dew 12PK"
              },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
              },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
              },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
              },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
              }
            ],
            "total": "35.35"
        }
    ).expect(400)
})

test('Tests for no body', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
           
        }
    ).expect(400)
})

test('Tests for retailer empty', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "",
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [
              {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
              },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
              },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
              },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
              },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
              }
            ],
            "total": "35.35"
        }
    ).expect(400)
})

test('Tests for purchaseDate empty', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "",
            "purchaseTime": "13:01",
            "items": [
              {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
              },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
              },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
              },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
              },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
              }
            ],
            "total": "35.35"
        }
    ).expect(400)
})

test('Tests for purchaseTime empty', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "",
            "purchaseTime": "13:01",
            "items": [
              {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
              },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
              },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
              },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
              },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
              }
            ],
            "total": "35.35"
        }
    ).expect(400)
})

test('Tests for items empty', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [],
            "total": "35.35"
        }
    ).expect(400)
})

test('Tests for total empty', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [
              {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
              },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
              },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
              },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
              },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
              }
            ],
            "total": ""
        }
    ).expect(400)
})

test('Tests for shortDescription empty', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [
              {
                "shortDescription": "",
                "price": "6.49"
              },{
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
              },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
              },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
              },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
              }
            ],
            "total": "35.35"
        }
    ).expect(400)
})

test('Tests for price empty', async () => {
    await request(app).post('/receipts/process').send(
        {
            "retailer": "Target",
            "purchaseDate": "2022-01-01",
            "purchaseTime": "13:01",
            "items": [
              {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
              },{
                "shortDescription": "Emils Cheese Pizza",
                "price": ""
              },{
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
              },{
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
              },{
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
              }
            ],
            "total": "35.35"
        }
    ).expect(400)
})

test('Tests purchaseDate day not propper date', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": " M&!@#$%^*()_-+=M Corner Market ",
            "purchaseDate": "2022-03-35",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests purchaseDate month not propper date', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": " M&!@#$%^*()_-+=M Corner Market ",
            "purchaseDate": "2022-13-25",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests purchaseDate year not propper date, year : 2125', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": " M&!@#$%^*()_-+=M Corner Market ",
            "purchaseDate": "2125-11-25",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests purchaseDate year, month, & day not propper date', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": " M&!@#$%^*()_-+=M Corner Market ",
            "purchaseDate": "2025-14-75",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests purchaseTime hour greater than 24 hours', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": " M&!@#$%^*()_-+=M Corner Market ",
            "purchaseDate": "2022-03-12",
            "purchaseTime": "26:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests purchaseTime minutes greater 60', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": " M&!@#$%^*()_-+=M Corner Market ",
            "purchaseDate": "2022-03-12",
            "purchaseTime": "26:65",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})

test('Tests purchaseTime minutes equal to 60', async () => {
    const responseID = await request(app).post('/receipts/process').send(
        {
            "retailer": " M&!@#$%^*()_-+=M Corner Market ",
            "purchaseDate": "2022-03-12",
            "purchaseTime": "26:60",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }
    ).expect(400)
})