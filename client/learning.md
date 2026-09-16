#### 1

1. remove App.css
2. remove all css from index.css
3. remove all images from public
4. remove all things from assets
5. install extenstions of

- ES7+ React/Redux/React-Native snippets by dsznajder
- Auto Rename Tag by Jun Han
- Console Ninja by Wallaby.js
- Tailwind CSS IntelliSense by Tailwind Labs

#### 2 create pages and browser router

1. used pkg of react-router-dom
2. create home, about-us, profile, signup and signin routes
3. mistake i made

- not entering forward slash in path and then element attribute has component in it
  <Route path="/" element={<Home/>}/>

#### 3 create header component in src/components folder

1. use react-icons for search icon
2. in writing css of tailwind ALWAYS REMEMBER Mobile FIRST appraoch
3. Link in react-router-dom provides us with navigating to other route instad of FULL PAGE RELOAD or full page refresh

## Responsive Navigation

**Decision:**
Keep all primary navigation available on mobile and switch from
horizontal navigation to a collapsible menu below the `sm` breakpoint.

**Why:**
Hiding navigation items on smaller screens removes functionality.
Responsive navigation should adapt presentation rather than remove
important destinations.

**Alternative:**
Hide secondary links on mobile.

**Why rejected:**
Users should still be able to access About without relying on
another route or footer.

**Trade-off:**
Adds a small amount of UI state and interaction complexity.

**Chosen because:**
The complexity is minimal and provides a better responsive UX.

#### create a server

1. instal express, dotenv
2. move git from client to root so that deployment on render becomes easy

#### connect to db

1.  install mongoose
2.  what i learn is that since i m using type: module so
    // to send any function do

                                     // ONE WAY

```js
  const connectDB = async(){

  }

  export default connect DB


  //and to import

  import connectDB from file_path
```

                                    // Second way of NAmed export

```js
  export const connectDB = async(){

  }


  //and to import

  import {connectDB} from file_path
```

3. use of env for MONGO_URL

#### crate a test api route

1. learn that we wlll be using Proxy in future in order to decouple or client code
   from backend url because we dont want that our front end is having our EXPLICIT backend enpoint bccause in evelopmet it will be lcalhost but in future WHEN DEPLOYED , we wil be changing it everywhere in whoel fe code
2. adv will be CLEARN URLS, CENTRALISED ROUTING, easier CORS handling
3. DISADV is that More INfrastructure, More Confugurations
4. 2 types , Forward Proxy lke pucit having
   request->forward proxy ->Internet
   REverse Proxy
   mostly used like Nginx, Apache, CLoudflare, Kubernetes
   request->Internet->
5. in order to prevent index to be large file we use
   - roues , -> good practice is user.routes
     when importing contoller in route file ALWAYS add .js with file name
   - controllers(having business logic) -> good practice is user.controller
     since we would be having many functions or actions in controller so HAVE TO use NAME EXPORT here
   - models -> user.model.js
6. after doing defult export , we can rename in app.js as userRouter via
   import userRouter from "./routes/user.router.js"
7. Always put .js file exension in module type of applcations
8. NOT DONE YET error middleware and utils./ErrorHanler

#### create a signup route

1. since we have to accepte data from FE so use app.use(express.join) or any other like urlencoded
2. hash the pasword in contoller actiosn seem repetitive so create model method as callback or method nad use them in controllers [ BEST PRACTICE ]
   <<< REMEMBER that in model methods where you want to access data of document then that model's function's function must not be arror becuase REMEMBER
   arrow has not this>>>
3. always remember to put async and await in time taking tasks and when there is such time taking or external task like querying a db then always put try/catch also

#### complete ui functionality

1. onchange event listener??
2. ctrl + space in vs code for suggestion
3. dont want to referesh page so use event.preveedefault
4. always fr fucntionaiity form me action hoga and then onChange to each input field;s function will set state of form data for submtting it to server
5.

# Forward Proxy vs Reverse Proxy

### Core Definition

> **Forward Proxy = represents the CLIENT.**
> **Reverse Proxy = represents the SERVER.**

| Point                   | Forward Proxy                                          | Reverse Proxy                                          |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| **1. Represents**       | Client                                                 | Server                                                 |
| **2. Direction**        | Client → Proxy → Internet                              | Internet → Proxy → Backend                             |
| **3. Main purpose**     | Control/protect **outbound client traffic**            | Protect/scale **inbound server traffic**               |
| **4. Common use cases** | IP hiding, content filtering, corporate access control | Load balancing, SSL termination, caching, routing, WAF |

### Production Examples

**Forward Proxy:**

