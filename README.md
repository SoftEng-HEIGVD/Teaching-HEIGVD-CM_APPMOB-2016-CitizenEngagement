# FixYourStreet-Frontend

COMEM Application mobile 2016 Project

The project FixYourStreet-Frontend is a continuation of the course of Web service. The goal of this second part is to provide an interface and functionalities for the mobile application Citizen engagement. To develop this part, it was possible to either use the api we developed in the previous course or use one which is provided by the teacher. We choose the second option.

The project specifications: https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_APPMOB-2016-CitizenEngagement

The api we developed previously: https://github.com/pchhen/FixYourStreet

The api we used: https://heigvd-cm-appmob-2016-team-03.herokuapp.com/api



## a. Login page

![login page](/images/login.jpg)


On the home page, the application proposes to the user to register with his/her first name and last name. If he/she is already registered, the application will redirect him/her to the home page (b).



## b. Home page

![login page](/images/home.jpg)

The application will automatically localize the user and show him/her a map with all the issues in the area. On the menu, the user can: 

* Search a place with the issues around (c)
* Localize the user (d)
* Add a new issue (f)
* Take a look at all the issues details in the area (e)

The logout button on the upper left side of the screen allow the user to logout and redirect him/her to the login page (a).

**Note**: on every map of the application, it is possible to tap on an issue and get its details (g).

**Note**: the number of issue shown on the map depend of the zoom level.



## c. Search a place with the issues around

![login page](/images/searchIssue.jpg)

The user can search an address and the map will show the place with every issue around. The button "close" will close the page and redirect the user on the last page. 



## d. Localize the user

This button will localize the whereabouts of the user and show the issues around.



## e. List of all the issue in the area

![login page](/images/issueList.jpg)

Every issue in the area will be shown. On each of them the following informations can be viewed:

* The name of the issue
* The picture of an issue
* The description of an issue
* The last update of an issue
* The type of an issue

Two buttons can also be found for each issue:

* The localisation on the map with the details (g)
* The list of comments (i)

**Note**: it is possible to take a better look at the picture by tapping on it, then zoom on the image.

**Note**: on some page, there is a world map button on the upper right side of the screen which redirect the user on the home page (b).



## f. Add a new issue

![login page](/images/addIssue.jpg)

The user can add a new issue. This page will show where the user is and will register the issue on the same address. On the menu bar the user can: 

* Search a new place and register the issue on this place (c)
* Localize the user (d)
* Take a photo

To register a new issue the user will have to:

* Choose a type
* Add a description
*Add one or many tags
*Press the submit button (g)



## g. Details of an issue

![login page](/images/issueDetails.jpg)

The following informations of an issue can be viewed:

* The type
* The date of creation
* The date of the last update
* The localisation of the issue on a map

Two buttons can be found:

* Add a new comment (h)
* View all the comments (i)



## h. Add a new comment

![login page](/images/newComment.jpg)

The user can add a comment to an issue by writing text on the field and tap the button "Create". The user will be redirect to the list of comments (i).



## i. Comments list

![login page](/images/commentList.jpg)

The list of comments for an issue can be viewed on this page. Every comment will be shown with the following informations:

* The date of creation
* The author name and surname
* And the content of the comment

A button also give the possibility to add a new comment (h).



