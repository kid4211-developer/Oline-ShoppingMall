const price = [
    {
        _id: 0,
        name: 'Any',
        array: [],
    },
    {
        _id: 1,
        name: '$0 to $499',
        array: [0, 499],
    },
    {
        _id: 2,
        name: '$500 to $899',
        array: [500, 899],
    },
    {
        _id: 3,
        name: '$900 to $999',
        array: [900, 999],
    },
    {
        _id: 4,
        name: '$1000 to $1299',
        array: [1000, 1299],
    },
    {
        _id: 5,
        name: 'More than $1300',
        array: [1300, 1500000],
    },
];

const continents = [
    {
        _id: 1,
        name: 'Africa',
    },
    {
        _id: 2,
        name: 'Europe',
    },
    {
        _id: 3,
        name: 'Asia',
    },
    {
        _id: 4,
        name: 'North America',
    },
    {
        _id: 5,
        name: 'South America',
    },
    {
        _id: 6,
        name: 'Australia',
    },
    {
        _id: 7,
        name: 'Antarctica',
    },
];

export { price, continents };
