// src/app/api/animal-predator.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { name } = req.query;

  // Define the path to the animals JSON file
  const jsonFilePath = path.join(process.cwd(), 'src/app/animals.json');
  
  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const animals = JSON.parse(jsonData);

    if (animals[name]) {
      const predators = animals[name].predators;
      res.status(200).json({ predators });
    } else {
      res.status(404).json({ error: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch animal data' });
  }
}