```text
Employees → Corporate Proxy → Internet
```

Used by organizations to control/filter employees' internet access.

**Reverse Proxy:**

```text
Users → Nginx/Cloudflare → Backend Servers
```

Used to hide backend infrastructure, route requests, load-balance traffic, terminate SSL, etc.

### Vite Example

```text
Browser → Vite Dev Server → Backend
```

Vite's `server.proxy` is acting as a **reverse proxy** because it sits in front of the backend and forwards client requests to the backend.

### 🧠 Interview Memory Trick

> **Forward = CLIENT's representative → traffic going OUT.**
> **Reverse = SERVER's representative → traffic coming IN.**

### ⭐ Interview Answer

> "A forward proxy acts on behalf of clients to access external resources, while a reverse proxy acts on behalf of servers to receive and route client requests. Forward proxies are commonly used for client-side access control and privacy, whereas reverse proxies are commonly used for load balancing, security, caching, SSL termination, and routing."

#### create sign in api

1. remember in js6 if User.findOne(email) is ocrect instead of User.findOn(email:email)

```text
    const user = await User.findOne({ email }).select("+password");

    instead of
    const user = await User.findOne({ email: email }).select("+password");
```

2. jwt sign, compare
3. jwt via cookie so expire it
4. remember in model where you need self document then always don use arrow function
5. MONgo Db is ODM not ORM
6. added validator and jwt in packages for model level validations and jwt generation on sign in

#### complete sign in functonality alon with ui

1. in sign in ui page while writing p tag of Dont have account Sign up
   never write apostrophee in Dont as will cuse issue in prod ??
2. never send password in FE
3. BUT since password selection is false in model level so in login when querying user for finding it in db then do select(+password) WHY because password comparison is done via compare
   bcrypt -> hash, compare
   methof of bcryptjs but in jwttoken remove it so that client dont use it
4. after user coming in FE, we have to use Redux to set data globally for React app to be used in Profile editing etc

#### add redux tool kit to application

1. to solve above PROBLEM of having user globally we would be using redux
2. steps -> instal redux-toolkit, devredux, create store, wrap whole app by store and provider, create slices like userSlice and in it store states of each resource like for user startSignIn, save result ,endSignIn in slicer's reducers, then import those slicers in store, and then updating UI like signin.jsx to use useSelector to fetch data from store and useDispatch to set data in store via reducers
3. PROBLEM after doing it, one issue is that on referesh data is not persisted in store
   SOLUTION is having redux persist which will be covered next

important link
https://daveceddia.com/javascript-references/
https://daveceddia.com/react-redux-immutability-guide/
https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#immutability

4. in store middlware explanation

> middleware allows us to customize the default Redux middleware used by configureStore. Here, getDefaultMiddleware() keeps the default middleware but disables the serializable check. Advantage: avoids warnings/errors when actions or state contain non-serializable values like File or Date. Disadvantage: disabling the check can hide bugs caused by accidentally storing non-serializable data in Redux.

#### redux persist

1. REDUX PERSIST — INTERVIEW

WHAT?
→ library Persists Redux state to storage.

WHY?
→ Redux state normally disappears on page refresh.
→ Persisted state survives refresh/restart.

HOW?
→ persistReducer() wraps the reducer.
→ persistStore(store) creates the persistor.
→ PersistGate waits for rehydration.

FLOW:

STATE CHANGE
↓
Redux Store
↓
redux-persist
↓
Storage 💾

PAGE REFRESH
↓
Storage
↓
redux-persist
↓
REHYDRATION
↓
Redux Store
↓
React App

GOLDEN LINE:
"Redux Persist persists required Redux state to storage
and rehydrates it when the application starts."

KEYWORD:
Persist = SAVE
Rehydrate = RESTORE

#### adding google oauth in app for signing in

1. will use Firebase Google Athentication account and its Authentication feature

   > open firebase google accunt->sign in colsone->getting start project name -> disable gemini and google analytics -> after successful creation -> will see project show page -> will see + Add app button (small sized) Click on it -> click web -> register app menu wil open, write of app and click on Register app -> Adding SDK [ i- install firebase pckage ii- write sdk code and at end EXPORT app iii- click on Continue to console button ] -> Go to autehtication -> signin method -> select google -> Enable -> enter public facing name of app and then select gamil and CLICK SAVE ->>>>>>>>>>>>>>>>> SUCCCCCCCESSSSSSSSSS

```js
  IMP THING IS we dont need to use .js for FE importing jsx files
```

