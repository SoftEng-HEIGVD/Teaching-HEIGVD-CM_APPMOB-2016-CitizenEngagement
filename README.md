# CTHeroes mobile application

<a name="top"></a>

This repository contains the code to launch the ionic application.

* [Prerequisites](#pre)
* [Features](#features)

1. [user interface](#ui)
2. [Using the application](#using)
  * [Home dashboard](#home)
  * [Create new Issue](#newissue)
  * [Map of all issues](#map)
  * [List of all issues](#list)
  * [My profile](#profile)





<a name="pre"></a>
## Prerequisites

These instructions assume that you have implemented and deployed the Citizen Engagement API as described in [this article](http://www.iflux.io/use-case/2015/02/03/citizen-engagement.html) and [this course repository](https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_WEBS-2016).

You will need to have [Node.js](https://nodejs.org) installed.
The latest LTS (Long Term Support) version is recommended (v4.4.2 at the time of writing these instructions).
The Ionic documentation currently indicates that versions v5.x.x are not supported.

<a href="#top">Back to top</a>



<a name="features"></a>
## Features

This guide describes the list of features of this app:

* add new issues:
  * with a type, image, description and lat/long geolocation
* see existing issues on an interactive map;
* a dashboard with a small map and the latest posted issues by the user (if no issues have been posted, you have a quick link to report one)
* browse the list of existing issues:
  * sorted by date
* see the details of an issue:
  * date;
  * description;
  * picture;
  * comments;
* add comments to an issue.

We will give you details on how to use each feature
<a href="#top">Back to top</a>



<a name="ui"></a>
## 1. User Interface

We have created a design for our app available [here](https://www.fluidui.com/editor/live/preview/p_JGHaMwhypEvFRJXSJF2ELBFvhTuCJ7iW.1459774779362)
with [Fluid UI](https://www.fluidui.com).

![UI Design](www/img/readMe/fluid.PNG)

We have created a sandwich menu with different pannels (some changes have been made in the final app)

* the home tab
* the new issue tab;
* the issue map tab;
* the issue list tab:
  * the issue details screen doesn't appear on the side menu but when you click on a thumbnail


<a href="#top">Back to top</a>



<a name="using"></a>
## 2. Using the application



<a name="setup-fork"></a>
### Login
<img src="http://i.imgur.com/lgT94CL.png" alt="alt text" height="450px">

You can enter your first and last name. If you do not exist in the database, this will create a new account.
You then have to select if you want to view the app as a citizen or staff (this feature will come soon).

You can also create a new staff if you're a staff yourself (coming soon as well).


<img src="http://i.imgur.com/pzX1hNZ.png" alt="alt text" height="450px">
<a name="side"></a>
### Side menu
You can access all the important information from the side menu

<img src="http://i.imgur.com/U2S5j4A.png" alt="alt text" height="450px">
<a name="home"></a>
### Home dashboard
The home dashboard allows you to see your latest posted issues at a glance and the nearest issues to you.

<img src="http://i.imgur.com/mmO5I6B.png" alt="alt text" height="450px">

You can see all your posted issues if you click "view all"

If you do not have any issues, you will have a quick link to post a new one

<img src="http://i.imgur.com/wH2LjV1.png" alt="alt text" height="450px">

<a name="newissue"></a>
### Report new Issue

You can report a new issues by clicking on "Report new issue" on the side menu.

You can then select what type of issues you want to report, add a description, take a picture.

<img src="http://i.imgur.com/uB2ORfk.png" alt="alt text" height="450px">

It also detects where you are and adds the longitude and latitude

<img src="http://i.imgur.com/pIJM76Q.png" alt="alt text" height="450px">

The Issue is then created. We were not able to implement the redirection to the new issue though.

<a name="map"></a>
### Map of all issues
You can easily access the map by clicking on "map" on the side menu.

<img src="http://i.imgur.com/SxPr0nq.png" alt="alt text" height="450px">

If you click on a marker, a popup with the preview shows. You can then click on it to get the details.


<img src="http://i.imgur.com/um6DeiO.png" alt="alt text" height="450px">

You can see:
* an image
* the type
* the status
* who created it
* a map of where it is
* a description
* all the comments
* a button to create a comment

<img src="http://i.imgur.com/um6DeiO.png" alt="alt text" height="450px">

<a name="list"></a>
### List of issues

Here you can see all the issues created (latest ones first). It also implements an auto-scroll and loads the new issues when you get to the bottom of the page.

<img src="http://i.imgur.com/gbosdXb.png" alt="alt text" height="450px">

If you click on one, you can access the detailed issue like on the map.

<a name="profile"></a>
### My profile

You can access your profile in order to see:
* you name
* your last name
* number of issues posted
* a quick link to post an issue
* your role(s)

<img src="http://i.imgur.com/xKERUkS.png" alt="alt text" height="450px">

<a href="#top">Back to top</a>
