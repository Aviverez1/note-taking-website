# Collaborative Note-Taking Application

## Overview

This project is a real-time collaborative note-taking application built with React and Firebase. It allows multiple users to create, edit, and share notes simultaneously, with features like user authentication, note categorization, and version history.

## Features

- User Authentication: Secure login and registration system
- Real-time Collaboration: Multiple users can edit notes simultaneously
- Note Categorization: Organize notes into different categories
- Version History: Track changes and revert to previous versions of notes
- Responsive Design: Works on desktop and mobile devices

## Technologies Used

- Frontend: React.js
- Backend: Firebase (Firestore)
- Authentication: Firebase Authentication
- Hosting: [Your hosting platform, e.g., Firebase Hosting]

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- A Firebase account and project

## Installation

1. Clone the repository 
2. Navigate to the project directory 
3. Install dependencies with `npm install`

## Running the Application

To run the application locally: 
npm start

The application will be available at `http://localhost:3000`.

## Firebase Setup

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Firebase Authentication and Firestore in your project.
3. Set up Firestore security rules to secure your data.

## Key Features Explained

1. **Real-time Collaboration**: The application uses Firestore's real-time listeners to update note content across multiple clients simultaneously. This feature works when different users are editing the same note.

2. **User Authentication**: Firebase Authentication is used to manage user accounts. The application provides a secure login and registration system.

3. **Note Categorization**: Users can organize their notes into categories, making it easier to manage and find notes.

4. **Version History**: Each note maintains a history of changes, allowing users to view previous versions and revert to them if needed.

5. **Responsive Design**: The application is designed to work well on both desktop and mobile devices.




## Contact

Aviv Erez - aviver@edu.hac.ac.il


## Acknowledgments

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Create React App](https://github.com/facebook/create-react-app)