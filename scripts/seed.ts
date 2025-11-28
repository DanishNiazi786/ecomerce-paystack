import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from '../models/Product.ts';
import Category from '../models/Category.ts';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dani:123@cluster0.q8xqxkt.mongodb.net/?appName=Cluster0';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const categories = [
    { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80' },
    { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80' },
    { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80' },
    { name: 'Digital', slug: 'digital', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80' },
    { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80' },
    { name: 'Home', slug: 'home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80' },
];

const categoryImages = {
    electronics: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
    ],
    fashion: [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
    ],
    accessories: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
        'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80',
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
    ],
    digital: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
        'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    ],
    beauty: [
        'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80',
        'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    ],
    home: [
        'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    ],
};

const productAdjectives = ['Premium', 'Sleek', 'Modern', 'Classic', 'Ultra', 'Pro', 'Max', 'Lite', 'Essential', 'Luxury'];
const productNouns = {
    electronics: ['Headphones', 'Smartwatch', 'Laptop', 'Phone', 'Speaker', 'Camera', 'Monitor', 'Keyboard'],
    fashion: ['T-Shirt', 'Jacket', 'Jeans', 'Sneakers', 'Dress', 'Hoodie', 'Coat', 'Boots'],
    accessories: ['Watch', 'Wallet', 'Bag', 'Sunglasses', 'Belt', 'Hat', 'Scarf', 'Jewelry'],
    digital: ['E-Book', 'Course', 'Template', 'Preset', 'Software', 'Graphics', 'Music', 'Art'],
    beauty: ['Serum', 'Cream', 'Lipstick', 'Perfume', 'Mask', 'Oil', 'Lotion', 'Scrub'],
    home: ['Lamp', 'Chair', 'Table', 'Vase', 'Rug', 'Pillow', 'Clock', 'Planter'],
};

function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateProducts(count: number) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const category = getRandomElement(categories);
        const noun = getRandomElement(productNouns[category.slug as keyof typeof productNouns]);
        const adjective = getRandomElement(productAdjectives);
        const name = `${adjective} ${noun} ${Math.floor(Math.random() * 1000)}`;
        const price = Math.floor(Math.random() * 500) + 20;

        // Get 4 random images from the category for the gallery
        const categoryImagesList = categoryImages[category.slug as keyof typeof categoryImages];
        const productImages = [];
        for (let j = 0; j < 4; j++) {
            productImages.push(getRandomElement(categoryImagesList));
        }

        products.push({
            name,
            slug: name.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(7),
            description: `This is a high-quality ${name}. Perfect for your daily needs. Features premium materials and modern design.`,
            price,
            discountPrice: Math.random() > 0.7 ? Math.floor(price * 0.8) : undefined,
            images: productImages,
            category: category.slug,
            stock: Math.floor(Math.random() * 100),
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
            numReviews: Math.floor(Math.random() * 500),
            isFeatured: Math.random() > 0.8,
            isTrending: Math.random() > 0.7,
            isNewArrival: Math.random() > 0.6,
            tags: [category.slug, noun.toLowerCase(), 'trending'],
            attributes: [
                { name: 'Color', value: getRandomElement(['Black', 'White', 'Blue', 'Red', 'Green']) },
                { name: 'Size', value: getRandomElement(['S', 'M', 'L', 'XL']) },
            ],
        });
    }
    return products;
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        await Category.insertMany(categories);
        console.log('Inserted categories');

        const specificProducts = [
            {
                name: "Sleek Lotion 713",
                slug: "sleek-lotion-713",
                description: "Premium sleek lotion for daily use.",
                price: 53,
                images: ["https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80"],
                category: "beauty",
                stock: 50,
                rating: 4.5,
                numReviews: 120,
                isFeatured: true,
                isTrending: true,
                isNewArrival: true,
                tags: ["beauty", "lotion"],
                attributes: [{ name: "Size", value: "200ml" }]
            },
            {
                name: "Max E-Book 956",
                slug: "max-e-book-956",
                description: "The ultimate guide to maximizing productivity.",
                price: 67,
                images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"],
                category: "digital",
                stock: 100,
                rating: 3.6,
                numReviews: 45,
                isFeatured: true,
                isTrending: true,
                isNewArrival: true,
                tags: ["digital", "ebook"],
                attributes: [{ name: "Format", value: "PDF" }]
            },
            {
                name: "Essential Lotion 664",
                slug: "essential-lotion-664",
                description: "Essential care for your skin.",
                price: 290,
                images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"],
                category: "beauty",
                stock: 30,
                rating: 4.7,
                numReviews: 89,
                isFeatured: true,
                isTrending: true,
                isNewArrival: true,
                tags: ["beauty", "lotion"],
                attributes: [{ name: "Size", value: "500ml" }]
            },
            {
                name: "Ultra Oil",
                slug: "ultra-oil",
                description: "Ultra hydrating oil for all skin types.",
                price: 45,
                images: ["https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80"],
                category: "beauty",
                stock: 60,
                rating: 4.8,
                numReviews: 150,
                isFeatured: true,
                isTrending: true,
                isNewArrival: true,
                tags: ["beauty", "oil"],
                attributes: [{ name: "Size", value: "100ml" }]
            }
        ];

        await Product.insertMany(specificProducts);
        console.log('Inserted specific products');

        const products = generateProducts(60);
        await Product.insertMany(products);
        console.log('Inserted random products');

        console.log('Seed completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
