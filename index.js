window.onload = () => {
  const urlAllFoodCategories =
    "https://www.themealdb.com/api/json/v1/1/categories.php";
  const categoryContainer = document.querySelector("#foodCategories");
  const recipesContainer = document.querySelector("#recipes");
  const instructionsContainer = document.querySelector("#instructions");

  fetch(urlAllFoodCategories)
    .then((response) => response.json())
    .then((data) => {
      categoryContainer.innerHTML = "<h1>Categories</h1>";

      data.categories.forEach((value) => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("category-card");

        let categoryh2 = document.createElement("h2");
        categoryh2.textContent = value.strCategory;
        categoryh2.style.fontSize = "1.2rem";

        let newImg = document.createElement("img");
        newImg.src = value.strCategoryThumb;

        newDiv.append(categoryh2, newImg);
        categoryContainer.appendChild(newDiv);

        newDiv.onclick = () => {
          // עיצוב בחירה
          document
            .querySelectorAll(".category-card")
            .forEach((d) => d.classList.remove("active-card"));
          newDiv.classList.add("active-card");

          // גלילה בנייד
          if (window.innerWidth <= 768) {
            recipesContainer.scrollIntoView({ behavior: "smooth" });
          }

          fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value.strCategory}`
          )
            .then((res) => res.json())
            .then((mealData) => {
              recipesContainer.innerHTML = "<h1>Recipes</h1>";

              mealData.meals.forEach((meal) => {
                let mealDiv = document.createElement("div");
                mealDiv.classList.add("meal-card");

                let recipeH4 = document.createElement("h4");
                recipeH4.textContent = meal.strMeal;

                let recipeImg = document.createElement("img");
                recipeImg.src = meal.strMealThumb;
                recipeImg.style.width = "80%";
                recipeImg.style.margin = "10px auto";

                mealDiv.append(recipeH4, recipeImg);
                recipesContainer.appendChild(mealDiv);

                mealDiv.onclick = () => {
                  document
                    .querySelectorAll(".meal-card")
                    .forEach((d) => d.classList.remove("active-card"));
                  mealDiv.classList.add("active-card");

                  if (window.innerWidth <= 768) {
                    instructionsContainer.scrollIntoView({
                      behavior: "smooth",
                    });
                  }

                  fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
                  )
                    .then((res) => res.json())
                    .then((instructionsData) => {
                      instructionsContainer.innerHTML = "<h1>Instructions</h1>";
                      const instruction = instructionsData.meals[0];

                      let instructionDiv = document.createElement("div");
                      instructionDiv.classList.add("instruction-content");

                      let recipeH2 = document.createElement("h2");
                      recipeH2.textContent = instruction.strMeal;
                      recipeH2.style.textAlign = "center";

                      // Ingredients List
                      let ingH4 = document.createElement("h4");
                      ingH4.textContent = "Ingredients:";
                      ingH4.style.textDecoration = "underline";
                      ingH4.style.marginTop = "15px";

                      let ul = document.createElement("ul");
                      ul.style.paddingLeft = "20px";

                      Object.keys(instruction).forEach((key) => {
                        if (
                          key.startsWith("strIngredient") &&
                          instruction[key]?.trim()
                        ) {
                          let index = key.replace("strIngredient", "");
                          let measure = instruction[`strMeasure${index}`];
                          let li = document.createElement("li");
                          li.textContent = `${instruction[key]} - ${
                            measure || ""
                          }`;
                          ul.appendChild(li);
                        }
                      });

                      // Instructions Text
                      let stepsH4 = document.createElement("h4");
                      stepsH4.textContent = "Preparation:";
                      stepsH4.style.marginTop = "20px";

                      let stepsP = document.createElement("p");
                      stepsP.textContent = instruction.strInstructions;

                      instructionDiv.append(
                        recipeH2,
                        ingH4,
                        ul,
                        stepsH4,
                        stepsP
                      );

                      // YouTube
                      if (instruction.strYoutube) {
                        let videoId = instruction.strYoutube.split("v=")[1];
                        let iframe = document.createElement("iframe");
                        iframe.src = `https://www.youtube.com/embed/${videoId}`;
                        iframe.width = "100%";
                        iframe.height =
                          window.innerWidth <= 768 ? "200" : "315";
                        iframe.frameBorder = "0";
                        iframe.style.marginTop = "20px";
                        iframe.allowFullscreen = true;
                        instructionDiv.appendChild(iframe);
                      }

                      instructionsContainer.appendChild(instructionDiv);
                    });
                };
              });
            });
        };
      });
    });
};
