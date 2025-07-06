const products = [
    {
        id: 'prod_001',
        name: 'Universal Travel Adapter',
        description: 'Charge your devices in over 150 countries. A must-have for international travel.',
        price: 24.99,
        imageUrl: '/products/adapter.png', // Placeholder image path
        keywords: ['international', 'electronics']
    },
    {
        id: 'prod_002',
        name: '7-Day International SIM Card (5GB Data)',
        description: 'Stay connected with high-speed data as soon as you land.',
        price: 29.99,
        imageUrl: '/products/simcard.png',
        keywords: ['international', 'connectivity']
    },
    {
        id: 'prod_003',
        name: 'Portable Neck Pillow',
        description: 'Sleep comfortably on long-haul flights.',
        price: 19.99,
        imageUrl: '/products/pillow.png',
        keywords: ['flight', 'comfort']
    }
];

const getAvailableProducts = () => {
    // In a real app, this would query a database. For the hackathon,
    // we just return our hard-coded list.
    return products;
};

module.exports = { getAvailableProducts };