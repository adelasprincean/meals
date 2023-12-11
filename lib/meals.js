import fs from "node:fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

// Import the SQLite library and create a database connection
const db = sql("meals.db");

// Asynchronously fetch all meals from the database
export async function getMeals() {
  // Simulate a delay (2 seconds) to mimic an asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Uncomment the line below to simulate an error during data fetching
  // throw new Error("Loading meals failed");

  // Return all meals from the "meals" table
  return db.prepare("SELECT * FROM meals").all();
}

// Synchronously fetch a single meal by its slug from the database
export function getMeal(slug) {
  // Return the result of the SQL query to fetch a meal by its slug
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  // Generate a slug from the meal title and sanitize instructions using xss
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // Extract file extension and create a filename based on the slug
  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  // Create a write stream for the image file
  const stream = fs.createWriteStream(`public/images/${fileName}`);

  // Convert the image buffer to ArrayBuffer
  const bufferedImage = await meal.image.arrayBuffer();

  // Write the image buffer to the file
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  });

  // Update the meal object with the image path
  meal.image = `/images/${fileName}`;

  // Insert the meal data into the database
  db.prepare(
    `INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug) 
    VALUES(
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )`
  ).run(meal);
}
