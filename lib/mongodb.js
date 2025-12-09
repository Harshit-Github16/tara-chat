import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000, // Reduced timeout for faster failure
    socketTimeoutMS: 45000,
    connectTimeoutMS: 5000, // Reduced timeout for faster failure
    retryWrites: true,
    retryReads: true,
    maxIdleTimeMS: 60000,
};

let client;
let clientPromise;

// Check if we're in build phase or if MongoDB URI is missing
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
    if (isBuildPhase) {
        // During build, create a mock promise that won't be used
        console.warn('MongoDB URI not found during build - using mock connection');
        clientPromise = Promise.resolve({
            db: () => ({
                collection: () => ({
                    find: () => ({ toArray: () => Promise.resolve([]) }),
                    findOne: () => Promise.resolve(null),
                    insertOne: () => Promise.resolve({ insertedId: null }),
                    updateOne: () => Promise.resolve({ modifiedCount: 0 }),
                    deleteOne: () => Promise.resolve({ deletedCount: 0 }),
                })
            })
        });
    } else {
        throw new Error('Please add your MongoDB URI to .env.local');
    }
} else if (isBuildPhase) {
    // During build, create a mock promise even if URI exists
    console.log('Build phase detected - using mock MongoDB connection');
    clientPromise = Promise.resolve({
        db: () => ({
            collection: () => ({
                find: () => ({ toArray: () => Promise.resolve([]) }),
                findOne: () => Promise.resolve(null),
                insertOne: () => Promise.resolve({ insertedId: null }),
                updateOne: () => Promise.resolve({ modifiedCount: 0 }),
                deleteOne: () => Promise.resolve({ deletedCount: 0 }),
            })
        })
    });
} else if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;