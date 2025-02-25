# Accommodation Search

## Technical Coding Test

This project has a simple setup with an api, hooked up to MongoDB and a frontend piece initiated with [vite](https://vitejs.dev/).

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

## Task at hand

When the project is up and running, you should see a search-bar on the screen. This one is currently hooked up to the `/hotels` endpoint.
When you type in a partial string that is part of the name of the hotel, it should appear on the screen.
Ie. type in `resort` and you should see some Hotels where the word `resort` is present.

You will also see 2 headings called **"Countries"** and **"Cities"**.

The assignment is to build a performant way to search for Hotels, Cities or Countries.
Partial searches will be fine. Hotels will need to filterable by location as well.
Ie. The search `uni` should render

- Hotels that are located in the United States, United Kingdom or have the word `uni` in the hotel name.
- Countries that have `uni` in their name Ie. United States, United Kingdom
- No Cities as there is no match

Clicking the close button within the search field should clear out the field and results.

When clicking on one of the `Hotels`, `Cities` or `Countries` links, the application should redirect to the relevant page and render the selected `Hotel`, `City` or `Country` as a heading.

### Limitations

Given the time constraints, we do not expect a fully production-ready solution. We're primarily interested in the approach and the overall quality of the solution.
Feel free to modify the current codebase as needed, including adding or removing dependencies.
For larger or more time-intensive changes, you're welcome to outline your ideas in the write-up section below and discuss them further during the call.

<img src="./assets/search-example.png" width="400px" />

### Write-up

**GENERAL:**

- **Created a Shared Package Schema:** Developed a shared schema package to standardize data formats and enable code reuse across different projects.

**API:**

- **Implemented Tests for Controller and DAO:** Added unit tests for both the controller and DAO layers to maintain high quality and ensure functionality.
- **Unified JSON Field Naming Convention:** Updated JSON field names to follow the camelCase format, aligning with JavaScript conventions for better readability and consistency.
- **Introduced Zod for Environment Variable Validation:** Integrated the Zod library to enforce stricter validation of environment variables, offering better validation rules, default values, and error feedback.
- **Refactored MongoDB Connection Logic:** Moved the MongoDB connection logic into its own module to separate concerns and make the code more organized and reusable.
- **Adopted Controller and DAO Pattern:** Implemented the controller and DAO (Data Access Object) pattern to better separate concerns and manage business logic.
- **Integrated Dependency Injection:** Incorporated dependency injection to simplify dependency management, improving testability and flexibility within the application.
- **Centralized Error Handling System:** Established a centralized error handling system to ensure consistency in error responses and enhance the user experience across the app.
- **Refined Route Management:** Organized hotel-related routes by moving them into a dedicated folder, improving the structure and maintainability of the codebase.
- **Optimized Code Structure:** Restructured the code by relocating it to the `src` directory, resulting in a more efficient, clean, and maintainable project layout.

**FRONTEND:**

- **Standardized JSON Field Naming Convention:** Updated JSON field names to camelCase for consistency and better alignment with JavaScript best practices.
- **Optimized API Calls with Debounce:** Refactored the API call logic into a dedicated service and added a debounce feature to enhance search performance and reduce redundant API requests.
- **Enhanced Hotel Search Features:** Improved the hotel search functionality to filter results based on user input, making the search experience more dynamic and responsive.
- **Modularized Search Bar Component:** Refactored the search bar into a reusable component, improving organization and allowing it to be utilized in different parts of the application.
- **Added Routing with React Router DOM:** Implemented React Router DOM to manage routing, enabling dynamic navigation within the app, including hotel detail pages.
- **Implemented Render Tests:** Created render tests to ensure the correct rendering of the search feature, verifying that it behaves as expected when displaying search results.

_P.S.: For further details on specific changes and features, refer to the Pull Requests section. I worked on separate feature branches and submitted PRs for each, so you’ll find comprehensive information and context there._

### Database structure

#### Hotels Collection

```json
[
  {
    "chain_name": "Samed Resorts Group",
    "hotel_name": "Sai Kaew Beach Resort",
    "addressline1": "8/1 Moo 4 Tumbon Phe Muang",
    "addressline2": "",
    "zipcode": "21160",
    "city": "Koh Samet",
    "state": "Rayong",
    "country": "Thailand",
    "countryisocode": "TH",
    "star_rating": 4
  },
  {
    /* ... */
  }
]
```

#### Cities Collection

```json
[
  { "name": "Auckland" },
  {
    /* ... */
  }
]
```

#### Countries Collection

```json
[
  {
    "country": "Belgium",
    "countryisocode": "BE"
  },
  {
    /* ... */
  }
]
```
