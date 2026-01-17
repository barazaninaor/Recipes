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

      // פונקציה לעדכון העיצוב לפי גודל המסך
      const updateLayout = () => {
        if (window.innerWidth <= 768) {
          // עיצוב לנייד
          container.style.flexDirection = "column";
          categoryContainer.style.width = "100%";
          recipesContainer.style.width = "100%";
          instructionsContainer.style.width = "100%";
          
          // בנייד נבטל את הגובה הקבוע כדי שהעמוד יזרום למטה
          [categoryContainer, recipesContainer, instructionsContainer].forEach(
            (el) => {
              el.style.height = "auto";
              el.style.overflowY = "visible";
            }
          );
        } else {
          // עיצוב למחשב (הקוד המקורי שלך)
          container.style.flexDirection = "row";
          categoryContainer.style.width = "25%";
          recipesContainer.style.width = "25%";
          instructionsContainer.style.width = "45%";
          
          [categoryContainer, recipesContainer, instructionsContainer].forEach(
            (el) => {
              el.style.height = "100vh";
              el.style.overflowY = "auto";
            }
          );
        }
      };

      container.style.display = "flex";
      container.style.justifyContent = "space-between";
      container.style.gap = "20px";
      container.style.padding = "10px";

      // הפעלה ראשונית והאזנה לשינוי גודל מסך
      updateLayout();
      window.onresize = updateLayout;

      categoryContainer.innerHTML = "<h1>Categories</h1>";

      for (const value of data.categories) {
        let newDiv = document.createElement("div");
        newDiv.classList.add("category-card");
        newDiv.style.marginTop = "20px";
        newDiv.style.cursor = "pointer";
        newDiv.style.border = "4px solid transparent";
        newDiv.style.padding = "10px";
        newDiv.style.backgroundColor = "#f9f9f9";
        newDiv.style.borderRadius = "8px";

        let categoryh2 = document.createElement("h2");
        categoryh2.textContent = value.strCategory;
        categoryh2.style.textAlign = "center";
        categoryh2.style.fontSize = "1.2rem";

        let newImg = document.createElement("img");
        newImg.src = value.strCategoryThumb;
        newImg.style.width = "100%";
        newImg.style.borderRadius = "5px";

        newDiv.appendChild(categoryh2);
        newDiv.appendChild(newImg);
        categoryContainer.appendChild(newDiv);

        newDiv.onclick = () => {
          document.querySelectorAll(".category-card").forEach((div) => {
            div.style.borderColor = "transparent";
          });
          newDiv.style.borderColor = "blue";
          
          // גלילה אוטומטית למתכונים בנייד
          if (window.innerWidth <= 768) {
            recipesContainer.scrollIntoView({ behavior: 'smooth' });
          }

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
                mealDiv.style.backgroundColor = "#fff";
                mealDiv.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

                let recipeH4 = document.createElement("h4");
                recipeH4.textContent = meal.strMeal;
                recipeH4.style.textAlign = "center";

                let recipeImg = document.createElement("img");
                recipeImg.src = meal.strMealThumb;
                recipeImg.style.width = "80%";
                recipeImg.style.borderRadius = "5px";

                mealDiv.appendChild(recipeH4);
                mealDiv.appendChild(recipeImg);
                recipesContainer.appendChild(mealDiv);

                mealDiv.onclick = () => {
                  document.querySelectorAll(".meal-card").forEach((div) => {
                    div.style.borderColor = "transparent";
                  });
                  mealDiv.style.borderColor = "blue";

                  // גלילה אוטומטית להוראות בנייד
                  if (window.innerWidth <= 768) {
                    instructionsContainer.scrollIntoView({ behavior: 'smooth' });
                  }
                  
                  let instructionsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;

                  fetch(instructionsUrl)
                    .then((response) => response.json())
                    .then((instructionsData) => {
                      instructionsContainer.innerHTML = "<h1>Instructions</h1>";

                      for (const instruction of instructionsData.meals) {
                        let instructionDiv = document.createElement("div");
                        instructionDiv.style.width = "100%";

                        let recipeH2 = document.createElement("h2");
                        recipeH2.textContent = instruction.strMeal;
                        recipeH2.style.textAlign = "center";
                        instructionDiv.appendChild(recipeH2);

                        // Ingredients
                        let ingH4 = document.createElement("h4");
                        ingH4.textContent = "Ingredients:";
                        ingH4.style.textDecoration = "underline";
                        instructionDiv.appendChild(ingH4);

                        let ul = document.createElement("ul");
                        Object.keys(instruction).forEach((key) => {
                          if (key.startsWith("strIngredient") && instruction[key]?.trim()) {
                            let index = key.replace("strIngredient", "");
                            let measure = instruction[`strMeasure${index}`];
                            let li = document.createElement("li");
                            li.textContent = `${instruction[key]} - ${measure || ""}`;
                            ul.appendChild(li);
                          }
                        });
                        instructionDiv.appendChild(ul);

                        // Instructions
                        let stepsH4 = document.createElement("h4");
                        stepsH4.textContent = "Preparation:";
                        stepsH4.style.marginTop = "20px";
                        instructionDiv.appendChild(stepsH4);

                        let stepsP = document.createElement("p");
                        stepsP.textContent = instruction.strInstructions;
                        stepsP.style.whiteSpace = "pre-line";
                        stepsP.style.lineHeight = "1.6";
                        instructionDiv.appendChild(stepsP);

                        // YouTube
                        if (instruction.strYoutube) {
                          let videoId = instruction.strYoutube.split("v=")[1];
                          let iframe = document.createElement("iframe");
                          iframe.src = `https://www.youtube.com/embed/${videoId}`;
                          iframe.width = "100%";
                          iframe.height = "250"; // קצת יותר קטן לנייד
                          iframe.frameBorder = "0";
                          iframe.allowFullscreen = true;
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
