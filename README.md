# NextJS Boilerplate

> This is demo boilerplate code for nextjs.

# Codebase Overview

> ## Tech

- Front-end: - NextJs

> ## NPM packages

- react-redux: - To manage state into project

- @redux-toolkit: - Create redux actions, reducers, store and manage api calls

- eslint: - To find errors and easy development

- prettier: - To formatt code

- i18n: - To multilanguage support

- bootStrap: - To create layout and theme

- axios: - To handle http request

- formik: - To handel field level validations

- yup: - To handle validations in formik

> ## Folder Structure

- assets: - Includes css and images folder. Can also inclide other assets for the project we want to add

- components: - Includes shared components of the react

- configs: - Includes configuration files for the project

- locales: - Includes language files containes static language string for the perticular language

- pages: - Contains pages component

- redux: - Contains redux configuration and component files and folders

- utils:- Contains mis. utilities files like constant and helpers

> ## Configuration files

- configs/

  - axiosInstance.js: - Axios instance for the api requests

- redux/

  - store.js: - Configuration of the redux and redux store

  - rootReducer.js: - Entry point to the all redux reduser

- index.js: - Landing page file for base URl

- \_app.js: - Next Js root file

- i18n.js: - Multi-lingual support configuration of the i18n and i18next library

- env.example: - Contains env variables example

- .eslintrc.js: - Configuration of the eslint

- .gitignore: - Contains folders and files to ignore by git

- .npmrc: - NPM configuration for the project

- .prettierrc: - Configuration file for the prettier

- jsconfig.json: - Extra configuration for the webpack

- package-lock.json: - Contains logs of the npm packages

- package.json: - Contains details of the project details and node module details

- README.md: - Contains the Project overview and Detailed explaination about the code of the project

> ## NPM scripts

- start: - To start development environment

- build: - To create build of the project

- test: - To run test cases

- eject

- lint: - To run eslint configuration and check code into the project

- format: - To run prettier configuration to formatt code into the project

# Development Workflow

> ## Start Development

### Requirement

- Node version 18.12.1 and above

- Npm version 8.19.2 and above

- Code Editor: - VS Code, Atom etc.

> ### Guidlines

- Try and be consistent with the overall code style and naming conventions.

- Create files and folders into the relative place and refer codebase overview for the cosideration

- To install any library once check it's compatibility and after installation update it into the README.md file

- Naming convention should be relative to the functionality and meaningful

> ### Naming conventions

### Folders and files

- Folders: - Kebab case

- React Component files: - Pascal case

- JS files: - Camel case

- CSS files:- Camel case

- Any other: - Camel case

### Components, classes and variables

- React Components: - Pascal case

- Constants: - Capitalized separated with underscore

- Variables: - Camel case

### Commits

- Write commit with related issue code and add discription body properly

- Add comments as discriptive as possible

### Note: - If you find any improvement point do update README file with proper structure and create PR

### Start project

- npm install

- npm run build

- npm run dev

or

- yarn add

- yarn build

- yarn dev
