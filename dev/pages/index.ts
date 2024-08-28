import {
  CollectionIcon,
  ColorSwatchIcon,
  DocumentTextIcon,
  LocationMarkerIcon,
  PencilAltIcon,
  TableIcon,
  UserGroupIcon,
  HomeIcon,
  StatusOnlineIcon,
} from "@heroicons/vue/outline"

import Elements from "./Elements.vue"
import Forms from "./Forms.vue"
import Indicators from "./Indicators.vue"
import Lists from "./Lists.vue"
import Navigation from "./Navigation.vue"
import Overlays from "./Overlays.vue"
import Team from "./Team.vue"
import Tools from "./Tools.vue"
import Home from "./Home.vue"

export const homePage = {
  name: "Home",
  description: "",
  icon: HomeIcon,
  url: import.meta.env.BASE_URL,
  component: Home,
}

export const pages = [
  {
    name: "Forms",
    description:
      "Forms are the bread and butter of any application. Get with it and check this shit out.",
    icon: DocumentTextIcon,
    url: `${import.meta.env.BASE_URL}?page=Forms`,
    component: Forms,
  },
  {
    name: "Navigation",
    description:
      "Let's move around. Change some things. You're looking at this and now you're looking at that.",
    icon: LocationMarkerIcon,
    url: `${import.meta.env.BASE_URL}?page=Navigation`,
    component: Navigation,
  },
  {
    name: "Lists",
    description:
      "Do you even know what a list looks like? We've got some examples to dandy.",
    icon: TableIcon,
    url: `${import.meta.env.BASE_URL}?page=Lists`,
    component: Lists,
  },
  {
    name: "Overlays",
    description: "Take it over. Emit to the bus. Get it right. Get it tight.",
    icon: CollectionIcon,
    url: `${import.meta.env.BASE_URL}?page=Overlays`,
    component: Overlays,
  },
  {
    name: "Indicators",
    description: "What is happening?  What step am I on?",
    icon: StatusOnlineIcon,
    url: `${import.meta.env.BASE_URL}?page=Indicators`,
    component: Indicators,
  },
  {
    name: "Elements",
    description: "Elements are elemental. Check them out. CSS only.",
    icon: ColorSwatchIcon,
    url: `${import.meta.env.BASE_URL}?page=Elements`,
    component: Elements,
  },
  {
    name: "Tools",
    description: "Sometimes you need more than just UI elements.",
    icon: PencilAltIcon,
    url: `${import.meta.env.BASE_URL}?page=Tools`,
    component: Tools,
  },
  {
    name: "Team",
    description:
      "Our team once built something that helped the company, and we've been grateful ever since.",
    icon: UserGroupIcon,
    url: `${import.meta.env.BASE_URL}?page=Team`,
    component: Team,
  },
]