2. will use Firebase SDK to connect our app with firebase
3. store api_key of firebase again in ENV (convetion for env for vite is VITE_ENV_NAME and import.meta.env to import)
4. REmeber to add atleast 2 acccounts to see popup to select account to signin
5. once selected anyone then google will provide complete user from which
   - email
   - photo
   - display_name
     are important for us
6. create a column of avatar in User as we will be using photo in future
7. we will check that
   if email is not present in our db then create user by having random password but hash this password again in order to store it in db and create token and send to client via cookie
   else email present since email is unique so fetch user and send user in FE
8. on succesfull signin set store of redux also and then redirect route of /

flow

```bash
USER
 │
 │ Click "Continue with Google"
 ▼
React
 │
 │ signInWithPopup()
 ▼
Firebase Authentication
 │
 │ Google OAuth
 ▼
Google
 │
 │ successful authentication
 ▼
Firebase
 │
 │ Firebase User
 │
 │ getIdToken()
 ▼
React
 │
 │ Authorization: Bearer <ID_TOKEN>
 ▼
Express
 │
 │ Firebase Admin
 │
 │ verifyIdToken()
 ▼
Trusted Firebase identity
 │
 ├── uid
 ├── email
 ├── name
 └── picture
 │
 ▼
MongoDB User
 │
 ├── Existing user → update/link
 │
 └── New user → create
 │
 ▼
sendToken()
 │
 ▼
Your application's JWT
 │
 ▼
React Redux
 │
 ▼
Authenticated application
```

```bash
Firebase ID Token
       │
       │ proves:
       │ "Firebase authenticated this Google user"
       ▼
Express backend
       │
       │ verifies it
       ▼
Your application JWT
       │
       │ proves:
       │ "This is an authenticated user
       │  in MY application"
       ▼
Your protected API routes
```

_`Engineering JUDGEMENT`NEVER write next in model's functions_

##### Next secti will be covering how to set header with these data coming from server or from local db AND Protect rotues so that only signed users can see "/"

#### header saving user info and privatising routes

```bash
             PROTECTED ROUTE
                   │
                   ▼
             PrivateRoute
                   │
          Check Redux auth state
                   │
             currentUser?
              /         \
            YES          NO
             │            │
             ▼            ▼
         <Outlet />   <Navigate />
             │            │
             ▼            ▼
        Child Route    /sign-in
```

> implemented protected routes using a route-guard pattern. The PrivateRoute checks the authenticated user from Redux; authenticated users are rendered through Outlet, while unauthenticated users are redirected using Navigate."

1. since getting data having
   user, success, token
   so thats why set in store data.user
   so that in header can do curretn_user.avatar
2. React Router
   │
   ├── <Outlet />
   │ └── Nested route rendering
   │ "Where should child route render?"
   │
   ├── <Navigate />
   │ └── Declarative redirect
   │ "Redirect user to another route"
   │
   ├── useNavigate()
   │ └── Imperative/programmatic navigation
   │ "Navigate because an event/logic happened"
   │
   └── useNavigation()
   └── Navigation state
   "Is router currently navigating/submitting?"
   ⭐ Golden interview lines

`Outlet`:

"Outlet is a placeholder for rendering matched nested child routes within a parent route."

`Navigate`:

"Navigate is a declarative redirect component; I commonly use it in protected routes to redirect unauthenticated users."

`useNavigate`:

"useNavigate is a hook that provides programmatic navigation, typically used after an event or business operation such as login, logout, or form submission."

`useNavigation`:

"useNavigation exposes the current navigation state, which I can use to implement loading or pending UI during route transitions."

The easiest memory trick

> Outlet → WHERE child renders Navigate → REDIRECT somewhere useNavigate → TELL router to go somewhere useNavigation→ KNOW router's current state

#### complete profile page ui

1. mx-auto will bering in center irrspecive of viw port
2. always put id with input fileds in order to identify them while fetching data from them

#### Complete image uplading functioality

1. see imaage will be uploaded on some cloud so we are using Firebase for this

> TILL YET WE HAVE USED 2 SERVICES OF FIREBASE OF AUTH AND STORAGE

for using firebase for storage

- first login in firebase with gmail
- select your project in console
- on left menu db and stroage -> storage
-

```bash
                                            1. SELECT
                                        User selects image
                                                ↓
                                            2. STATE
                                            setFile(file)
                                                    ↓
                                            3. UPLOAD
                                            Firebase Storage
                                                    ↓
                                            4. PROGRESS
                                            0% → 100%
                                                    ↓
                                            5. URL
                                            Firebase downloadURL
                                                    ↓
                                            formData.avatar
                                                    ↓
                                            Display image
```

