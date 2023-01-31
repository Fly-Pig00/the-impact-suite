import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/views/pages/Home.vue";
import Search from "@/views/pages/Search.vue";
import Detail from "@/views/pages/Detail.vue";
import Order from "@/views/pages/Order.vue";
import Compare from "@/views/pages/Compare.vue";
import Matcher from "@/views/pages/Matcher.vue";
import { DEFAULT_TITLE } from "@/utils/constants";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: ""
    }
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
    meta: {
      title: "Search"
    }
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: Detail,
    meta: {
      title: "Detail"
    }
  },
  {
    path: "/compare/:ids",
    name: "Compare",
    component: Compare,
    meta: {
      title: "Charity Comparison"
    }
  },
  {
    path: "/order/:id?",
    name: "Order",
    component: Order,
    meta: {
      title: "Order Charity Report"
    }
  },
  {
    path: "/matcher",
    name: "Matcher",
    component: Matcher,
    meta: {
      title: "Charity Matcher"
    }
  },
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  // // This goes through the matched routes from last to first, finding the closest route with a title.
  // // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  // const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  //
  // // Find the nearest route element with meta tags.
  // const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  // const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.

  const meta = to.meta;
  document.title =
    (meta && meta.title ? meta.title + " | " : "") + DEFAULT_TITLE;

  // // Remove any stale meta tags from the document using the key attribute we set below.
  // Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));
  //
  // // Skip rendering meta tags if there are none.
  // if(!nearestWithMeta) return next();
  //
  // // Turn the meta tag definitions into actual elements in the head.
  // nearestWithMeta.meta.metaTags.map(tagDef => {
  //   const tag = document.createElement('meta');
  //
  //   Object.keys(tagDef).forEach(key => {
  //     tag.setAttribute(key, tagDef[key]);
  //   });
  //
  //   // We use this to track which meta tags we create, so we don't interfere with other ones.
  //   tag.setAttribute('data-vue-router-controlled', '');
  //
  //   return tag;
  // })
  // // Add the meta tags to the document head.
  //   .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router;
