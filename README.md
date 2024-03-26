# Getting Started with PDF_Merge_ASSIGNMENT

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all the dependencies for the project.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### `npm run server`

Run this command from main directory not within the react folder to run the backend server.

### `Configuring Mongodb Database`

Paste the mongodb url within server.mjs to connect your backend to the database.

### `Make an empty file named - 'files'`

This is for multer configuration.

### `Working`

1. This projects first starts with uploading the pdf which then gets save into the database.
2. This then returns all saved pdf which you can view by choice.
3. Select pages to merge from the chosen pdf by clicking or tapping the required page.
4. Deselect pages by clicking or tapping again the selected page.
5. Finally click 'Merge Selected Pages' to merge the selected pages, which then the user can download.

