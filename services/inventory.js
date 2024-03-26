const { base, Table, ThingCategories } = require('../db');

const things = base(Table.Things);
const inventory = base(Table.Inventory);

const mapItem = (record) => {
    const hidden = Boolean(record.get('Hidden'));
    const isThingHidden = record.get('is_thing_hidden') === 1;

    return {
        id: record.id,
        number: Number(record.get('ID')),
        name: record.get('Name')[0],
        available: record.get('Active Loans') === 0
            && !hidden
            && !isThingHidden,
        hidden: hidden || isThingHidden,
        brand: record.get('Brand'),
        description: record.get('Description'),
        estimatedValue: record.get('Estimated Value'),
        eyeProtection: Boolean(record.get('Eye Protection')),
        condition: record.get('Condition'),
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
        categories: record.get('Category') || [],
        hidden: Boolean(record.get('Hidden'))
    };
}

const mapDetailedThing = (record, items) => {
    return {
        id: record.id,
        name: record.get('Name'),
        name_es: record.get('name_es'),
        stock: Number(record.get('Stock')),
        available: Number(record.get('Available')),
        hidden: Boolean(record.get('Hidden')),
        categories: record.get('Category') || [],
        eyeProtection: Boolean(record.get('Eye Protection')),
        images: record.get('Image')?.map(i => ({
            id: i.id,
            url: i.url,
            width: i.width,
            height: i.height,
            type: i.type
        })) || [],
        items
    };
}

const fetchCategories = () => ThingCategories;

const fetchInventory = async () => {
    const records = await inventory.select({
        view: 'api_fetch_things',
        fields: [
            'ID', 
            'Name', 
            'Brand',
            'Description',
            'Eye Protection',
            'Active Loans', 
            'Total Loans',
            'Picture', 
            'Hidden', 
            'Condition',
            'Estimated Value',
            'is_thing_hidden'
        ],
        pageSize: 100
    }).all();

    return records.map((r) => mapItem(r));
}

const fetchInventoryItem = async ({ id }) => {
    const records = await inventory.select({
        view: 'api_fetch_things',
        fields: [
            'ID', 
            'Name', 
            'Brand',
            'Description',
            'Eye Protection',
            'Active Loans', 
            'Total Loans',
            'Picture', 
            'Hidden', 
            'Condition',
            'Estimated Value',
            'is_thing_hidden'
        ],
        filterByFormula: `{ID} = '${id}'`,
        pageSize: 100
    }).all();

    return mapItem(records[0]);
}

const createInventoryItems = async (thingId, { quantity, brand, description, estimatedValue, hidden, condition, image }) => {
    const inventoryData = Array.from(Array(Number(quantity))).map(() => ({
        fields: {
            'Thing': [thingId],
            'Brand': brand,
            'Condition': condition,
            'Description': description,
            'Estimated Value': Number(estimatedValue),
            'Hidden': hidden,
            'Picture': image?.url ? [{ url: image.url }] : []
        }
    }));

    const records = await inventory.create(inventoryData);

    return records.map(mapItem);
}

const updateInventoryItem = async (id, { brand, description, estimatedValue, hidden, condition, image }) => {
    let updatedFields = {};

    if (brand) {
        updatedFields['Brand'] = brand;
    }

    if (description) {
        updatedFields['Description'] = description;
    }

    if (estimatedValue) {
        updatedFields['Estimated Value'] = estimatedValue;
    }

    if (hidden !== null) {
        updatedFields['Hidden'] = hidden;
    }

    if (condition !== null) {
        updatedFields['Condition'] = condition;
    }

    if (image !== null) {
        updatedFields['Picture'] = image.url ? [{ url: image.url }] : [];
    }

    await inventory.update(id, updatedFields);
}

const deleteInventoryItem = async (id) => {
    await inventory.destroy(id);
}

const fetchThings = async () => {
    const records = await things.select({
        view: 'api_by_name',
        fields: ['Name', 'name_es', 'Stock', 'Available', 'Image', 'Category', 'Hidden'],
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

const createThing = async ({ name, spanishName, hidden, image, eyeProtection }) => {
    const record = await things.create({
        'Name': name,
        'name_es': spanishName,
        'Eye Protection': eyeProtection,
        'Hidden': hidden,
        'Image': image?.url ? [{ url: image.url }] : []
    });

    return record ? mapDetailedThing(record, []) : null;
}

const updateThing = async (id, { name, spanishName, hidden, image, eyeProtection }) => {
    let updatedFields = {};

    if (name) {
        updatedFields['Name'] = name;
    }

    if (spanishName) {
        updatedFields['name_es'] = spanishName;
    }

    if (hidden !== null) {
        updatedFields['Hidden'] = hidden;
    }

    if (image?.url) {
        updatedFields['Image'] = [{ url: image.url }];
    }

    if (eyeProtection !== null) {
        updatedFields['Eye Protection'] = eyeProtection;
    }

    await things.update(id, updatedFields);
}

const deleteThing = async (id) => {
    await things.destroy(id);
}

const updateThingCategories = async (id, { categories }) => {
    await things.update(id, { 'Category': categories });
}

const deleteThingImage = async (id) => {
    const record = await things.update(id, { 'Image': [] });
    return mapDetailedThing(record);
}

module.exports = {
    fetchCategories,
    fetchInventory,
    fetchInventoryItem,
    createInventoryItems,
    updateInventoryItem,
    deleteInventoryItem,
    fetchThings,
    fetchThing,
    createThing,
    updateThing,
    deleteThing,
    updateThingCategories,
    deleteThingImage
};