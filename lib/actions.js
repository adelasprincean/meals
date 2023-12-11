"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

const isInvalidText = (text) => {
  return !text || text.trim() === "";
};

// Define an async function to share a meal
export async function shareMeal(prevState, formData) {
  // Extract meal information from the form data
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  // Validation block to check the validity of the meal object
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    // Return an object with a message indicating invalid input
    return {
      message: "Invalid input.",
    };
  }
  // Call the saveMeal function to save the meal to the database
  await saveMeal(meal);

  // Invalidate the cache for the specified path when it is next visited (for production env)
  revalidatePath("/meals");

  // After submitting the meal, redirect user the meals page
  redirect("/meals");
}
