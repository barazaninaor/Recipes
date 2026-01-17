window.onload = () => {
  let urlAllFoodCategories =
    "https://www.themealdb.com/api/json/v1/1/categories.php";

  fetch(urlAllFoodCategories)
    .then((response) => response.json())
    .then((data) => {
      const categoryContainer = document.querySelector("#foodCategories");
      const recipesContainer = document.querySelector("#recipes");
      const instructionsContainer = document.querySelector("#instructions");
      const container = document.querySelector("#container");

      container.style.display = "flex";
      container.style.justifyContent = "space-between";
      container.style.gap = "10px";

      categoryContainer.style.width = "25%";
      recipesContainer.style.width = "25%";
      instructionsContainer.style.width = "45%";

      [categoryContainer, recipesContainer, instructionsContainer].forEach(
        (el) => {
          el.style.height = "100vh";
          el.style.overflowY = "auto";
        }
      );

      categoryContainer.innerHTML = "<h1>Categories</h1>";

      for (const value of data.categories) {
        let newDiv = document.createElement("div");
        newDiv.classList.add("category-card");
        newDiv.style.marginTop = "20px";
        newDiv.style.cursor = "pointer";
        newDiv.style.border = "4px solid transparent";
        newDiv.style.padding = "10px";

        let categoryh2 = document.createElement("h2");
        categoryh2.textContent = value.strCategory;
        categoryh2.style.textAlign = "center";
        categoryh2.style.fontWeight = "bold";
        categoryh2.style.padding = "10px";

        let newImg = document.createElement("img");
        newImg.src = value.strCategoryThumb;
        newImg.style.width = "100%";

        newDiv.appendChild(categoryh2);
        newDiv.appendChild(newImg);
        categoryContainer.appendChild(newDiv);

        newDiv.onclick = () => {
          document.querySelectorAll(".category-card").forEach((div) => {
            div.style.borderColor = "transparent";
          });
          newDiv.style.borderColor = "blue";

          let recipesUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value.strCategory}`;

          fetch(recipesUrl)
            .then((response) => response.json())
            .then((mealData) => {
              recipesContainer.innerHTML = "<h1>Recipes</h1>";

              for (const meal of mealData.meals) {
                let mealDiv = document.createElement("div");
                mealDiv.classList.add("meal-card");
                mealDiv.style.marginTop = "20px";
                mealDiv.style.cursor = "pointer";
                mealDiv.style.display = "flex";
                mealDiv.style.flexDirection = "column";
                mealDiv.style.alignItems = "center";
                mealDiv.style.border = "4px solid transparent";
                mealDiv.style.padding = "10px";

                let recipeH4 = document.createElement("h4");
                recipeH4.textContent = meal.strMeal;
                recipeH4.style.textAlign = "center";
                recipeH4.style.fontWeight = "bold";
                recipeH4.style.padding = "10px";

                let recipeImg = document.createElement("img");
                recipeImg.src = meal.strMealThumb;
                recipeImg.classList.add("recipeImg");
                recipeImg.style.width = "60%";

                mealDiv.appendChild(recipeH4);
                mealDiv.appendChild(recipeImg);
                recipesContainer.appendChild(mealDiv);

                mealDiv.onclick = () => {
                  document.querySelectorAll(".meal-card").forEach((div) => {
                    div.style.borderColor = "transparent";
                  });
                  mealDiv.style.borderColor = "blue";

                  let instructionsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;

                  fetch(instructionsUrl)
                    .then((response) => response.json())
                    .then((instructionsData) => {
                      instructionsContainer.innerHTML = "<h1>Instructions</h1>";

                      for (const instruction of instructionsData.meals) {
                        let instructionDiv = document.createElement("div");
                        instructionDiv.classList.add("instruction-card");
                        instructionDiv.style.marginTop = "20px";
                        instructionDiv.style.display = "flex";
                        instructionDiv.style.flexDirection = "column";
                        instructionDiv.style.alignItems = "center";
                        instructionDiv.style.padding = "15px";

                        let recipeH2 = document.createElement("h2");
                        recipeH2.textContent = instruction.strMeal;
                        recipeH2.style.textAlign = "center";
                        recipeH2.style.fontWeight = "bold";
                        recipeH2.style.padding = "10px";
                        instructionDiv.appendChild(recipeH2);

                        let categoryH3 = document.createElement("h3");
                        categoryH3.textContent = `Category: ${instruction.strCategory}`;
                        categoryH3.style.textAlign = "center";
                        categoryH3.style.fontWeight = "bold";
                        categoryH3.style.padding = "10px";
                        instructionDiv.appendChild(categoryH3);

                        // Ingredients Section
                        let ingredientsH4 = document.createElement("h4");
                        ingredientsH4.textContent = "Ingredients & Measures:";
                        ingredientsH4.style.fontWeight = "bold";
                        ingredientsH4.style.textDecoration = "underline";
                        instructionDiv.appendChild(ingredientsH4);

                        let ingredientsList = document.createElement("ul");
                        Object.keys(instruction).forEach((key) => {
                          if (
                            key.startsWith("strIngredient") &&
                            instruction[key] &&
                            instruction[key].trim() !== ""
                          ) {
                            let index = key.replace("strIngredient", "");
                            let measure = instruction[`strMeasure${index}`];
                            let li = document.createElement("li");
                            li.textContent = `${instruction[key]} - ${
                              measure ? measure : ""
                            }`;
                            ingredientsList.appendChild(li);
                          }
                        });
                        instructionDiv.appendChild(ingredientsList);

                        // Instructions Section
                        let stepsH4 = document.createElement("h4");
                        stepsH4.textContent = "Preparation Steps:";
                        stepsH4.style.fontWeight = "bold";
                        stepsH4.style.marginTop = "20px";
                        stepsH4.style.textDecoration = "underline";
                        instructionDiv.appendChild(stepsH4);

                        let stepsP = document.createElement("p");
                        stepsP.textContent = instruction.strInstructions;
                        stepsP.style.whiteSpace = "pre-line";
                        stepsP.style.lineHeight = "1.6";
                        stepsP.style.textAlign = "left";
                        stepsP.style.width = "100%";
                        instructionDiv.appendChild(stepsP);

                        // YouTube Video Section
                        if (instruction.strYoutube) {
                          let videoH4 = document.createElement("h4");
                          videoH4.textContent = "Video Tutorial:";
                          videoH4.style.fontWeight = "bold";
                          videoH4.style.marginTop = "20px";
                          instructionDiv.appendChild(videoH4);

                          // Converting regular link to embed link
                          let videoId = instruction.strYoutube.split("v=")[1];
                          let embedUrl = `https://www.youtube.com/embed/${videoId}`;

                          let iframe = document.createElement("iframe");
                          iframe.src = embedUrl;
                          iframe.width = "100%";
                          iframe.height = "315";
                          iframe.frameBorder = "0";
                          iframe.allow =
                            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                          iframe.allowFullscreen = true;
                          iframe.style.marginTop = "10px";

                          instructionDiv.appendChild(iframe);
                        }

                        instructionsContainer.appendChild(instructionDiv);
                      }
                    });
                };
              }
            });
        };
      }
    });
};
