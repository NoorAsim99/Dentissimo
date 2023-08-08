<template>
  <div class="container">
    <div class="col-md-3"></div>
    <div id="app">
      <header class="header_reg">
        <router-link class="logo" to="/">
          <img class="logo" src="assets/DentistLogo.png" alt="Logo" />
        </router-link>
        <nav>
          <ul class="nav__links"></ul>
        </nav>
        <router-link class="login_btn w700" to="/login"><b>Log in</b></router-link>
        <router-link class="register_btn w700" to="/register"
          ><b>Sign up</b></router-link
        >
      </header>
    </div>
    <div class="col-md-3"></div>
    <!-- Render the content of the current page view -->
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
@media screen and (max-width: 800px) {
  .logo {
    display: none;
  }
}
.btn_message {
  margin-bottom: 1em;
}
.loginField {
  color: white;
}

/* Style the navigation menu */
.topnav {
  overflow: hidden;
  background-color: #333;
  position: relative;
}

/* Hide the links inside the navigation menu (except for logo/home) */
.topnav #myLinks {
  display: none;
}

/* Style navigation menu links */
.topnav a {
  color: white;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  display: block;
}

/* Style the hamburger menu */
.topnav a.icon {
  background: black;
  display: block;
  position: absolute;
  right: 0;
  top: 0;
}

/* Add a grey background color on mouse-over */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}

/* Style the active link (or home/logo) */
.active {
  background-color: #04aa6d;
  color: white;
}

/* Top bar  */
li,
a,
button {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: white;
  text-decoration: none;
}

.header_reg {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 30px 10%;
}

.logo {
  cursor: pointer;
  margin-right: auto;
}

.nav__links {
  list-style: none;
}

.nav__links li {
  display: inline-block;
  padding: 0px 20px;
}

.nav__links li a {
  transition: all 0.3s ease 0s;
}

.nav__links li a:hover {
  color: #d90429;
}

.login_btn {
  margin-left: 20px;
  padding: 9px 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}

.register_btn {
  margin-left: 0.5em;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 50px;
  border: 2px solid white;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}
</style>