IMAGE UPLOAD
│
├─ 1. useRef
│ → access hidden file input
│
├─ 2. File input
│ → get File object
│
├─ 3. setFile()
│ → store selected file
│
├─ 4. useEffect()
│ → detect file change
│
├─ 5. Firebase Storage
│ → store actual image
│
├─ 6. uploadBytesResumable()
│ → upload + progress
│
├─ 7. state_changed
│ → progress / error / complete
│
├─ 8. getDownloadURL()
│ → obtain image URL
│
├─ 9. formData.avatar
│ → hold URL
│
└─ 10. Backend + MongoDB
→ persist URL with user

2. upload the image to Firebase Storage using a resumable upload
3. track its progress through state_changed,
4. retrieve the resulting download URL, and
5. persist that URL as the user's avatar rather than storing the binary image in MongoDB

#### create or update user

1. // why again findById in action though we had quered mongodb for user fetching in middleware of auth but it might possible that our profile has stale data or non fresh data so to prevent it again fetch

2. remember that if password given from FE then only update it but before updating dehash it so that we can see user has entered previous one if entered previous one then dont assign any thing to user(memoery object going to save) else changed then assign user.password = userUser.password so that it can be hashed by model method

#### complete update profile functoanity icdung ui

1.  issue was ccuring is that when server send data it was sending as
    {
    success: true/false;
    user: {

        }

    }
    and i was dispatching in signin, oauth and update as
    dispatch(signInSuccess(data))
    ^ it was resulting in

```js
current_user : {
    user: {
        email:...
    }
}
```

But i want

```js
current_user : {
    email:
    ...
}
```

so i do

> dispatch(data.user)

> WHCICH SOLVES THE ISSUE

#### delete user functionality

_`Engineering JUDGEMENT`Yes for EACH functionality we keep on ading reducers like for delete we add deleteUserStart, deleteUserSuccess and deleteUserEnd in slice of that resource like for user add reducers in userSlice_

#### sign out functionlity

1. just clear the cookie
   `SIMILAR TO DELETE USER`
2. again since it is new fucntinaity to `User` resource so have reducers of it
   in userSlice

#### LISING API (Antoher resource)
1. start with       M                       odel
2. then             C                       ontroller Action
3. then             R                       oute
4. then include Route in App.jsx
5. buildng create route of lsting
6. we can ceate custom validtor using
```js
 validate: {
    validator : (urls)=>urls.length>0,
    message: "urls must be greater than 0"
 }
```
7. never miss / in writing routes 
router.route("api/v1/listings").post(isUserAuthenticated, createListing);
^ WRONG
router.route("/api/v1/listings").post(isUserAuthenticated, createListing);
^ RGHT

#### UI of create listing
1. have to make moble resonse
2. create CreateListing RFC under proteeced routes in app.jsx
3. when ceating UI, adopt mobile first approach while writing tailwind css
4. id attribute helps to track changes in inputs in form

#### complee functinaity of craete listing
1. use type= button for upload of images so that overall form dont get sbmitted
2. we are going to have more than one asyc beahaviour so need to wait for ALL of them
they should be stored one by one so we have to return more than promise
prmises length would be equal to length of files state array length
3. for each file call storeImage function that wil be async as it will be uploading to cloud so 
4. progress is not required but preview of image is required 
5. use Promise.all and use imgUrls as specific key in formData while for other ids will be used as id of state
6. add error and null for image uploading 
7. delete for image preview will also be of type=button not submit
8. make delete funciton of preview of images to be callback function in order to prevent from automatic submission
9. temprarily using image url as firebase is not configured and requiring payasyou go 

Conditional required
required: function () {
  return this.someField === true;
}

Meaning:

Make this field required only when another field satisfies a condition.

Example:

discountPrice: {
  type: Number,
  required: function () {
    return this.offer === true;
  }
}
offer	discountPrice required?
false	❌ No
true	✅ Yes
Mongoose validator
validate: {
  validator: function (value) {
    return CONDITION;
  },
  message: "Error message",
}

Remember:

value → current field's value
this → current Mongoose document

So:

value

→ discountPrice

this.offer

→ current listing's offer

this.regularPrice

→ current listing's regularPrice

The magic line
return !this.offer || value <= this.regularPrice;

Translate it mentally as:

No offer OR discount price is valid.

3 scenarios to memorize
offer: false
discountPrice: undefined

✅ Valid

offer: true
regularPrice: 1000
discountPrice: 800

✅ Valid

offer: true
regularPrice: 1000
discountPrice: 1200

❌ Invalid

⭐ One-line interview answer

