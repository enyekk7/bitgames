require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://bitgame77:bitgame77@cluster0.timtu1c.mongodb.net/bitgame?retryWrites=true&w=majority&appName=Cluster0';

console.log('🧹 Cleaning up repost posts from database...');
console.log('🔗 Connecting to MongoDB Atlas...');

mongoose.connect(uri)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Define Post schema
    const postSchema = new mongoose.Schema({
      type: String,
      author: String,
      content: String,
      gameSlug: String,
      score: Number,
      scoreId: mongoose.Schema.Types.ObjectId,
      originalPostId: mongoose.Schema.Types.ObjectId,
      likes: [String],
      reposts: Number,
      tips: Array,
      createdAt: Date
    });
    
    const Post = mongoose.model('Post', postSchema);
    
    // Find all repost posts
    const repostPosts = await Post.find({ type: 'repost' });
    console.log(`📊 Found ${repostPosts.length} repost posts`);
    
    if (repostPosts.length > 0) {
      // Delete all repost posts
      const result = await Post.deleteMany({ type: 'repost' });
      console.log(`🗑️  Deleted ${result.deletedCount} repost posts`);
    }
    
    // Also remove reposts field from all posts (cleanup)
    const updateResult = await Post.updateMany(
      {}, 
      { $unset: { reposts: "" } }
    );
    console.log(`🔄 Updated ${updateResult.modifiedCount} posts (removed reposts field)`);
    
    // Show remaining posts
    const remainingPosts = await Post.countDocuments();
    const scorePosts = await Post.countDocuments({ type: 'score' });
    
    console.log('\n📈 Database Summary:');
    console.log(`   Total Posts: ${remainingPosts}`);
    console.log(`   Score Posts: ${scorePosts}`);
    console.log('\n✅ Cleanup complete!');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });



