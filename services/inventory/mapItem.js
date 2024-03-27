function mapItem(record) {
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

module.exports = mapItem;