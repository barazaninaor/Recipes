window.onload = () => {
  const urlAllFoodCategories =
    "https://www.themealdb.com/api/json/v1/1/categories.php";
  const categoryContainer = document.querySelector("#foodCategories");
  const recipesContainer = document.querySelector("#recipes");
  const instructionsContainer = document.querySelector("#instructions");

  fetch(urlAllFoodCategories)
    .then((res) => res.json())
    .then((data) => {
      categoryContainer.innerHTML = "<h1>Categories</h1>";
      data.categories.forEach((value) => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("category-card");
        newDiv.innerHTML = `<h2>${value.strCategory}</h2><img src="${value.strCategoryThumb}">`;

        newDiv.onclick = () => {
          recipesContainer.style.display = "block";
          instructionsContainer.style.display = "none";

          document
            .querySelectorAll(".category-card")
            .forEach((d) => d.classList.remove("active-card"));
          newDiv.classList.add("active-card");

          if (window.innerWidth <= 768)
            recipesContainer.scrollIntoView({ behavior: "smooth" });

          fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value.strCategory}`
          )
            .then((res) => res.json())
            .then((mealData) => {
              recipesContainer.innerHTML = "<h1>Recipes</h1>";
              mealData.meals.forEach((meal) => {
                let mealDiv = document.createElement("div");
                mealDiv.classList.add("meal-card");
                mealDiv.innerHTML = `<h4>${meal.strMeal}</h4><img src="${meal.strMealThumb}">`;

                mealDiv.onclick = () => {
                  instructionsContainer.style.display = "block";

                  document
                    .querySelectorAll(".meal-card")
                    .forEach((d) => d.classList.remove("active-card"));
                  mealDiv.classList.add("active-card");

                  if (window.innerWidth <= 768)
                    instructionsContainer.scrollIntoView({
                      behavior: "smooth",
                    });

                  fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
                  )
                    .then((res) => res.json())
                    .then((instrData) => {
                      instructionsContainer.innerHTML = "<h1>Instructions</h1>";
                      const mealInfo = instrData.meals[0];
                      let content = document.createElement("div");
                      content.classList.add("instruction-content");

                      let ingredientsHTML =
                        "<h4>Ingredients & Measures:</h4><ul>";
                      for (let i = 1; i <= 20; i++) {
                        let ing = mealInfo[`strIngredient${i}`];
                        let meas = mealInfo[`strMeasure${i}`];
                        if (ing && ing.trim()) {
                          ingredientsHTML += `<li>${ing} - ${meas || ""}</li>`;
                        }
                      }
                      ingredientsHTML += "</ul>";

                      content.innerHTML = `
                                                <h2>${mealInfo.strMeal}</h2>
                                                ${ingredientsHTML}
                                                <h4>Preparation:</h4>
                                                <p>${mealInfo.strInstructions}</p>
                                            `;

                      if (mealInfo.strYoutube) {
                        let videoId = mealInfo.strYoutube.split("v=")[1];
                        // הוספת כותרת לסרטון
                        content.innerHTML += `
                                                    <h4>Video Tutorial:</h4>
                                                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="margin-top:10px; border-radius:8px;"></iframe>
                                                `;
                      }

                      instructionsContainer.appendChild(content);
                    });
                };
                recipesContainer.appendChild(mealDiv);
              });
            });
        };
        categoryContainer.appendChild(newDiv);
      });
    });
};