If interviewer asks “How do you conditionally make a Mongoose field required?”

“I use a function for the required validator and return a condition based on another field. For example, required: function() { return this.offer === true; } makes discountPrice mandatory only when the listing has an offer.”

🔑 Final mental shortcut
required
   ↓
"DO I NEED THIS FIELD?"

validate
   ↓
"IF I HAVE IT, IS ITS VALUE VALID?"

this
   ↓
"CURRENT DOCUMENT"

value
   ↓
"CURRENT FIELD'S VALUE"

#### complete users's listing in profile page

1. Alaway use key in map for better react rendering
2. 

#### delete users listing
1. always remember
```js
if (!listing.userRef.equals(req.user.id)) {

    or


    if (req.user.id != listing.userRef.toString())) {
```

2. why callback in order to prevent from running functon without click

```js
onClick={() => handleListingDelete(listing._id)}
```

3. never write findById({})
inseaad write findById(id)

#### complete functinlaity of edditng a listing
_`Engineering JUDGEMENT`NEVER write code as useEffect(async ()=>{}) INSTEAD DO AS useEffect( ()=>{ const funcName = async(req, res, next)=>{ } } )Reason is that useEffect is already is asynchronous_

1. show page of listing is non protected means guest user can also see it but for buying or contacting signing and logging in will be reqquired
2. generic

```js
const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };
```

it will check since each inut has id, value, checked, type
so it will check if type is checkbox then use property of checked to determine true or false else use value of input field

3. Last-minute notes
Array.from(value)

Converts iterable / array-like → Array.

Creates a new array.

FileList → Array for .map(), .filter(), .some().

Can transform items using a second argument.

Does not magically convert every object into an array.

Mnemonic: FROM = "Make an Array FROM this collection.

#### search the listing

1. rememeber that undefined is written as undefined or 'undefined'
2. we are applying seaching as if given then search that one else include all subvariants of variant
means if offer is not given then 
means 
undefined(nhn select kee) so include listings of both offer as well as non offered
or false(chorr dee) so include listings of both offer as well as non offered

localhost:8000?searchTem='moden'&type='all'
req.query.searchTerm
req.query.type

_`Engineering JUDGEMENT` if postman or insomnia is not there then use beolow_

┌──────────────────────────────────────────────┐
│              CURL CRUD CHEATSHEET            │
├──────────────────────────────────────────────┤
│                                              │
│ CREATE                                       │
│ curl -X POST "URL"                           │
│   -H "Content-Type: application/json"        │
│   -d '{"field":"value"}'                     │
│                                              │
│ READ                                         │
│ curl "URL"                                   │
│                                              │
│ READ ONE                                     │
│ curl "URL/ID"                                │
│                                              │
│ UPDATE                                       │
│ curl -X PUT "URL/ID"                         │
│   -H "Content-Type: application/json"        │
│   -d '{"field":"newValue"}'                 │
│                                              │
│ DELETE                                       │
│ curl -X DELETE "URL/ID"                     │
│                                              │
└──────────────────────────────────────────────┘

curl "http://localhost:3000/api/v1/listings/index" -o listings.json

3. 
> In Express, put static/specific routes before /:id routes because Express matches routes in order.


#### complete search functon

1. insight is that when search box is changed and typed and clickde search icon then url should have that term
2. input of search is enclosed in form and search icon is enclosed in button tag
3. useParams was used when specific listing had to be viewed
4. from react-router-dom Link and useNavigate are extracted
5. URLSeachParams is being used here so that in order to maintain url and can extract query params from it
6. 

#### create search page

1. non protecte

#### add fucntionality to search page means by selecting filters url be change

2. handleChange would be versatile because we have boolearn, text and value(searchTerm)
3. after entering all filters and clicking submit
- form should be sumbitted
- url be changed
- but existing filters of header should retain in url
**-> Solu **
-> first build url from sidebarFormData of search page and then call api
-> it will resolve issue that when searchTerm of form changes then header is also changed
-> BUT PROBLEM is that header when submitted does not change searchTerm of form of UI of Search now unto it SOLU is USEEFFECT that whenver widn.location changes then set search page state ---> it will result in behaiour that URL CHANGES WIL CHANGE UI OF SEARCH FILTER FORM aND within the same useeffect that is detecting location.search call api of search and get listing having APPLIED FILTERS

TWO WAY EFFECT IMPLEMNTED
4. use onSubmit listener on form


#### creating card of listing to show after searching in Search Page
1. installtailwind-line-clamp to resirct desc to 2 line

_`Engineering JUDGEMENT` Whenever config changes of tailwind or anything restart server_

