export const THEME_CONFIG: App.Locals["config"] = {
  /** blog title */
  title: "博客",
  /** your name */
  author: "江辰",
  /** website description */
  desc: "博客|江辰|独立开发者|前网易高级开发工程师",
  /** your deployed domain */
  website: "https://github.com/xuya227939",
  /** your locale */
  locale: "zh-cn",
  /** theme style */
  themeStyle: "light",
  /** your socials */
  socials: [
    {
      name: "github",
      href: "https://github.com/xuya227939",
    },
    {
      name: "rss",
      href: "/atom.xml",
    },
    {
      name: "twitter",
      href: "https://twitter.com/hezhiqianye",
    },
  ],
  /** your header info */
  header: {
    twitter: "@江辰",
  },
  /** your navigation links */
  navs: [
    {
      name: "Posts",
      href: "/posts/page/1",
    },
    {
      name: "Archive",
      href: "/archive",
    },
    {
      name: "Categories",
      href: "/categories",
    },
    {
      name: "About",
      href: "https://github.com/xuya227939",
    },
  ],
  /** your category name mapping, which the `path` will be shown in the url */
  category_map: [{ name: "江辰", path: "https://github.com/xuya227939" }],
};
