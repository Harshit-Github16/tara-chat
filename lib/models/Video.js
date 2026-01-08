import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';

export class Video {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.url = data.url;
        this.category = data.category || 'General';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    // Extract YouTube ID from URL
    static getYoutubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Get thumbnail URL
    static getThumbnailUrl(url) {
        const id = this.getYoutubeId(url);
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }

    async save() {
        const client = await clientPromise;
        const db = client.db('tara');
        const videos = db.collection('videos');

        const result = await videos.insertOne({
            title: this.title,
            description: this.description,
            url: this.url,
            category: this.category,
            youtubeId: Video.getYoutubeId(this.url),
            thumbnail: Video.getThumbnailUrl(this.url),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        });

        return result;
    }

    static async getAll() {
        const client = await clientPromise;
        const db = client.db('tara');
        const videos = db.collection('videos');

        return await videos.find({}).sort({ createdAt: -1 }).toArray();
    }

    static async deleteById(id) {
        const client = await clientPromise;
        const db = client.db('tara');
        const videos = db.collection('videos');

        return await videos.deleteOne({ _id: new ObjectId(id) });
    }
}
