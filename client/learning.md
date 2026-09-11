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
