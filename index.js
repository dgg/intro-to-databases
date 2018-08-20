var redis = require('redis')
var client = redis.createClient()

client.on_connect(() => {
    console.log('client connected')
})

const userId = '7c872647-f804-48d1-9386-4846c5d595bb'
let basket = {
    id : 1,
    name: 'normal basket',
    owner: userId,
    lines : [
        {
            catalogId: 'TOYS',
            sku : 'a',
            url : '//amazon.com/products/toys/barbie',
            quantity : 39,
            unitPrice : {
                value: 759.0,
                currency: 'DKK'
            },
        }
    ],
    delivery : {
        name: "me",
        line1: "Tirsbæk Søvej 63",
        line2 : 'something else',
        postalCode: "7120",
        city: "Vejle Ø",
        region: '',
        countryCode : 'DK'
    },
    billing : {
        name: "me",
        line1: "Tirsbæk Søvej 63",
        postalCode: "7120",
        city: "Vejle Ø",
        region: '',
        countryCode : 'DK'
    }
}

/* Meh: JSON-ify */
let basketKey = 'baskets:json' + userId
client.set(basketKey, JSON.stringify(basket), redis.print)
client.get(basketKey, (error, result) => {
    if (error) {
        console.error(error)
        throw error
    }
    console.log('straight from redis', result)
    console.log('parsed', JSON.parse(result))
})

/* thought provoking: hashing objects */

var flat = require('flat')

basketKey = 'baskets:hash' + userId
let flattened = flat(basket)
console.log(flattened)
/* BAD: multiple commands to Redis
Object.keys(flattened).map(hk => {
    client.hset(basketKey, hk, flattened[hk])
})*/

// BETTER: convert object to array and single command to Redis
let objArray = []
Object.keys(flattened).map(k =>{
    objArray.push(k, flattened[k])
})
client.hmset(basketKey, objArray)
client.hgetall(basketKey, (error, result) =>{
    if (error) {
        console.error(error)
        throw error
    }
    console.log('straight from redis', result)
    console.log('unflatten it', flat.unflatten(result))
})
client.quit()