# Welcome to Natours App

Built using modern technologies: Nodejs,Express,MongoDB and etc with ❤️

# Demo link

Project uploaded on a free deployed server, could take few moments for first time rendering. Thank you
[Click here](https://app-9ene.onrender.com/)

## Key Features
-  Authentication and Authorization
    -   Sign up, log in, logout, forgot and reset password.
-   User profile
    -   Update username, photo, email, password, and other information
    -   A user can be either a regular user or an admin or a lead guide or a guide.
    -   When a user signs up, that user by default regular user.
-   Tour
    -   Manage booking, check tour map, check users' reviews and rating
    -   Tours can be created by an admin user or a lead-guide.
    -   Tours can be seen by every user.
    -   Tours can be updated by an admin user and lead-guide .
    -   Tours can be deleted by an admin user .
-   Bookings
    -   Only Registered users can book tours (after a payment).
    -   Regular users can not book the same tour twice.
    -   Regular users can see all the tours they have booked(/me).
    -   An admin user or a lead guide can see every booking on the app.
    -   An admin user  can delete any booking.
    -   An admin user can create a booking (manually, without payment).
    -   An admin user can not create a booking for the same user twice.
    -   An admin user or a lead guide can edit any booking.
-   Reviews
    -   Only regular users can write reviews for tours that they have booked.
    -   All users can see the reviews of each tour.
    -   Regular users can edit and delete their own reviews.
    -   Regular users can not review the same tour twice.
    -   An admin can delete any review.
  
-   Credit card Payment

##  How To Use

-   Login to the site
-   Search for tours that you want to book
-   Book a tour
-   Proceed to the payment checkout page
-   Enter the card details (Test Mood):
       ```
    - Card No. : 4242 4242 4242 4242
    - Expiry date: 02 / 27
    - CVV: 222
    
    ```
    
-   Finished!

##  Manage your booking

-   Check the tour you have booked on the **Manage Booking** page in your user settings(click on your photo to access it). You'll be automatically redirected to this page after you have completed the booking.

## Update your profile

-   You can update your own username, profile photo, email, and password from **Settings** in /me;

## API Usage

Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add:

```
- {{URL}} with your hostname as value (Eg. http://127.0.0.1:3000 or http://www.example.com)
- {{password}} with your user password as value.

```

Check  [Natours API Documentation](https://documenter.getpostman.com/view/8893042/SW7c37V6)  for more info.
**API Features:**

Tours List : [https://app-9ene.onrender.com/api/v1/tours/](https://app-9ene.onrender.com/api/v1/tours/)

Tours State   [https://app-9ene.onrender.com/api/v1/tours/tour-stats](https://app-9ene.onrender.com/api/v1/tours/tour-stats)

Get Top 5 Tours(Good ratings with Low price)   [https://app-9ene.onrender.com/api/v1/tours/top-5-tour](https://app-9ene.onrender.com/api/v1/tours/top-5-tour)

Get Tours Distance:   [https://app-9ene.onrender.com/api/v1/tours/distance/37.85750715625203,-117.59765625000001/unit/mi](https://app-9ene.onrender.com/api/v1/tours/distance/37.85750715625203,-117.59765625000001/unit/mi)

Get Tours Within Radius   [https://app-9ene.onrender.com/api/v1/tours/tours-within/400/center/33.863834,-118.256764/unit/mi](https://app-9ene.onrender.com/api/v1/tours/tours-within/400/center/33.863834,-118.256764/unit/mi)

## Build With 

[](https://github.com/lgope/Natours?tab=readme-ov-file#build-with-%EF%B8%8F)

-   [NodeJS](https://nodejs.org/en/)  - JS runtime environment
-   [Express](http://expressjs.com/)  - The web framework used
-   [Mongoose](https://mongoosejs.com/)  - Object Data Modelling (ODM) library
-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  - Cloud database service
-   [Pug](https://pugjs.org/api/getting-started.html)  - High performance template engine
-   [JSON Web Token](https://jwt.io/)  - Security token
-   [Esbuild](https://github.com/evanw/esbuild)  - Modern js application bundler
-   [Stripe](https://stripe.com/)  - Online payment API and Making payments on the app.
-   [Postman](https://www.getpostman.com/)  - API testing
-   [Mailtrap](https://mailtrap.io/)  &  [Sendgrid](https://sendgrid.com/)  - Email delivery platform
-   [Nodemailer](https://github.com/nodemailer/nodemailer)  - Send emails from Node.js
-   [Mapbox](https://www.mapbox.com/)  - Displaying the different locations of each tour.

