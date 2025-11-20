// Base class for a Meal
class Meal {
  constructor(name, type, calories) {
    this.name = name;
    this.type = type;
    this.calories = calories;
  }

  displayMeal() {
    const div = document.createElement("div");
    div.classList.add("meal-card");
    div.innerHTML = `
      <h3>${this.name}</h3>
      <p><b>Type:</b> ${this.type}</p>
      <p><b>Calories:</b> ${this.calories} kcal</p>
    `;
    return div;
  }
}

// Class for a User
class User {
  constructor(name, email, preference) {
    this.name = name;
    this.email = email;
    this.preference = preference;
  }
}

// UI class handles displaying info
class UI {
  static showGreeting(user) {
    const heading = document.createElement("h3");
    heading.innerText = `Hello, ${user.name}! Here are meals we recommend for you 👇`;
    document.body.insertBefore(heading, document.getElementById("recommendationContainer"));
  }

  static displayMeals(meals) {
    const container = document.getElementById("recommendationContainer");
    container.innerHTML = "";
    meals.forEach(meal => {
      container.appendChild(meal.displayMeal());
    });
  }
}
