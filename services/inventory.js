const { base, Table, ThingCategories } = require('../db');

const things = base(Table.Things);
const inventory = base(Table.Inventory);

const mapItem = (record) => {
    return {
        id: record.id,
        number: Number(record.get('ID')),
        name: record.get('Name')[0],
        available: record.get('Active Loans') === 0,
        brand: record.get('Brand'),
        estimatedValue: record.get('Estimated Value'),
        totalLoans: record.get('Total Loans'),
        images: record.get('Picture')?.map(image => image.url) || []
    };
}

const mapThing = (record) => {
    return {
        id: record.id,
        name: record.get('Name'),
        name_es: record.get('name_es'),
        stock: Number(record.get('Stock')),
        available: Number(record.get('Available')),
        images: record.get('Image')?.map(image => image.url) || [],
        categories: record.get('Category') || []
    };
}

const mapDetailedThing = (record, items) => {
    return {
        id: record.id,
        name: record.get('Name'),
        name_es: record.get('name_es'),
        stock: Number(record.get('Stock')),
        available: Number(record.get('Available')),
        items
    };
}

const fetchCategories = () => ThingCategories;

const fetchInventory = async () => {
    const records = await inventory.select({
        view: 'api_fetch_things',
        fields: ['ID', 'Name', 'Active Loans', 'Picture'],
        pageSize: 100
    }).all();

    return records.map((r) => mapItem(r));
}

const fetchInventoryItem = async ({ id }) => {
    const records = await inventory.select({
        view: 'api_fetch_things',
        fields: ['ID', 'Name', 'Active Loans', 'Total Loans', 'Picture'],
        filterByFormula: `{ID} = '${id}'`,
        pageSize: 100
    }).all();

    return mapItem(records[0]);
}

const createInventoryItems = async (thingId, { quantity, brand, description, estimatedValue }) => {
    const inventoryData = Array.from(Array(Number(quantity))).map(() => ({
        fields: {
            'Thing': [thingId],
            'Brand': brand,
            'Description': description,
            'Estimated Value': Number(estimatedValue)
        }
    }));

    const records = await inventory.create(inventoryData);

    return records.map(mapItem);
}

const fetchThings = async () => {
    const records = await things.select({
        view: 'api_by_name',
        fields: ['Name', 'name_es', 'Stock', 'Available', 'Image', 'Category'],
        pageSize: 100
    }).all();

    return records.map(mapThing);
}

const fetchThing = async ({ id }) => {
    const record = await things.find(id);

    const itemIds = record.get('Inventory');

    const itemPromises = itemIds?.map(id => {
        return inventory.find(id)
    });

    const items = (await Promise.all(itemPromises || [])).map(mapItem);

    return record ? mapDetailedThing(record, items) : null;
}

const createThing = async ({ name, spanishName }) => {
    const record = await things.create({
        'Name': name,
        name_es: spanishName
    });

    return record ? mapDetailedThing(record, []) : null;
}

const updateThing = async (id, { name, spanishName }) => {
    const record = await things.update(id, {
        'Name': name,
        'name_es': spanishName
    });

    return mapDetailedThing(record);
}

module.exports = {
    fetchCategories,
    fetchInventory,
    fetchInventoryItem,
    createInventoryItems,
    fetchThings,
    fetchThing,
    createThing,
    updateThing
};