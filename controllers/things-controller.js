var Airtable = require('airtable') 
var base = new Airtable({ apiKey: 'key7xmscTskxd2T75' }).base('appBYEa4vGVLAXEbe')
const table = base('Things')

const getAll = async () => {
    const result =  await table.select({
        view: 'All Things',
        fields: ["Name", "Category", "Stock", "Location", "Image"],
        filterByFormula: "NOT({Hidden})"
    }).firstPage()

    return result.map(minify)
}

const minify = (thing) => {
    return {
        id: thing.id,
        name: thing.fields.Name,
        categories: thing.fields.Category,
        image: getImage(thing.fields.Image),
        stock: thing.fields.Stock,
        location: thing.fields.Location
    }
}

const getImage = (image) => {
    if (!image) return null
    return image[0].thumbnails.large.url
}

const getCategories = () => {
    return [
        "DIY",
        "Media",
        "Games",
        "Outdoors",
        "Sports",
        "Entertainment",
        "Yard",
        "Cleaning",
        "Cooking",
        "Crafts",
        "Pet",
        "Automotive",
        "Health"
    ]
}

const getLocations = () => {
    return [
        "Storage",
        "PPL"
    ]
}

module.exports = {
    getAll,
    getCategories,
    getLocations
}