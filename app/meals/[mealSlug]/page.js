import classes from "./page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMeal } from "@/lib/meals";

// Add dynamic metadata
export async function generateMetadata({ params }) {
  const meal = getMeal(params.mealSlug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}

const MealDetails = ({ params }) => {
  // Fetch meal details based on the provided meal slug
  const meal = getMeal(params.mealSlug);

  // Replace newline characters in instructions with HTML line breaks
  meal.instructions = meal.instructions.replace(/\n/g, "<br/>");

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main className={classes.main}>
        {/* Display meal instructions with HTML formatting */}
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{ __html: meal.instructions }}
        ></p>
      </main>
    </>
  );
};

export default MealDetails;
