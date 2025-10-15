import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_EXTERNAL_DIR = path.join(__dirname, '..', 'games-external');
const WEB_PUBLIC_DIR = path.join(__dirname, '..', 'apps', 'web', 'public', 'games-host');

interface GameManifest {
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  type: 'react' | 'html';
  category: string;
}

async function syncGames() {
  console.log('🔄 Syncing external games...\n');

  try {
    // Ensure output directory exists
    await fs.ensureDir(WEB_PUBLIC_DIR);

    // Get all game directories
    const gameDirs = await fs.readdir(GAMES_EXTERNAL_DIR);
    const games: GameManifest[] = [];

    for (const gameDir of gameDirs) {
      const gamePath = path.join(GAMES_EXTERNAL_DIR, gameDir);
      const stat = await fs.stat(gamePath);

      if (!stat.isDirectory()) continue;

      // Read manifest
      const manifestPath = path.join(gamePath, 'manifest.json');
      if (!await fs.pathExists(manifestPath)) {
        console.log(`⚠️  Skipping ${gameDir} - no manifest.json found`);
        continue;
      }

      const manifest: GameManifest = await fs.readJson(manifestPath);
      games.push(manifest);

      // Copy game files to public directory
      const outputPath = path.join(WEB_PUBLIC_DIR, manifest.slug);
      await fs.ensureDir(outputPath);

      // Copy index.html
      const indexPath = path.join(gamePath, 'index.html');
      if (await fs.pathExists(indexPath)) {
        await fs.copy(indexPath, path.join(outputPath, 'index.html'));
        console.log(`✅ Synced ${manifest.name} (${manifest.slug})`);
      } else {
        console.log(`⚠️  No index.html found for ${manifest.slug}`);
      }

      // Copy assets if they exist
      const assetsPath = path.join(gamePath, 'assets');
      if (await fs.pathExists(assetsPath)) {
        await fs.copy(assetsPath, path.join(outputPath, 'assets'));
        console.log(`   📁 Copied assets for ${manifest.slug}`);
      }
    }

    console.log(`\n✨ Successfully synced ${games.length} games!`);
    console.log('\n📋 Synced games:');
    games.forEach(game => {
      console.log(`   - ${game.name} (/${game.slug})`);
    });

  } catch (error) {
    console.error('❌ Error syncing games:', error);
    process.exit(1);
  }
}

syncGames();




