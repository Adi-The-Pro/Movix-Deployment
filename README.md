
![Logo](https://github.com/user-attachments/assets/91270567-13e6-430e-b1d5-cb2de5e3a3df)


Welcome to Movix! Movix is an advanced movie review platform where users can watch trailers, rate movies, and review them. With a comprehensive admin panel, this platform offers powerful movie management features, all built with modern technologies.

## User Interaction:
- Watch Trailers: Users can browse and watch trailers for the latest movies.
- Rate and Review: Registered users can rate movies from 1 to 10 and post detailed reviews.

## Admin Panel:
- Manage Movies: Admins can add, update, or delete movies from the database.
- Actor Management: Create and manage actors, and associate them with movies.
- Dashboard: View recent uploads, total reviews, and user statistics.

## Frontend Features:
- Responsive Design: Fully responsive UI built with React and Tailwind CSS.
- Advanced UI Elements: Includes sliders, live search, rating models, and complex forms.

## Media Management:
- Cloudinary Integration: Efficiently manage and deliver trailers, posters, and actor avatars.
## User Panel :
![Screenshot 2024-07-22 000759](https://github.com/user-attachments/assets/04b57d87-f46e-4c85-b1e4-e0d96acbacb9)

![Screenshot 2024-07-22 000824](https://github.com/user-attachments/assets/e97f644a-f8dc-4129-b1ac-354e1e64cac6)

![Screenshot 2024-07-22 000952](https://github.com/user-attachments/assets/57b26eaa-6378-49db-8b75-957121793512)


![Screenshot 2024-07-22 001933](https://github.com/user-attachments/assets/f536d59d-c2aa-4e8c-b12c-efc601723a6d)

 
## Admin Dashboard : 
![Screenshot 2024-07-22 001028](https://github.com/user-attachments/assets/ff24f11c-9ad4-4b9a-bb79-e361495c54ea)

---
![Screenshot 2024-07-22 001044](https://github.com/user-attachments/assets/541ca60f-8829-409c-9929-657299e7bf2b)

---
![Screenshot 2024-07-22 001623](https://github.com/user-attachments/assets/30a57ecb-f76c-4f1e-93a9-21b23db602ed)

---
![Screenshot 2024-07-22 001730](https://github.com/user-attachments/assets/84f46576-5fbc-4139-9ca9-61a34f0eecfd)


## Technology Used
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Cloud Storage: Cloudinary
- Email Services: Mailtrap, Sendinblue


## How To Use

- Sign Up / Log In: Create an account or log in to your existing account.

- Explore Movies: Watch movie trailers, view ratings, and read reviews.

- Admin Functions: If you’re an admin, manage movies, actors, and view analytics through the admin panel.
## Run Locally

Step-1: Clone the project

```bash
  git clone https://github.com/Adi-The-Pro/Movix-Deployment
  cd Movix-Deployment
```

Step 2: Create Your MongoDB Account and Database Cluster
- Create your own MongoDB account by visiting the MongoDB website and signing up for a new account.
- Create a new database or cluster by following the instructions provided in the MongoDB documentation. Remember to note down the "Connect to your application URI" for the database, as you will need it later. Also, make sure to change <password> with your own password
- Add your current IP address to the MongoDB database's IP whitelist to allow connections (this is needed whenever your ip changes)

Step 3: Edit the Environment File
- Check a file named .env in the /backend directory.
- This file will store environment variables for the project to run.

Step 4: Update MongoDB URI
- In the .env file, find the line that reads:
- MONGODB_URI="your-mongodb-uri"
- Replace "your-mongodb-uri" with the actual URI of your MongoDB database.

Step 5: Install Backend And Frontend Dependencies
- In your terminal, navigate to the /backend directory and /myapp directory
```bash
  npm install
```

Step 6: Run the Backend Server
- In the same terminal, run the following command to start the backend server:
```bash
  npm start
```

Step 7: Run the Frontend Server
- After installing the frontend dependencies, run the following command in the same terminal to start the frontend server:
```bash
  npm start
```